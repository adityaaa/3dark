-- Add on-demand sourcing fields to Order table
ALTER TABLE "Order" ADD COLUMN "shopNotes" TEXT;
ALTER TABLE "Order" ADD COLUMN "trackingNumber" TEXT;
ALTER TABLE "Order" ADD COLUMN "trackingUrl" TEXT;
ALTER TABLE "Order" ADD COLUMN "refundReason" TEXT;
ALTER TABLE "Order" ADD COLUMN "refundedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "confirmedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "sourcedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "packedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "shippedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "deliveredAt" TIMESTAMP(3);

-- Update default orderStatus for new orders
ALTER TABLE "Order" ALTER COLUMN "orderStatus" SET DEFAULT 'pending_payment';

-- Create Shop table
CREATE TABLE "Shop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT,
    "contact" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "ownerName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- Create ShopInventory table
CREATE TABLE "ShopInventory" (
    "id" SERIAL NOT NULL,
    "shopId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL DEFAULT 'admin',
    "notes" TEXT,

    CONSTRAINT "ShopInventory_pkey" PRIMARY KEY ("id")
);

-- Create OrderSource table
CREATE TABLE "OrderSource" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "notes" TEXT,
    "sourcedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderSource_pkey" PRIMARY KEY ("id")
);

-- Create ShopPerformance table
CREATE TABLE "ShopPerformance" (
    "id" SERIAL NOT NULL,
    "shopId" INTEGER NOT NULL,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "successfulOrders" INTEGER NOT NULL DEFAULT 0,
    "failedOrders" INTEGER NOT NULL DEFAULT 0,
    "avgResponseTime" DOUBLE PRECISION,
    "lastOrderDate" TIMESTAMP(3),
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopPerformance_pkey" PRIMARY KEY ("id")
);

-- Create ProductNotification table
CREATE TABLE "ProductNotification" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductNotification_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints
CREATE UNIQUE INDEX "ShopInventory_shopId_productId_size_key" ON "ShopInventory"("shopId", "productId", "size");
CREATE UNIQUE INDEX "OrderSource_orderId_key" ON "OrderSource"("orderId");
CREATE UNIQUE INDEX "ShopPerformance_shopId_month_year_key" ON "ShopPerformance"("shopId", "month", "year");

-- Create indexes for better query performance
CREATE INDEX "ShopInventory_productId_idx" ON "ShopInventory"("productId");
CREATE INDEX "ShopInventory_shopId_idx" ON "ShopInventory"("shopId");
CREATE INDEX "OrderSource_shopId_idx" ON "OrderSource"("shopId");
CREATE INDEX "OrderSource_orderId_idx" ON "OrderSource"("orderId");
CREATE INDEX "ShopPerformance_shopId_idx" ON "ShopPerformance"("shopId");
CREATE INDEX "ProductNotification_productId_size_notified_idx" ON "ProductNotification"("productId", "size", "notified");
CREATE INDEX "ProductNotification_email_idx" ON "ProductNotification"("email");

-- Add foreign keys
ALTER TABLE "ShopInventory" ADD CONSTRAINT "ShopInventory_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ShopInventory" ADD CONSTRAINT "ShopInventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderSource" ADD CONSTRAINT "OrderSource_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderSource" ADD CONSTRAINT "OrderSource_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ShopPerformance" ADD CONSTRAINT "ShopPerformance_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
