#!/usr/bin/env tsx
// scripts/run-migration.ts
// Manually run migrations on production database

import * as dotenv from "dotenv";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Load environment variables
dotenv.config({ path: ".env.local" });

async function main() {
  console.log("🔧 Running migrations on production database...\n");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in environment variables");
    process.exit(1);
  }

  console.log("Database URL:", process.env.DATABASE_URL.replace(/:[^:]*@/, ':***@'));

  try {
    console.log("\nRunning: prisma migrate deploy\n");
    const { stdout, stderr } = await execAsync("npx prisma migrate deploy", {
      env: { ...process.env }
    });
    
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log("\n✅ Migrations completed successfully!\n");
  } catch (error: any) {
    console.error("\n❌ Error running migrations:");
    console.error(error.stdout || error.message);
    console.error(error.stderr || "");
    process.exit(1);
  }
}

main();
