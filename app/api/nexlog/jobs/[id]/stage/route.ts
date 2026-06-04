import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { stage, notes, notifyClient } = await req.json();
  const job = await prisma.nexJob.findFirst({ where: { id, userId: session.user.id } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.nexJob.update({ where: { id }, data: { stage } });
  const tracking = await prisma.nexTracking.create({
    data: { jobId: id, updatedBy: session.user.id, stage, notes: notes ?? null, notifyClient: !!notifyClient },
  });
  return NextResponse.json(tracking, { status: 201 });
}
