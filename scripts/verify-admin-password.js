// scripts/verify-admin-password.js
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

async function verifyPassword() {
  const prisma = new PrismaClient();
  
  try {
    console.log("🔍 Checking admin account...\n");
    
    const admin = await prisma.admin.findUnique({
      where: { email: "admin@3dark.com" }
    });
    
    if (!admin) {
      console.log("❌ Admin account not found!");
      return;
    }
    
    console.log("✅ Admin found:");
    console.log("   Email:", admin.email);
    console.log("   Name:", admin.name);
    console.log("   Password Hash:", admin.password.substring(0, 30) + "...");
    
    // Test password
    const testPassword = "admin123";
    const isValid = await bcrypt.compare(testPassword, admin.password);
    
    console.log("\n🔐 Password Test:");
    console.log("   Testing password:", testPassword);
    console.log("   Result:", isValid ? "✅ VALID" : "❌ INVALID");
    
    if (!isValid) {
      console.log("\n⚠️  Password doesn't match! Recreating admin...");
      const newHash = await bcrypt.hash(testPassword, 10);
      
      await prisma.admin.update({
        where: { email: "admin@3dark.com" },
        data: { password: newHash }
      });
      
      console.log("✅ Admin password reset successfully!");
      console.log("   You can now login with: admin@3dark.com / admin123");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPassword();
