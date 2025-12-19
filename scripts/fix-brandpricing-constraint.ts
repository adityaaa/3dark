#!/usr/bin/env tsx
// scripts/fix-brandpricing-constraint.ts
// Fix the unique constraint on BrandPricing table

import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Fixing BrandPricing unique constraint...\n");

  try {
    // Drop old constraint on brand only
    console.log("1. Dropping old constraint (brand only)...");
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "BrandPricing" DROP CONSTRAINT IF EXISTS "BrandPricing_brand_key";
    `);
    console.log("✅ Old constraint dropped\n");

    // Add new constraint on brand+category+ageGroup
    console.log("2. Creating new constraint (brand+category+ageGroup)...");
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM pg_constraint 
              WHERE conname = 'BrandPricing_brand_category_ageGroup_key'
          ) THEN
              ALTER TABLE "BrandPricing" ADD CONSTRAINT "BrandPricing_brand_category_ageGroup_key" 
              UNIQUE ("brand", "category", "ageGroup");
          END IF;
      END $$;
    `);
    console.log("✅ New constraint created\n");

    // Verify the constraint
    console.log("3. Verifying constraint...");
    const constraints = await prisma.$queryRawUnsafe(`
      SELECT conname, contype
      FROM pg_constraint
      WHERE conrelid = 'BrandPricing'::regclass
      AND contype = 'u';
    `);
    
    console.log("Current unique constraints on BrandPricing:");
    console.log(constraints);
    console.log("\n✅ Constraint fix completed successfully!\n");
    console.log("You can now update brand pricing for the same brand with different categories/age groups.");

  } catch (error: any) {
    console.error("\n❌ Error fixing constraint:");
    console.error(error.message);
    console.error("\nDetails:", error);
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
