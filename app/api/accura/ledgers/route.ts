import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("q") ?? "";
  const groupId = searchParams.get("groupId");

  const ledgers = await prisma.ledger.findMany({
    where: {
      userId: session.user.id,
      isActive: true,
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      ...(groupId ? { groupId } : {}),
    },
    include: { group: { select: { id: true, name: true, nature: true } } },
    orderBy: { name: "asc" },
    take: 50,
  });

  return NextResponse.json(ledgers);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, groupId, openingBalance, openingType, gstin, pan, creditPeriod, billByBill, tdsSection, isFreightLedger, currency } = body;

  if (!name || !groupId) return NextResponse.json({ error: "name and groupId are required" }, { status: 400 });

  const ledger = await prisma.ledger.create({
    data: {
      userId: session.user.id,
      name,
      groupId,
      openingBalance: openingBalance ?? 0,
      openingType: openingType ?? "Dr",
      gstin: gstin ?? null,
      pan: pan ?? null,
      creditPeriod: creditPeriod ?? 0,
      billByBill: billByBill ?? false,
      tdsSection: tdsSection ?? null,
      isFreightLedger: isFreightLedger ?? false,
      currency: currency ?? "INR",
    },
    include: { group: true },
  });

  return NextResponse.json(ledger, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const ledger = await prisma.ledger.findFirst({ where: { id, userId: session.user.id } });
  if (!ledger) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.ledger.update({ where: { id }, data, include: { group: true } });
  return NextResponse.json(updated);
}
