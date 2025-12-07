#!/usr/bin/env tsx
// scripts/check-indexes.ts
// Check all indexes on BrandPricing

import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking BrandPricing indexes and constraints...\n");

  try {
    // Check all indexes
    console.log("1. All indexes on BrandPricing:");
    const indexes = await prisma.$queryRawUnsafe(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'BrandPricing';
    `);
    console.log(indexes);
    console.log("");

    // Check all constraints (including unique via join)
    console.log("2. All constraints with details:");
    const constraints = await prisma.$queryRawUnsafe(`
      SELECT 
        con.conname AS constraint_name,
        con.contype AS constraint_type,
        CASE con.contype
          WHEN 'p' THEN 'PRIMARY KEY'
          WHEN 'u' THEN 'UNIQUE'
          WHEN 'f' THEN 'FOREIGN KEY'
          WHEN 'c' THEN 'CHECK'
          ELSE con.contype::text
        END AS constraint_description,
        array_agg(att.attname ORDER BY att.attnum) AS columns
      FROM pg_constraint con
      JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = ANY(con.conkey)
      WHERE con.conrelid = '"BrandPricing"'::regclass
      GROUP BY con.conname, con.contype;
    `);
    console.log(constraints);
    console.log("");

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
