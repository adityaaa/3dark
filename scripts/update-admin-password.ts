#!/usr/bin/env tsx
// scripts/update-admin-password.ts
// Update admin password for security

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Update Admin Password\n");

  // Get admin email and new password
  const email = process.env.ADMIN_EMAIL || "admin@3dark.com";
  
  console.log(`Updating password for: ${email}\n`);
  
  // Check if admin exists
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    console.error(`❌ Admin with email ${email} not found!`);
    console.log("\nCreate a new admin first using: npx tsx scripts/create-admin.ts");
    process.exit(1);
  }

  // Prompt for new password (you'll need to pass it as env var or modify script)
  const newPassword = process.env.NEW_PASSWORD;
  
  if (!newPassword) {
    console.error("❌ No password provided!");
    console.log("\nUsage: NEW_PASSWORD='your-secure-password' npx tsx scripts/update-admin-password.ts");
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error("❌ Password must be at least 8 characters long!");
    process.exit(1);
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update admin password
  await prisma.admin.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log("✅ Password updated successfully!\n");
  console.log("⚠️  Important: Delete or secure the NEW_PASSWORD environment variable");
  console.log("⚠️  Test login at: https://3dark.in/admin/login\n");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
