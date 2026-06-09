import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { identifier, otp } = await req.json();
    if (!identifier || !otp) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const user = await prisma.user.findFirst({
      where: { OR: [{ clientId: identifier }, { email: identifier }] },
    });

    if (!user) return NextResponse.json({ error: "Account not found" }, { status: 404 });
    if (!user.otpCode || !user.otpExpiry) return NextResponse.json({ error: "No OTP requested" }, { status: 400 });
    if (new Date() > user.otpExpiry) return NextResponse.json({ error: "OTP expired. Request a new one." }, { status: 400 });
    if (user.otpCode !== otp) return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });

    // Generate a one-time sign-in token valid for 3 minutes.
    // The credentials provider accepts this instead of a password.
    const signInToken = `otp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const tokenExpiry = new Date(Date.now() + 3 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: signInToken, otpExpiry: tokenExpiry },
    });

    return NextResponse.json({
      success: true,
      email: user.email,
      signInToken,
      redirectUrl: user.status === "ACTIVE" ? "/dashboard/client" : "/status",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
