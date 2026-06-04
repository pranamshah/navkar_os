import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const partners = await prisma.nexPartner.findMany({
    where: { userId: session.user.id, ...(type ? { type } : {}) },
    orderBy: { name: "asc" },
    take: 100,
  });
  return NextResponse.json(partners);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const partner = await prisma.nexPartner.create({ data: { ...body, userId: session.user.id } });
  return NextResponse.json(partner, { status: 201 });
}
