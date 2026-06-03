import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: Request) {
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
