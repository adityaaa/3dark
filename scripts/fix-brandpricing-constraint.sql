-- Fix BrandPricing unique constraint
-- Drop old constraint and create new one with brand+category+ageGroup

-- Drop the old unique constraint on brand only
ALTER TABLE "BrandPricing" DROP CONSTRAINT IF EXISTS "BrandPricing_brand_key";

-- Create the correct unique constraint on brand+category+ageGroup
-- Note: If this constraint already exists, this will fail gracefully
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'BrandPricing_brand_category_ageGroup_key'
    ) THEN
        ALTER TABLE "BrandPricing" ADD CONSTRAINT "BrandPricing_brand_category_ageGroup_key" 
        UNIQUE ("brand", "category", "ageGroup");
    END IF;
END $$;
