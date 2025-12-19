-- Manual fix for production database
-- Run this SQL directly in your database to resolve the failed migration

-- Step 1: Check the current migration status
SELECT * FROM "_prisma_migrations" WHERE migration_name LIKE '%customer%' ORDER BY finished_at DESC;

-- Step 2: Mark the failed migration as rolled back (if it exists)
UPDATE "_prisma_migrations" 
SET rolled_back_at = NOW(), 
    logs = 'Manually rolled back due to duplicate migration issue'
WHERE migration_name = '20251207_add_customer_model' 
  AND finished_at IS NULL;

-- Step 3: Check if Customer table exists (it might have been partially created)
-- If it exists, you can drop it or keep it
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'Customer';

-- Step 4: Verify the fix
SELECT * FROM "_prisma_migrations" WHERE migration_name LIKE '%customer%' ORDER BY finished_at DESC;

-- Now you can run: npx prisma migrate deploy
-- This will apply the correct migration: 20251207142229_add_customer_model
