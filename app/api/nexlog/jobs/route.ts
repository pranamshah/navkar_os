import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");
  const mode = searchParams.get("mode");
  const jobs = await prisma.nexJob.findMany({
    where: {
      userId: session.user.id,
      ...(stage ? { stage } : {}),
      ...(mode ? { mode } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const job = await prisma.nexJob.create({ data: { ...body, userId: session.user.id } });
  return NextResponse.json(job, { status: 201 });
}
