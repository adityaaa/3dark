/**
 * Script to apply category migration to production database
 * Run with: npx tsx scripts/apply-category-migration.ts
 */

/* eslint-disable @typescript-eslint/no-floating-promises */

import { prisma } from "../lib/db";

async function main() {
  console.log("🚀 Starting category migration...\n");

  try {
    // Step 1: Add category and ageGroup columns to Product (with defaults)
    console.log("1️⃣  Adding category and ageGroup columns to Product table...");
    await prisma.$executeRaw`
      ALTER TABLE "Product" 
      ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'tshirt',
      ADD COLUMN IF NOT EXISTS "ageGroup" TEXT NOT NULL DEFAULT 'adult'
    `;
    console.log("✅ Product table updated\n");

    // Step 2: Create Brand table
    console.log("2️⃣  Creating Brand table...");
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Brand" (
        "id" SERIAL NOT NULL,
        "name" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
      )
    `;
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "Brand_name_key" ON "Brand"("name")
    `;
    console.log("✅ Brand table created\n");

    // Step 3: Insert existing brands
    console.log("3️⃣  Migrating existing brands...");
    const products = await prisma.product.findMany({
      select: { brand: true },
      distinct: ['brand'],
    });
    
    for (const { brand } of products) {
      await prisma.$executeRaw`
        INSERT INTO "Brand" ("name", "createdAt", "updatedAt")
        VALUES (${brand}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT ("name") DO NOTHING
      `;
    }
    console.log(`✅ Migrated ${products.length} brands\n`);

    // Step 4: Update BrandPricing table
    console.log("4️⃣  Updating BrandPricing table...");
    
    // Drop old unique constraint
    await prisma.$executeRaw`
      ALTER TABLE "BrandPricing" DROP CONSTRAINT IF EXISTS "BrandPricing_brand_key"
    `;
    
    // Add new columns
    await prisma.$executeRaw`
      ALTER TABLE "BrandPricing" 
      ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'tshirt',
      ADD COLUMN IF NOT EXISTS "ageGroup" TEXT NOT NULL DEFAULT 'adult'
    `;
    
    // Create new unique constraint
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "BrandPricing_brand_category_ageGroup_key" 
      ON "BrandPricing"("brand", "category", "ageGroup")
    `;
    console.log("✅ BrandPricing table updated\n");

    console.log("🎉 Migration completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Regenerate Prisma client: npx prisma generate");
    console.log("2. Update your application code to use new fields");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(console.error);
