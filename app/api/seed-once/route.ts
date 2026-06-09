import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// One-time seed endpoint — DELETE THIS FILE after use
// Call: GET /api/seed-once?secret=NavkarSeed2025

export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (secret !== "NavkarSeed2025") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const superAdminPassword = await bcrypt.hash("NavkarSuper@2025", 12);
  const adminPassword = await bcrypt.hash("NavkarAdmin@2025", 12);

  await prisma.user.upsert({
    where: { email: "superadmin@navkaros.in" },
    update: { hashedPassword: superAdminPassword, role: "SUPERADMIN", status: "ACTIVE" },
    create: {
      clientId: "NVKSUPER001",
      name: "Pranam Shah",
      email: "superadmin@navkaros.in",
      hashedPassword: superAdminPassword,
      role: "SUPERADMIN",
      status: "ACTIVE",
      businessName: "NavkarOS",
      businessType: "CF_AGENT",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@navkaros.in" },
    update: { hashedPassword: adminPassword, role: "ADMIN", status: "ACTIVE" },
    create: {
      clientId: "NVKADMIN001",
      name: "NavkarOS Admin",
      email: "admin@navkaros.in",
      hashedPassword: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      businessName: "NavkarOS",
      businessType: "CF_AGENT",
    },
  });

  return NextResponse.json({
    success: true,
    seeded: [
      "superadmin@navkaros.in / NavkarSuper@2025 (SUPERADMIN)",
      "admin@navkaros.in / NavkarAdmin@2025 (ADMIN)",
    ],
  });
}
