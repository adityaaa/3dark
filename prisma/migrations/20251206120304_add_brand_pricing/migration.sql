-- CreateTable
CREATE TABLE "BrandPricing" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "sizePricing" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandPricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandPricing_brand_key" ON "BrandPricing"("brand");
