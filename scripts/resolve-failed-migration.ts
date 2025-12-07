#!/usr/bin/env tsx
// scripts/resolve-failed-migration.ts
// Resolve the failed migration and apply the fix

import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Resolving failed migration...\n");

  try {
    // Step 1: Mark the failed migration as rolled back
    console.log("1. Marking failed migration as rolled back...");
    await prisma.$executeRawUnsafe(`
      UPDATE "_prisma_migrations"
      SET rolled_back_at = NOW()
      WHERE migration_name = '20251206_add_categories'
      AND rolled_back_at IS NULL;
    `);
    console.log("✅ Marked as rolled back\n");

    // Step 2: Check current migration status
    console.log("2. Current migration status:");
    const migrations = await prisma.$queryRawUnsafe(`
      SELECT migration_name, finished_at, rolled_back_at
      FROM "_prisma_migrations"
      ORDER BY started_at DESC
      LIMIT 5;
    `);
    console.log(migrations);
    console.log("");

    console.log("✅ Migration conflict resolved!\n");
    console.log("Now run: npx tsx scripts/run-migration.ts");
    console.log("Or let Vercel deployment run it automatically.\n");

  } catch (error: any) {
    console.error("\n❌ Error resolving migration:");
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
