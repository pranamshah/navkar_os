import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail, sendAdminNotification } from "@/lib/email";
import { rateLimit, getIP } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function generateClientId(name: string) {
  // Format: 3 uppercase letters from name + 5 random digits — no hyphens
  const prefix = name
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, "X");
  const digits = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${digits}`;
}

export async function POST(req: Request) {
  // Rate limit: 5 registrations per IP per hour
  const rl = rateLimit(`register:${getIP(req)}`, 5, 60 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${rl.retryAfter} seconds.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, email, phone, password } = parsed.data;

    // Check database connectivity first
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      console.error("Database not connected — DATABASE_URL may not be set");
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again in a moment." },
        { status: 503 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let clientId = generateClientId(name);
    let attempts = 0;
    while (await prisma.user.findUnique({ where: { clientId } })) {
      clientId = generateClientId(name);
      if (++attempts > 10) throw new Error("Could not generate unique client ID");
    }

    await prisma.user.create({
      data: {
        clientId,
        name,
        email,
        phone,
        whatsapp: phone,
        hashedPassword,
        role: "CLIENT",
        status: "PENDING_VERIFICATION",
      },
    });

    // Fire emails async — never block registration on email failure
    Promise.allSettled([
      sendWelcomeEmail(email, name, clientId),
      sendAdminNotification(
        `New Signup: ${name} — ${email}`,
        `<p>New user: <strong>${name}</strong> (${email})<br>Client ID: <strong>${clientId}</strong></p>`
      ),
    ]).catch(() => {});

    return NextResponse.json({ success: true, redirectUrl: "/onboarding" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Registration error:", message);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
