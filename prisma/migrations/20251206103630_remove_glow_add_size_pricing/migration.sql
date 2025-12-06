/*
  Warnings:

  - You are about to drop the column `glowLevel` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "glowLevel",
ADD COLUMN     "sizePricing" TEXT;
