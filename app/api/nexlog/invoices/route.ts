import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const invoices = await prisma.nexInvoice.findMany({
    where: { userId: session.user.id, ...(status ? { status } : {}) },
    orderBy: { date: "desc" },
    take: 100,
  });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const invoice = await prisma.nexInvoice.create({ data: { ...body, userId: session.user.id } });
  return NextResponse.json(invoice, { status: 201 });
}
