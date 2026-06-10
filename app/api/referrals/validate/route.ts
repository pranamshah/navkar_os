import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public endpoint — no auth required
// POST { code } → { valid, discountPercent, message }
export async function POST(req: Request) {
  const { code } = await req.json();
  if (!code?.trim()) return NextResponse.json({ valid: false, message: "Enter a code" });

  const referral = await prisma.referralCode.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!referral)  return NextResponse.json({ valid: false, message: "Invalid code" });
  if (referral.usedBy) return NextResponse.json({ valid: false, message: "Code already used" });
  if (new Date(referral.expiresAt) < new Date()) return NextResponse.json({ valid: false, message: "Code expired" });

  return NextResponse.json({
    valid: true,
    discountPercent: referral.discountPercent,
    message: `${referral.discountPercent}% discount applied!`,
  });
}
