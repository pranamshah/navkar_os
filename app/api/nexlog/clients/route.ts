import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const clients = await prisma.nexClient.findMany({
    where: {
      userId: session.user.id,
      ...(q ? { companyName: { contains: q, mode: "insensitive" } } : {}),
    },
    orderBy: { companyName: "asc" },
    take: 100,
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const client = await prisma.nexClient.create({ data: { ...body, userId: session.user.id } });
  return NextResponse.json(client, { status: 201 });
}
