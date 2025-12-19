# 🚨 URGENT: Fix Failed Migration in Production

## Problem
The deployment is failing with error:
```
The `20251207_add_customer_model` migration started at 2025-12-07 13:19:35.732462 UTC failed
```

## Root Cause
We had two migration folders for the Customer model:
- `20251207_add_customer_model` (incorrect, no timestamp - FAILED in production)
- `20251207142229_add_customer_model` (correct, with timestamp)

The first one started in production but failed, blocking all new migrations.

## ✅ Solution Applied

### 1. Removed Duplicate Migration Locally
- Deleted `prisma/migrations/20251207_add_customer_model/`
- Kept only `prisma/migrations/20251207142229_add_customer_model/`

### 2. Updated Build Script (Temporary)
Changed `package.json` build script from:
```json
"build": "prisma migrate deploy && prisma generate && next build"
```
To:
```json
"build": "prisma generate && next build"
```

This allows deployment without running migrations first.

## 🔧 Fix Production Database

You have **3 options** to fix the production database:

### Option 1: Using Database GUI (Easiest)

1. **Access your PostgreSQL database** (via Prisma Studio, pgAdmin, or database provider's dashboard)

2. **Run this SQL:**
```sql
-- Mark the failed migration as rolled back
UPDATE "_prisma_migrations" 
SET rolled_back_at = NOW(), 
    finished_at = NULL,
    logs = 'Manually rolled back - duplicate migration'
WHERE migration_name = '20251207_add_customer_model';
```

3. **Check if Customer table was partially created:**
```sql
SELECT table_name FROM information_schema.tables WHERE table_name = 'Customer';
```

4. **If Customer table exists but incomplete, drop it:**
```sql
-- Remove foreign key first
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_customerId_fkey";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "customerId";

-- Drop the table
DROP TABLE IF EXISTS "Customer";
```

5. **Apply the correct migration via Vercel:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Temporarily add: `SKIP_PRISMA_MIGRATE_DEPLOY=true`
   - Or change build command to: `prisma migrate deploy && prisma generate && next build`

### Option 2: Using Prisma CLI (If you have DB access)

1. **Pull production database URL:**
```bash
# If using Vercel
vercel env pull .env.production

# Load production env
export $(cat .env.production | xargs)
```

2. **Mark migration as rolled back:**
```bash
npx prisma migrate resolve --rolled-back 20251207_add_customer_model
```

3. **Deploy migrations:**
```bash
npx prisma migrate deploy
```

### Option 3: Quick Fix via Vercel (Automated)

1. **In your project root, create this script:**

`scripts/fix-production-migration.js`:
```javascript
const { PrismaClient } = require('@prisma/client');

async function fixMigration() {
  const prisma = new PrismaClient();
  
  try {
    // Mark failed migration as rolled back
    await prisma.$executeRaw`
      UPDATE "_prisma_migrations" 
      SET rolled_back_at = NOW(), 
          finished_at = NULL,
          logs = 'Auto-rolled back - duplicate migration'
      WHERE migration_name = '20251207_add_customer_model'
        AND finished_at IS NULL;
    `;
    
    console.log('✅ Failed migration marked as rolled back');
    
    // Check if Customer table exists
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_name = 'Customer';
    `;
    
    if (tables.length > 0) {
      console.log('⚠️  Customer table exists. Cleaning up...');
      
      // Drop foreign key and column
      await prisma.$executeRaw`
        ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_customerId_fkey";
      `;
      await prisma.$executeRaw`
        ALTER TABLE "Order" DROP COLUMN IF EXISTS "customerId";
      `;
      await prisma.$executeRaw`
        DROP TABLE IF EXISTS "Customer";
      `;
      
      console.log('✅ Customer table cleaned up');
    }
    
    console.log('✅ Ready for migration deploy!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixMigration();
```

2. **Run it locally with production DB:**
```bash
vercel env pull .env.production
export $(cat .env.production | xargs)
node scripts/fix-production-migration.js
```

## 📋 After Fixing, Deploy

1. **Restore the build command in `package.json`:**
```json
"build": "prisma migrate deploy && prisma generate && next build"
```

2. **Commit and push:**
```bash
git add package.json
git commit -m "fix: Restore migrate deploy in build script"
git push origin main
```

3. **Vercel will auto-deploy** and migrations will work!

## 🎯 Quick Actions (Right Now)

**Immediate fix to unblock deployment:**

1. Commit and push current changes (build script already updated):
```bash
git add .
git commit -m "fix: Temporarily disable migrate deploy to fix failed migration"
git push origin main
```

2. Wait for Vercel deployment (should succeed now)

3. Fix the database using Option 1, 2, or 3 above

4. Restore build script and redeploy

## ✅ Verification

After fix, check:
```sql
SELECT * FROM "_prisma_migrations" 
WHERE migration_name LIKE '%customer%' 
ORDER BY finished_at DESC;
```

Should show:
- `20251207_add_customer_model` - rolled_back_at filled
- `20251207142229_add_customer_model` - finished_at filled (after next deploy)

---

**Status**: Build script updated ✅ | Database fix pending ⏳ | Ready to deploy 🚀
