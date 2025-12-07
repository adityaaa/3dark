#!/usr/bin/env tsx
// scripts/fix-constraint-properly.ts
// Drop indexes and recreate proper unique constraint

import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Fixing BrandPricing constraint properly...\n");

  try {
    // Drop old index on brand only
    console.log("1. Dropping old index (brand only)...");
    await prisma.$executeRawUnsafe(`
      DROP INDEX IF EXISTS "BrandPricing_brand_key";
    `);
    console.log("✅ Dropped BrandPricing_brand_key\n");

    // Drop the compound index (we'll recreate it via constraint)
    console.log("2. Dropping existing compound index...");
    await prisma.$executeRawUnsafe(`
      DROP INDEX IF EXISTS "BrandPricing_brand_category_ageGroup_key";
    `);
    console.log("✅ Dropped BrandPricing_brand_category_ageGroup_key\n");

    // Now add the unique constraint (this will create the index automatically)
    console.log("3. Creating unique constraint...");
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "BrandPricing" 
      ADD CONSTRAINT "BrandPricing_brand_category_ageGroup_key" 
      UNIQUE ("brand", "category", "ageGroup");
    `);
    console.log("✅ Created unique constraint\n");

    // Verify
    console.log("4. Verifying...");
    const indexes = await prisma.$queryRawUnsafe(`
      SELECT indexname FROM pg_indexes WHERE tablename = 'BrandPricing';
    `);
    console.log("Indexes:", indexes);

    const constraints = await prisma.$queryRawUnsafe(`
      SELECT conname, contype, array_agg(att.attname) AS columns
      FROM pg_constraint con
      JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = ANY(con.conkey)
      WHERE con.conrelid = '"BrandPricing"'::regclass
      GROUP BY con.conname, con.contype;
    `);
    console.log("Constraints:", constraints);
    
    console.log("\n✅ BrandPricing constraint fixed successfully!\n");
    console.log("You can now add brand pricing for the same brand with different categories/age groups.");

  } catch (error: any) {
    console.error("\n❌ Error:");
    console.error(error.message);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error("Unexpected error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
