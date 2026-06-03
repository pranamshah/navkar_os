import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json(); // clientId or email
    if (!identifier) return NextResponse.json({ error: "Identifier required" }, { status: 400 });

    // Find user by clientId or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { clientId: identifier },
          { email: identifier },
        ],
      },
    });

    if (!user) return NextResponse.json({ error: "No account found with this ID" }, { status: 404 });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: otp, otpExpiry: expiry },
    });

    // Send OTP email
    await resend.emails.send({
      from: "NavkarOS <noreply@navkaros.com>",
      to: user.email,
      subject: `Your NavkarOS OTP: ${otp}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background: #1a1c1c; padding: 24px 32px;">
            <span style="font-weight: 900; font-size: 13px; letter-spacing: 0.1em; color: #D4AF37; text-transform: uppercase;">NavkarOS</span>
          </div>
          <div style="padding: 32px; background: #fff; border: 1px solid #e5e7eb;">
            <p style="font-size: 14px; color: #4c4546; margin: 0 0 24px;">Hi ${user.name},</p>
            <p style="font-size: 14px; color: #4c4546; margin: 0 0 24px;">Your one-time password for NavkarOS login:</p>
            <div style="background: #f9f9f9; border: 1px solid #e5e7eb; padding: 24px; text-align: center; margin-bottom: 24px;">
              <span style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 0.2em; color: #1a1c1c;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #7e7576; margin: 0;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, email: user.email.replace(/(.{2}).+(@.+)/, "$1***$2") });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
