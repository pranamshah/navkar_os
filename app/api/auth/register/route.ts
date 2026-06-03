import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Check email not already registered
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    let clientId = generateClientId();

    // Ensure clientId is unique
    let attempts = 0;
    while (await prisma.user.findUnique({ where: { clientId } })) {
      clientId = generateClientId();
      if (++attempts > 10) throw new Error("Could not generate unique client ID");
    }

    const user = await prisma.user.create({
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

    // Send welcome email
    try {
      await resend.emails.send({
        from: "NavkarOS <noreply@navkaros.com>",
        to: email,
        subject: "Welcome to NavkarOS — Application Received",
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
            <div style="background: #1a1c1c; padding: 24px 32px; display: flex; align-items: center; gap: 12px;">
              <span style="background: #D4AF37; color: #1a1c1c; font-weight: 900; padding: 6px 10px; border-radius: 6px;">N</span>
              <span style="font-weight: 900; font-size: 13px; letter-spacing: 0.1em; color: #fff; text-transform: uppercase;">NavkarOS</span>
            </div>
            <div style="padding: 32px; background: #fff; border: 1px solid #e5e7eb;">
              <p style="font-size: 14px; color: #4c4546; margin: 0 0 16px;">Hi ${name},</p>
              <p style="font-size: 14px; color: #4c4546; margin: 0 0 16px;">
                Welcome to NavkarOS! Your application has been submitted successfully.
              </p>
              <div style="background: #f9f9f9; border: 1px solid #e5e7eb; padding: 20px; border-radius: 4px; margin: 24px 0;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #7e7576; text-transform: uppercase; letter-spacing: 0.08em;">Your Client ID</p>
                <p style="margin: 0; font-family: monospace; font-size: 24px; font-weight: 900; color: #1a1c1c; letter-spacing: 0.08em;">${clientId}</p>
                <p style="margin: 8px 0 0; font-size: 11px; color: #7e7576;">Save this — you can use it to log in at any time.</p>
              </div>
              <p style="font-size: 14px; color: #4c4546; margin: 0 0 16px;">
                <strong>What happens next:</strong>
              </p>
              <ol style="font-size: 14px; color: #4c4546; padding-left: 20px; margin: 0 0 24px; line-height: 1.8;">
                <li>Complete your business onboarding (takes ~5 minutes)</li>
                <li>Our team will verify your documents within <strong>48 business hours</strong></li>
                <li>You will receive a confirmation on email &amp; WhatsApp</li>
                <li>Start your free 14-day trial on any product</li>
              </ol>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/onboarding" style="display: inline-block; background: #1a1c1c; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
                Complete Onboarding →
              </a>
            </div>
            <div style="padding: 16px 32px; background: #f9f9f9; border: 1px solid #e5e7eb; border-top: none;">
              <p style="margin: 0; font-size: 11px; color: #7e7576;">
                Questions? Email us at <a href="mailto:support@navkaros.com" style="color: #D4AF37;">support@navkaros.com</a>
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Welcome email failed:", emailErr);
    }

    // Notify admin
    try {
      await resend.emails.send({
        from: "NavkarOS <noreply@navkaros.com>",
        to: process.env.ADMIN_EMAIL ?? "pranam@navkaros.com",
        subject: `New Signup: ${name} — ${email}`,
        html: `<p>New user registered: <strong>${name}</strong> (${email})<br>Client ID: ${clientId}</p>`,
      });
    } catch {}

    return NextResponse.json({ success: true, redirectUrl: "/onboarding" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
