#!/usr/bin/env tsx
// scripts/check-db-state.ts
// Check the current state of the production database

import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking production database state...\n");

  try {
    // Check Product columns
    console.log("1. Product table columns:");
    const productColumns = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'Product'
      ORDER BY ordinal_position;
    `);
    console.log(productColumns);
    console.log("");

    // Check BrandPricing columns
    console.log("2. BrandPricing table columns:");
    const brandPricingColumns = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'BrandPricing'
      ORDER BY ordinal_position;
    `);
    console.log(brandPricingColumns);
    console.log("");

    // Check constraints on BrandPricing
    console.log("3. BrandPricing constraints:");
    const constraints = await prisma.$queryRawUnsafe(`
      SELECT conname, contype
      FROM pg_constraint
      WHERE conrelid = '"BrandPricing"'::regclass;
    `);
    console.log(constraints);
    console.log("");

    // Check Brand table existence
    console.log("4. Brand table exists:");
    const brandTable = await prisma.$queryRawUnsafe(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'Brand'
      );
    `);
    console.log(brandTable);
    console.log("");

  } catch (error: any) {
    console.error("\n❌ Error checking database:");
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
