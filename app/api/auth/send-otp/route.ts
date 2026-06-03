import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";
import { rateLimit, getIP } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limit: 5 OTP requests per IP per 10 minutes
  const rl = rateLimit(`otp:${getIP(req)}`, 5, 10 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: `Too many OTP requests. Wait ${rl.retryAfter} seconds.` },
      { status: 429 }
    );
  }

  try {
    const { identifier } = await req.json();
    if (!identifier) return NextResponse.json({ error: "Identifier required" }, { status: 400 });

    const user = await prisma.user.findFirst({
      where: { OR: [{ clientId: identifier }, { email: identifier }] },
    });
    if (!user) return NextResponse.json({ error: "No account found with this ID" }, { status: 404 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({ where: { id: user.id }, data: { otpCode: otp, otpExpiry: expiry } });

    await sendOtpEmail(user.email, user.name, otp);

    return NextResponse.json({
      success: true,
      email: user.email.replace(/(.{2}).+(@.+)/, "$1***$2"),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
