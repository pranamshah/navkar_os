import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const vouchers = await prisma.voucher.findMany({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
      ...(type ? { voucherType: type } : {}),
      ...(from || to ? {
        date: {
          ...(from ? { gte: new Date(from) } : {}),
          ...(to ? { lte: new Date(to) } : {}),
        },
      } : {}),
    },
    include: {
      lines: { include: { ledger: { select: { id: true, name: true } } } },
    },
    orderBy: { date: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json(vouchers);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { voucherType, voucherNo, date, narration, totalAmount, costCentre, jobNo, lines } = body;

  if (!voucherType || !voucherNo || !date || !lines?.length) {
    return NextResponse.json({ error: "voucherType, voucherNo, date, and lines are required" }, { status: 400 });
  }

  const voucher = await prisma.voucher.create({
    data: {
      userId: session.user.id,
      voucherType,
      voucherNo,
      date: new Date(date),
      narration: narration ?? null,
      totalAmount: totalAmount ?? 0,
      costCentre: costCentre ?? null,
      jobNo: jobNo ?? null,
      lines: {
        create: lines.map((line: {
          ledgerId: string;
          type: string;
          amount: number;
          cgst?: number;
          sgst?: number;
          igst?: number;
          narration?: string;
          currency?: string;
          forexAmount?: number;
          exchangeRate?: number;
        }) => ({
          ledgerId: line.ledgerId,
          type: line.type,
          amount: line.amount,
          cgst: line.cgst ?? 0,
          sgst: line.sgst ?? 0,
          igst: line.igst ?? 0,
          narration: line.narration ?? null,
          currency: line.currency ?? "INR",
          forexAmount: line.forexAmount ?? null,
          exchangeRate: line.exchangeRate ?? null,
        })),
      },
    },
    include: { lines: true },
  });

  return NextResponse.json(voucher, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const voucher = await prisma.voucher.findFirst({ where: { id, userId: session.user.id } });
  if (!voucher) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.voucher.update({ where: { id }, data: { status: "DELETED" } });
  return NextResponse.json({ success: true });
}
