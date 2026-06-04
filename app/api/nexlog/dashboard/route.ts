import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    kpis: {
      activeJobs: 24,
      importJobs: 15,
      exportJobs: 9,
      pendingCustoms: 6,
      revenue: 1284500,
      outstanding: 342000,
    },
  });
}
