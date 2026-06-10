import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function isSuperAdmin() {
  const session = await auth();
  return session?.user?.role === "SUPERADMIN";
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
  let code = "NVK-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// GET — list all referral codes
export async function GET() {
  if (!(await isSuperAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const codes = await prisma.referralCode.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(codes);
}

// POST — create a new referral code
export async function POST(req: Request) {
  if (!(await isSuperAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { discountPercent, description } = await req.json();
  if (!discountPercent || discountPercent < 1 || discountPercent > 100) {
    return NextResponse.json({ error: "discountPercent must be 1–100" }, { status: 400 });
  }

  // Ensure unique code
  let code = generateCode();
  while (await prisma.referralCode.findUnique({ where: { code } })) {
    code = generateCode();
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const referral = await prisma.referralCode.create({
    data: { code, discountPercent, description: description || null, expiresAt },
  });

  return NextResponse.json(referral);
}

// DELETE — remove a code
export async function DELETE(req: Request) {
  if (!(await isSuperAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  await prisma.referralCode.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
