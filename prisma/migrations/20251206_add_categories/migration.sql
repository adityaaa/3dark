-- Add new columns to Product table
ALTER TABLE "Product" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'tshirt';
ALTER TABLE "Product" ADD COLUMN "ageGroup" TEXT NOT NULL DEFAULT 'adult';

-- Create Brand table
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- Create unique index on Brand name
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- Insert existing brands from products
INSERT INTO "Brand" ("name", "createdAt", "updatedAt")
SELECT DISTINCT "brand", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Product"
ON CONFLICT ("name") DO NOTHING;

-- Drop old BrandPricing unique constraint
ALTER TABLE "BrandPricing" DROP CONSTRAINT IF EXISTS "BrandPricing_brand_key";

-- Add new columns to BrandPricing
ALTER TABLE "BrandPricing" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'tshirt';
ALTER TABLE "BrandPricing" ADD COLUMN IF NOT EXISTS "ageGroup" TEXT NOT NULL DEFAULT 'adult';

-- Create new unique constraint
CREATE UNIQUE INDEX "BrandPricing_brand_category_ageGroup_key" ON "BrandPricing"("brand", "category", "ageGroup");
