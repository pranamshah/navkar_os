import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail, sendAdminNotification } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function generateClientId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `NVK-${year}-${rand}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, email, phone, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    let clientId = generateClientId();
    let attempts = 0;
    while (await prisma.user.findUnique({ where: { clientId } })) {
      clientId = generateClientId();
      if (++attempts > 10) throw new Error("Could not generate unique client ID");
    }

    await prisma.user.create({
      data: { clientId, name, email, phone, whatsapp: phone, hashedPassword, role: "CLIENT", status: "PENDING_VERIFICATION" },
    });

    // Emails — never throw, just log
    await sendWelcomeEmail(email, name, clientId);
    await sendAdminNotification(
      `New Signup: ${name} — ${email}`,
      `<p>New user: <strong>${name}</strong> (${email})<br>Client ID: ${clientId}</p>`
    );

    return NextResponse.json({ success: true, redirectUrl: "/onboarding" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
