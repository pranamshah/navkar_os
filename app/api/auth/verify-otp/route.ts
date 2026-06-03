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

    // Clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpiry: null },
    });

    // Return user email so client can sign in via Credentials
    return NextResponse.json({
      success: true,
      email: user.email,
      redirectUrl: user.status === "ACTIVE" ? "/dashboard/client" : "/status",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
