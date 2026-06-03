import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || !["SUPERADMIN", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "ALL";
  const page   = parseInt(searchParams.get("page") ?? "1");
  const limit  = 20;
  const skip   = (page - 1) * limit;

  const where =
    status === "ALL"
      ? { role: "CLIENT" as const }
      : { role: "CLIENT" as const, status: status as "PENDING_VERIFICATION" | "ACTIVE" | "REJECTED" | "SUSPENDED" };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      select: {
        id: true, clientId: true, name: true, email: true,
        businessName: true, businessType: true, city: true,
        gstin: true, status: true, createdAt: true,
        gstCertPath: true, panCopyPath: true, licenceCopyPath: true,
        pan: true, iecCode: true, chaLicenceNo: true,
        businessAddress: true, state: true, phone: true, whatsapp: true,
        yearsInBusiness: true, rejectionReason: true, verifiedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
}
