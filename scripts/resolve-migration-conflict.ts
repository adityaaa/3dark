#!/usr/bin/env tsx
// scripts/resolve-migration-conflict.ts
// Mark the conflicting migration as resolved in production

import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Resolving migration conflict...\n");

  try {
    // Check if the _prisma_migrations table exists
    console.log("1. Checking migration status...");
    const migrations = await prisma.$queryRawUnsafe(`
      SELECT migration_name, finished_at, applied_steps_count
      FROM "_prisma_migrations"
      ORDER BY finished_at DESC
      LIMIT 10;
    `);
    
    console.log("Recent migrations:");
    console.log(migrations);
    console.log("");

    // Mark the problematic migration as applied if needed
    console.log("2. Marking 20251206_add_categories as resolved...");
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
        '20251206_add_categories',
        'resolved_manually',
        NOW(),
        '20251206_add_categories',
        'Migration resolved manually - columns already exist',
        NULL,
        NOW(),
        1
      )
      ON CONFLICT (migration_name) DO NOTHING;
    `);
    
    console.log("✅ Migration marked as resolved\n");
    
    console.log("3. Verifying current state...");
    const finalMigrations = await prisma.$queryRawUnsafe(`
      SELECT migration_name, finished_at
      FROM "_prisma_migrations"
      ORDER BY finished_at DESC
      LIMIT 10;
    `);
    
    console.log("Current migrations:");
    console.log(finalMigrations);
    console.log("\n✅ Migration conflict resolved!\n");

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
