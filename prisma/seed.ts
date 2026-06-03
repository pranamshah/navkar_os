import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "pranam@navkaros.com";
  const hashedPassword = await bcrypt.hash("Admin@NavkarOS2026", 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      clientId: "NVK-ADMIN-00001",
      name: "NavkarOS Admin",
      email: adminEmail,
      hashedPassword,
      role: "SUPERADMIN",
      status: "ACTIVE",
      businessName: "NavkarOS",
      businessType: "CF_AGENT",
    },
  });

  console.log("✅ Admin seeded:", adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
