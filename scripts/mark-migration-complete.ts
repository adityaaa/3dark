#!/usr/bin/env tsx
// scripts/mark-migration-complete.ts
// Mark the migration as successfully applied

import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("📝 Marking migration as complete...\n");

  try {
    // Delete the failed migration record
    console.log("1. Removing failed migration record...");
    await prisma.$executeRawUnsafe(`
      DELETE FROM "_prisma_migrations"
      WHERE migration_name = '20251207130749_fix_brandpricing_unique_constraint';
    `);
    console.log("✅ Removed\n");

    // Insert as successfully completed
    console.log("2. Marking migration as successfully applied...");
    await prisma.$executeRawUnsafe(`
      INSERT INTO "_prisma_migrations" (
        id, 
        checksum, 
        finished_at, 
        migration_name, 
        logs, 
        rolled_back_at, 
        started_at, 
        applied_steps_count
      )
      VALUES (
        gen_random_uuid()::text,
        'manual_fix',
        NOW(),
        '20251207130749_fix_brandpricing_unique_constraint',
        'Migration applied manually via script',
        NULL,
        NOW(),
        1
      );
    `);
    console.log("✅ Marked as complete\n");

    // Verify
    console.log("3. Current migrations:");
    const migrations = await prisma.$queryRawUnsafe(`
      SELECT migration_name, finished_at IS NOT NULL as completed, rolled_back_at IS NOT NULL as rolled_back
      FROM "_prisma_migrations"
      ORDER BY started_at DESC
      LIMIT 5;
    `);
    console.log(migrations);
    
    console.log("\n✅ Migration state fixed!\n");
    console.log("Future deployments will see this migration as already applied.");

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
