import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── SUPERADMIN ────────────────────────────────────────────────────
  const superAdminPassword = await bcrypt.hash("NavkarSuper@2025", 12);
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
  console.log("✅ SUPERADMIN seeded: superadmin@navkaros.in / NavkarSuper@2025");

  // ── ADMIN ─────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("NavkarAdmin@2025", 12);
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
  console.log("✅ ADMIN seeded:      admin@navkaros.in     / NavkarAdmin@2025");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
