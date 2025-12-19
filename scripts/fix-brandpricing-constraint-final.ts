#!/usr/bin/env tsx
// scripts/fix-brandpricing-constraint-final.ts
// Just add the missing unique constraint since columns already exist

import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Adding unique constraint to BrandPricing...\n");

  try {
    // Drop old constraint if it exists (brand only)
    console.log("1. Checking for old constraints...");
    const oldConstraints = await prisma.$queryRawUnsafe(`
      SELECT conname FROM pg_constraint
      WHERE conrelid = '"BrandPricing"'::regclass
      AND contype = 'u';
    `);
    console.log("Existing unique constraints:", oldConstraints);
    
    if (Array.isArray(oldConstraints) && oldConstraints.length > 0) {
      for (const constraint of oldConstraints as any[]) {
        console.log(`Dropping old constraint: ${constraint.conname}`);
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "BrandPricing" DROP CONSTRAINT IF EXISTS "${constraint.conname}";
        `);
      }
    }
    console.log("✅ Old constraints removed\n");

    // Add the new constraint
    console.log("2. Adding new unique constraint on (brand, category, ageGroup)...");
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "BrandPricing" 
      ADD CONSTRAINT "BrandPricing_brand_category_ageGroup_key" 
      UNIQUE ("brand", "category", "ageGroup");
    `);
    console.log("✅ Constraint added\n");

    // Verify
    console.log("3. Verifying constraints...");
    const constraints = await prisma.$queryRawUnsafe(`
      SELECT conname, contype
      FROM pg_constraint
      WHERE conrelid = '"BrandPricing"'::regclass;
    `);
    console.log("Current constraints:", constraints);
    
    console.log("\n✅ BrandPricing constraint fixed successfully!\n");
    console.log("You can now add brand pricing for the same brand with different categories/age groups.");

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
