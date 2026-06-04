import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    summary: { totalRevenue: 1284500, totalCost: 942000, grossProfit: 342500, gpPct: 26.7 },
    byMode: [
      { mode: "Sea Import", revenue: 685000, cost: 512000, gp: 173000 },
      { mode: "Sea Export", revenue: 412000, cost: 305000, gp: 107000 },
      { mode: "Air", revenue: 187500, cost: 125000, gp: 62500 },
    ],
  });
}
