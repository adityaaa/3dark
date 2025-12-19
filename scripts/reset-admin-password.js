// Reset admin password to a known value
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Resetting Admin Password\n");

  const email = "admin@3dark.com";
  const newPassword = "Admin123!"; // Simple password for testing
  
  // Check if admin exists
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    console.error(`❌ Admin not found: ${email}`);
    process.exit(1);
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await prisma.admin.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log("✅ Admin password reset successfully!\n");
  console.log("📝 Login credentials:");
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${newPassword}`);
  console.log("\n🌐 Login at: http://localhost:3001/admin/login\n");
  console.log("⚠️  IMPORTANT: Change this password after logging in!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error:", e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
