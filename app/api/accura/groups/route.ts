import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const groups = await prisma.ledgerGroup.findMany({
    where: { userId: session.user.id },
    include: {
      children: { select: { id: true, name: true } },
      parent: { select: { id: true, name: true } },
      _count: { select: { ledgers: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(groups);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, parentId, nature } = body;

  if (!name || !nature) {
    return NextResponse.json({ error: "name and nature are required" }, { status: 400 });
  }

  const validNatures = ["ASSETS", "LIABILITIES", "INCOME", "EXPENSE"];
  if (!validNatures.includes(nature)) {
    return NextResponse.json({ error: "nature must be one of ASSETS, LIABILITIES, INCOME, EXPENSE" }, { status: 400 });
  }

  const group = await prisma.ledgerGroup.create({
    data: {
      userId: session.user.id,
      name,
      nature,
      parentId: parentId ?? null,
      isSystem: false,
    },
    include: {
      children: { select: { id: true, name: true } },
      parent: { select: { id: true, name: true } },
      _count: { select: { ledgers: true } },
    },
  });

  return NextResponse.json(group, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, name, parentId, nature } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const group = await prisma.ledgerGroup.findFirst({ where: { id, userId: session.user.id } });
  if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (nature) {
    const validNatures = ["ASSETS", "LIABILITIES", "INCOME", "EXPENSE"];
    if (!validNatures.includes(nature)) {
      return NextResponse.json({ error: "nature must be one of ASSETS, LIABILITIES, INCOME, EXPENSE" }, { status: 400 });
    }
  }

  const updated = await prisma.ledgerGroup.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(nature !== undefined ? { nature } : {}),
      ...(parentId !== undefined ? { parentId: parentId ?? null } : {}),
    },
    include: {
      children: { select: { id: true, name: true } },
      parent: { select: { id: true, name: true } },
      _count: { select: { ledgers: true } },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const group = await prisma.ledgerGroup.findFirst({
    where: { id, userId: session.user.id },
    include: { _count: { select: { ledgers: true } } },
  });

  if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (group._count.ledgers > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${group._count.ledgers} ledger(s) are linked to this group. Remove them first.` },
      { status: 400 }
    );
  }

  await prisma.ledgerGroup.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
