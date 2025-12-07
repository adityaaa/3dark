-- Fix BrandPricing unique constraint
-- The table may have a constraint on 'brand' only, but we need it on (brand, category, ageGroup)

-- Drop any existing unique constraint on brand only
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

-- Create the correct unique constraint on (brand, category, ageGroup)
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
