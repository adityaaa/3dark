#!/usr/bin/env tsx
// scripts/check-brandpricing-constraints.ts
// Check what constraints exist on BrandPricing table

import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking BrandPricing constraints...\n");

  try {
    // Check all constraints on BrandPricing table
    const constraints: any = await prisma.$queryRawUnsafe(`
      SELECT 
        conname as constraint_name,
        contype as constraint_type,
        pg_get_constraintdef(oid) as definition
      FROM pg_constraint
      WHERE conrelid = '"BrandPricing"'::regclass
      ORDER BY conname;
    `);
    
    console.log("Constraints on BrandPricing table:");
    console.log("=====================================\n");
    
    for (const constraint of constraints) {
      console.log(`Name: ${constraint.constraint_name}`);
      console.log(`Type: ${constraint.constraint_type === 'u' ? 'UNIQUE' : constraint.constraint_type === 'p' ? 'PRIMARY KEY' : constraint.constraint_type}`);
      console.log(`Definition: ${constraint.definition}`);
      console.log("---");
    }

    console.log("\n✅ Check completed");

  } catch (error: any) {
    console.error("\n❌ Error checking constraints:");
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
