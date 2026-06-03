import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      product: true,
      plan: true,
      status: true,
      billingCycle: true,
      currentPeriodEnd: true,
      trialEndsAt: true,
    },
  });

  return NextResponse.json({ subscriptions });
}
