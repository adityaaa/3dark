// scripts/check-admin.ts - Check admin users in database
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.admin.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
  
  console.log("\n📋 Admin Users in Database:\n");
  if (admins.length === 0) {
    console.log("❌ No admin users found!");
  } else {
    admins.forEach((admin) => {
      console.log(`  ID: ${admin.id}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Name: ${admin.name}`);
      console.log(`  Created: ${admin.createdAt}`);
      console.log();
    });
  }
}

main()
  .catch((e) => console.error("Error:", e))
  .finally(async () => await prisma.$disconnect());
