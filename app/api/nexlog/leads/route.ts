import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");
  const leads = await prisma.nexLead.findMany({
    where: { userId: session.user.id, ...(stage ? { stage } : {}) },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const lead = await prisma.nexLead.create({ data: { ...body, userId: session.user.id } });
  return NextResponse.json(lead, { status: 201 });
}
