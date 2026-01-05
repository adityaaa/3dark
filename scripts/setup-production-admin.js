/**
 * Setup Admin Account in Production Database
 * 
 * This script creates an admin account in the production PostgreSQL database.
 * Run this ONCE after deploying to production.
 * 
 * Usage:
 *   DATABASE_URL="your-production-postgres-url" node scripts/setup-production-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupProductionAdmin() {
  console.log('🔧 Setting up admin account in production database...\n');

  const adminEmail = 'admin@3dark.in';
  const adminPassword = 'admin123';
  const adminName = 'Admin';

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('📅 Created:', existingAdmin.createdAt);
      
      // Update password anyway
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.admin.update({
        where: { id: existingAdmin.id },
        data: { password: hashedPassword }
      });
      
      console.log('\n✅ Admin password updated successfully!');
      console.log('🔐 New password:', adminPassword);
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const admin = await prisma.admin.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: adminName
        }
      });

      console.log('✅ Admin account created successfully!\n');
      console.log('📧 Email:', admin.email);
      console.log('👤 Name:', admin.name);
      console.log('🔐 Password:', adminPassword);
      console.log('📅 Created:', admin.createdAt);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 LOGIN CREDENTIALS FOR PRODUCTION:');
    console.log('='.repeat(50));
    console.log('Email:    ', adminEmail);
    console.log('Password: ', adminPassword);
    console.log('URL:      ', 'https://your-domain.vercel.app/admin/login');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupProductionAdmin();
