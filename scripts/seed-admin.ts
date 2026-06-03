/**
 * Run once to create the superadmin user:
 *   npx tsx scripts/seed-admin.ts
 *
 * Admin credentials:
 *   Email:    admin@navkaros.in
 *   Password: NavkarAdmin@2025
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@navkaros.in";
  const password = "NavkarAdmin@2025";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("✅ Admin already exists:", email);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      clientId:       "NVK-ADMIN-0001",
      name:           "Navkar Admin",
      email,
      hashedPassword,
      role:           "SUPERADMIN",
      status:         "ACTIVE",
      verifiedAt:     new Date(),
    },
  });

  console.log("✅ Superadmin created successfully!");
  console.log("   Email:   ", email);
  console.log("   Password:", password);
  console.log("   Login at: /login → Email tab");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
