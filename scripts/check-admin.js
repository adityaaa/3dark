// Quick script to check and create admin user
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking for admin users...\n");

  // Check all admins
  const admins = await prisma.admin.findMany();
  
  if (admins.length === 0) {
    console.log("❌ No admin users found!");
    console.log("\n📝 Creating default admin user...\n");
    
    const email = "admin@3dark.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newAdmin = await prisma.admin.create({
      data: {
        email: email,
        password: hashedPassword,
        name: "Admin",
      },
    });
    
    console.log("✅ Admin user created successfully!");
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");
  } else {
    console.log(`✅ Found ${admins.length} admin user(s):\n`);
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   ID: ${admin.id}`);
      console.log("");
    });
    console.log("💡 If you forgot your password, you can reset it using update-admin-password script");
  }
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
