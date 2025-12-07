-- Fix BrandPricing table structure and constraints

-- Step 1: Add missing columns to Product table if they don't exist
DO $$
BEGIN
    -- Add category column if it doesn't exist
    BEGIN
        ALTER TABLE "Product" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'tshirt';
        RAISE NOTICE 'Added category column to Product';
    EXCEPTION
        WHEN duplicate_column THEN
            RAISE NOTICE 'Column Product.category already exists';
    END;
    
    -- Add ageGroup column if it doesn't exist
    BEGIN
        ALTER TABLE "Product" ADD COLUMN "ageGroup" TEXT NOT NULL DEFAULT 'adult';
        RAISE NOTICE 'Added ageGroup column to Product';
    EXCEPTION
        WHEN duplicate_column THEN
            RAISE NOTICE 'Column Product.ageGroup already exists';
    END;
END $$;

-- Step 2: Add missing columns to BrandPricing table if they don't exist
DO $$
BEGIN
    -- Add category column if it doesn't exist
    BEGIN
        ALTER TABLE "BrandPricing" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'tshirt';
        RAISE NOTICE 'Added category column to BrandPricing';
    EXCEPTION
        WHEN duplicate_column THEN
            RAISE NOTICE 'Column BrandPricing.category already exists';
    END;
    
    -- Add ageGroup column if it doesn't exist
    BEGIN
        ALTER TABLE "BrandPricing" ADD COLUMN "ageGroup" TEXT NOT NULL DEFAULT 'adult';
        RAISE NOTICE 'Added ageGroup column to BrandPricing';
    EXCEPTION
        WHEN duplicate_column THEN
            RAISE NOTICE 'Column BrandPricing.ageGroup already exists';
    END;
END $$;

-- Step 3: Create Brand table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- Create unique index on Brand name if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'Brand_name_key') THEN
        CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");
        RAISE NOTICE 'Created unique index on Brand.name';
    END IF;
END $$;

-- Step 4: Insert existing brands from products
INSERT INTO "Brand" ("name", "createdAt", "updatedAt")
SELECT DISTINCT "brand", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Product"
ON CONFLICT ("name") DO NOTHING;

-- Step 5: Drop any existing unique constraint on brand only
DO $$ 
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find and drop constraint on brand only
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = '"BrandPricing"'::regclass
    AND contype = 'u'
    AND array_length(conkey, 1) = 1;
    
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE "BrandPricing" DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END IF;
END $$;

-- Step 6: Create the correct unique constraint on (brand, category, ageGroup)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'BrandPricing_brand_category_ageGroup_key'
        AND conrelid = '"BrandPricing"'::regclass
    ) THEN
        ALTER TABLE "BrandPricing" 
        ADD CONSTRAINT "BrandPricing_brand_category_ageGroup_key" 
        UNIQUE ("brand", "category", "ageGroup");
        
        RAISE NOTICE 'Created constraint: BrandPricing_brand_category_ageGroup_key';
    ELSE
        RAISE NOTICE 'Constraint already exists: BrandPricing_brand_category_ageGroup_key';
    END IF;
END $$;
