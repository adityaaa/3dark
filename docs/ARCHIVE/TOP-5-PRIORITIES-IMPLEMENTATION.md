# TOP 5 PRIORITIES - IMPLEMENTATION GUIDE

**Project:** 3Dark E-Commerce  
**Date:** December 2024  
**Estimated Total Time:** 15-20 hours

---

## 🎯 PRIORITY 1: INVENTORY VALIDATION & DEDUCTION IN CHECKOUT

**Estimated Time:** 4-6 hours  
**Status:** ⚠️ CRITICAL - Showstopper

### Files to Modify:
1. `/app/api/checkout/route.ts` - Add validation and deduction
2. `/app/api/payment/verify/route.ts` - Add deduction after payment
3. `/lib/inventory.ts` - New utility functions

### Implementation Steps:

#### Step 1: Create Inventory Utility Functions (30 min)

Create `/lib/inventory.ts`:

```typescript
import { prisma } from "./db";

export interface StockCheckResult {
  available: boolean;
  productId: number;
  productName: string;
  requestedSize: string;
  requestedQty: number;
  availableQty: number;
}

/**
 * Check if items are in stock
 */
export async function checkStockAvailability(
  items: { id: number; size: string; qty: number }[]
): Promise<{ success: boolean; errors: StockCheckResult[] }> {
  const errors: StockCheckResult[] = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.id },
      select: {
        id: true,
        name: true,
        stockBySizes: true,
        trackInventory: true,
      },
    });

    if (!product) {
      errors.push({
        available: false,
        productId: item.id,
        productName: "Unknown Product",
        requestedSize: item.size,
        requestedQty: item.qty,
        availableQty: 0,
      });
      continue;
    }

    // Skip check if inventory tracking disabled
    if (!product.trackInventory) continue;

    const stockBySizes = product.stockBySizes
      ? JSON.parse(product.stockBySizes)
      : {};
    const availableQty = stockBySizes[item.size] || 0;

    if (availableQty < item.qty) {
      errors.push({
        available: false,
        productId: product.id,
        productName: product.name,
        requestedSize: item.size,
        requestedQty: item.qty,
        availableQty,
      });
    }
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

/**
 * Deduct stock after successful order
 */
export async function deductInventory(
  orderId: number,
  items: { productId: number; size: string; quantity: number }[],
  createdBy: string = "system"
) {
  const transactions = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: {
        id: true,
        name: true,
        stockBySizes: true,
        totalStock: true,
        trackInventory: true,
      },
    });

    if (!product || !product.trackInventory) continue;

    const stockBySizes = product.stockBySizes
      ? JSON.parse(product.stockBySizes)
      : {};
    const previousStock = stockBySizes[item.size] || 0;
    const newStock = Math.max(0, previousStock - item.quantity);
    
    // Update stock
    stockBySizes[item.size] = newStock;
    
    // Calculate new total
    const newTotalStock = Object.values(stockBySizes).reduce(
      (sum: number, qty: number) => sum + qty,
      0
    );

    // Update product
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stockBySizes: JSON.stringify(stockBySizes),
        totalStock: newTotalStock,
      },
    });

    // Create inventory transaction
    transactions.push(
      prisma.inventoryTransaction.create({
        data: {
          productId: item.productId,
          type: "sale",
          size: item.size,
          quantity: -item.quantity, // Negative for deduction
          previousStock,
          newStock,
          notes: `Order #${orderId} - Stock deducted`,
          createdBy,
        },
      })
    );
  }

  await Promise.all(transactions);
}

/**
 * Restore stock after order cancellation
 */
export async function restoreInventory(
  orderId: number,
  items: { productId: number; size: string; quantity: number }[],
  createdBy: string = "system"
) {
  const transactions = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: {
        id: true,
        stockBySizes: true,
        totalStock: true,
        trackInventory: true,
      },
    });

    if (!product || !product.trackInventory) continue;

    const stockBySizes = product.stockBySizes
      ? JSON.parse(product.stockBySizes)
      : {};
    const previousStock = stockBySizes[item.size] || 0;
    const newStock = previousStock + item.quantity;
    
    stockBySizes[item.size] = newStock;
    
    const newTotalStock = Object.values(stockBySizes).reduce(
      (sum: number, qty: number) => sum + qty,
      0
    );

    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stockBySizes: JSON.stringify(stockBySizes),
        totalStock: newTotalStock,
      },
    });

    transactions.push(
      prisma.inventoryTransaction.create({
        data: {
          productId: item.productId,
          type: "return",
          size: item.size,
          quantity: item.quantity, // Positive for restoration
          previousStock,
          newStock,
          notes: `Order #${orderId} - Cancelled, stock restored`,
          createdBy,
        },
      })
    );
  }

  await Promise.all(transactions);
}
```

#### Step 2: Update Checkout API (2 hours)

Modify `/app/api/checkout/route.ts`:

```typescript
import { checkStockAvailability, deductInventory } from "@/lib/inventory";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items, paymentMethod } = body;
    
    // ... existing validation ...

    // ✅ NEW: Check stock availability BEFORE creating order
    const stockCheck = await checkStockAvailability(
      items.map((item: any) => ({
        id: item.id,
        size: item.size,
        qty: item.qty,
      }))
    );

    if (!stockCheck.success) {
      // Return detailed error messages
      const errorMessages = stockCheck.errors.map(
        (err) =>
          `${err.productName} (${err.requestedSize}): Only ${err.availableQty} available, you requested ${err.requestedQty}`
      );

      return NextResponse.json(
        {
          error: "Some items are out of stock",
          details: errorMessages,
          outOfStockItems: stockCheck.errors,
        },
        { status: 400 }
      );
    }

    // Wrap order creation in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: { /* ... existing data ... */ },
        include: { items: true },
      });

      // ✅ NEW: For COD orders, deduct inventory immediately
      if (paymentMethod === "cod") {
        await deductInventory(
          order.id,
          order.items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
          }))
        );
      }

      return order;
    });

    // ... rest of payment logic ...
  } catch (error) {
    // ... error handling ...
  }
}
```

#### Step 3: Update Payment Verification (1 hour)

Modify `/app/api/payment/verify/route.ts`:

```typescript
import { deductInventory } from "@/lib/inventory";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update order and deduct inventory in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Update order
      const updatedOrder = await tx.order.update({
        where: { id: Number.parseInt(orderId) },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          paymentStatus: "paid",
          orderStatus: "confirmed",
        },
        include: { items: true },
      });

      // ✅ NEW: Deduct inventory after successful payment
      await deductInventory(
        updatedOrder.id,
        updatedOrder.items.map((item) => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
        })),
        "razorpay-payment"
      );

      return updatedOrder;
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
```

#### Step 4: Testing (1-2 hours)

**Test Scenarios:**
1. ✅ Place order with sufficient stock → Success
2. ✅ Place order with insufficient stock → Error with details
3. ✅ Place COD order → Stock deducted immediately
4. ✅ Place Razorpay order → Stock deducted after payment
5. ✅ Concurrent orders for same item → One fails (race condition test)
6. ✅ Verify inventory transactions are logged correctly

---

## 🎯 PRIORITY 2: STOCK INDICATORS ON SHOP & PRODUCT PAGES

**Estimated Time:** 3-4 hours  
**Status:** ⚠️ CRITICAL UX

### Files to Modify:
1. `/app/shop/page.tsx` - Pass stock data
2. `/components/ShopProductCard.tsx` - Add badges
3. `/app/product/[slug]/product-client.tsx` - Disable out-of-stock sizes
4. `/app/product/[slug]/page.tsx` - Pass stock data

### Implementation Steps:

#### Step 1: Update Shop Page to Include Stock (30 min)

Modify `/app/shop/page.tsx`:

```typescript
export default async function ShopPage() {
  const productsDb = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      brand: true,
      category: true,
      ageGroup: true,
      image: true,
      images: true,
      price: true,
      mrp: true,
      sizes: true,
      sizePricing: true,
      // ✅ NEW: Include stock data
      stockBySizes: true,
      totalStock: true,
      lowStockThreshold: true,
      trackInventory: true,
    },
  });
  
  // ... map products with stock info ...
  const products = productsDb.map(p => {
    const product = mapProduct(p);
    const stockBySizes = p.stockBySizes ? JSON.parse(p.stockBySizes) : {};
    
    return {
      ...product,
      totalStock: p.totalStock,
      isOutOfStock: p.trackInventory && p.totalStock === 0,
      isLowStock: p.trackInventory && p.totalStock > 0 && p.totalStock <= p.lowStockThreshold,
      stockBySizes,
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ... */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {products.map((p) => {
          const { price: displayPrice, mrp: displayMrp } = getLowestPrice(p);
          return (
            <ShopProductCard
              key={p.id}
              id={p.id}
              slug={p.slug}
              name={p.name}
              brand={p.brand}
              image={p.image}
              images={p.images}
              price={displayPrice}
              mrp={displayMrp}
              // ✅ NEW: Pass stock props
              isOutOfStock={p.isOutOfStock}
              isLowStock={p.isLowStock}
              totalStock={p.totalStock}
            />
          );
        })}
      </div>
    </div>
  );
}
```

#### Step 2: Update ShopProductCard Component (1 hour)

Modify `/components/ShopProductCard.tsx`:

```typescript
interface ShopProductCardProps {
  // ... existing props ...
  isOutOfStock?: boolean;
  isLowStock?: boolean;
  totalStock?: number;
}

export default function ShopProductCard({
  id,
  slug,
  name,
  brand,
  image,
  images,
  price,
  mrp,
  isOutOfStock = false,
  isLowStock = false,
  totalStock = 0,
}: ShopProductCardProps) {
  return (
    <Link
      href={`/product/${slug}`}
      className={`group relative block rounded-2xl border bg-black/60 p-4 transition hover:border-neon/50 ${
        isOutOfStock
          ? "border-white/10 opacity-60"
          : "border-white/20"
      }`}
    >
      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-black/70">
        {/* ✅ NEW: Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <span className="rounded-full bg-red-950/80 border border-red-500/60 px-4 py-2 text-xs font-semibold text-red-400 uppercase">
              Out of Stock
            </span>
          </div>
        )}

        {/* ✅ NEW: Low Stock Badge */}
        {!isOutOfStock && isLowStock && (
          <div className="absolute top-2 right-2 z-10">
            <span className="rounded-full bg-amber-950/90 border border-amber-500/60 px-2 py-1 text-xs font-semibold text-amber-400">
              Only {totalStock} left!
            </span>
          </div>
        )}

        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-contain p-2 transition group-hover:scale-105"
        />
      </div>

      {/* Product info */}
      <div className="mt-3">
        <h3 className="text-sm font-medium line-clamp-2">{name}</h3>
        <p className="text-xs text-white/50 mt-0.5">{brand}</p>
        
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-semibold">₹{price}</span>
          {mrp > price && (
            <span className="text-xs text-white/40 line-through">₹{mrp}</span>
          )}
        </div>

        {/* ✅ NEW: Stock status text */}
        {isOutOfStock && (
          <p className="text-xs text-red-400 mt-2">Currently unavailable</p>
        )}
      </div>

      {/* Hover effect */}
      {!isOutOfStock && (
        <div className="absolute inset-0 rounded-2xl border-2 border-neon opacity-0 transition group-hover:opacity-100 pointer-events-none" />
      )}
    </Link>
  );
}
```

#### Step 3: Update Product Page (1.5 hours)

Modify `/app/product/[slug]/page.tsx` to pass stock data:

```typescript
export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: {
      // ... existing fields ...
      stockBySizes: true,
      totalStock: true,
      trackInventory: true,
      lowStockThreshold: true,
    },
  });

  // ... existing code ...

  const stockBySizes = product.stockBySizes 
    ? JSON.parse(product.stockBySizes) 
    : {};

  return (
    <ProductClient 
      product={storeProduct} 
      stockBySizes={stockBySizes}
      trackInventory={product.trackInventory}
      lowStockThreshold={product.lowStockThreshold}
    />
  );
}
```

Modify `/app/product/[slug]/product-client.tsx`:

```typescript
interface ProductClientProps {
  product: StoreProduct;
  stockBySizes?: Record<string, number>;
  trackInventory?: boolean;
  lowStockThreshold?: number;
}

export default function ProductClient({ 
  product, 
  stockBySizes = {},
  trackInventory = true,
  lowStockThreshold = 5,
}: ProductClientProps) {
  const { addItem } = useCart();
  const isFreeSize = product.sizes.length === 1 && (product.sizes[0] === "Free Size" || product.sizes[0] === "One Size");
  const [size, setSize] = useState(isFreeSize ? product.sizes[0] : (product.sizes[0] || "Free"));
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ NEW: Check stock for selected size
  const selectedStock = trackInventory ? (stockBySizes[size] || 0) : 999;
  const isOutOfStock = trackInventory && selectedStock === 0;
  const isLowStock = trackInventory && selectedStock > 0 && selectedStock <= lowStockThreshold;

  function handleAddToCart() {
    if (isOutOfStock) return;
    addItem(product, size);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* ... existing gallery code ... */}

      {/* RIGHT: details */}
      <div className="flex flex-col gap-4">
        {/* ... existing product info ... */}

        {/* Size selector with stock indicators */}
        {!isFreeSize && product.sizes.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-white/60">
                Select Size {product.ageGroup === 'kids' && '(Age)'}
              </p>
              <SizeGuide category={product.category} ageGroup={product.ageGroup} />
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const sizeStock = trackInventory ? (stockBySizes[s] || 0) : 999;
                const sizeOutOfStock = trackInventory && sizeStock === 0;
                
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => !sizeOutOfStock && setSize(s)}
                    disabled={sizeOutOfStock}
                    className={`rounded-full border px-3 py-1 text-xs relative ${
                      sizeOutOfStock
                        ? "border-white/10 text-white/30 cursor-not-allowed line-through"
                        : s === size
                        ? "border-neon bg-neon text-black"
                        : "border-white/20 text-white/70 hover:border-neon/50"
                    }`}
                  >
                    {s}
                    {sizeOutOfStock && (
                      <span className="sr-only">Out of stock</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ✅ NEW: Stock status messages */}
        {trackInventory && (
          <div className="mt-2">
            {isOutOfStock && (
              <div className="rounded-lg bg-red-950/40 border border-red-500/40 px-3 py-2">
                <p className="text-xs text-red-400 font-medium">
                  ⚠️ This size is currently out of stock
                </p>
              </div>
            )}
            {!isOutOfStock && isLowStock && (
              <div className="rounded-lg bg-amber-950/40 border border-amber-500/40 px-3 py-2">
                <p className="text-xs text-amber-400 font-medium">
                  ⚡ Only {selectedStock} left in stock!
                </p>
              </div>
            )}
            {!isOutOfStock && !isLowStock && selectedStock < 20 && (
              <p className="text-xs text-green-400">
                ✓ In stock ({selectedStock} available)
              </p>
            )}
          </div>
        )}

        {/* ... existing price display ... */}

        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`rounded-full px-5 py-2 text-sm font-semibold shadow-glow ${
              isOutOfStock
                ? "bg-gray-600 text-white/50 cursor-not-allowed"
                : "bg-neon text-black hover:brightness-95"
            }`}
          >
            {isOutOfStock 
              ? "Out of Stock" 
              : `Add to cart – ₹${selectedPricing.price}`
            }
          </button>
        </div>

        {/* ... rest of component ... */}
      </div>
    </div>
  );
}
```

#### Step 4: Testing (30 min)

**Test Scenarios:**
1. ✅ Shop page shows "Out of Stock" badge on unavailable items
2. ✅ Shop page shows "Only X left!" for low stock
3. ✅ Product page disables out-of-stock size buttons
4. ✅ Product page shows stock status messages
5. ✅ "Add to Cart" button disabled when out of stock
6. ✅ Stock indicators update after admin inventory changes

---

## 🎯 PRIORITY 3: COMPLETE ORDER FULFILLMENT WORKFLOW

**Estimated Time:** 4-5 hours  
**Status:** HIGH PRIORITY

### Files to Modify:
1. `/prisma/schema.prisma` - Add tracking field
2. `/app/api/admin/orders/[id]/route.ts` - Add status update endpoints
3. `/app/admin/orders/[id]/page.tsx` - Add UI actions
4. `/lib/email.ts` - Add status update emails

### Implementation Steps:

#### Step 1: Update Database Schema (30 min)

Add tracking number to Order model in `/prisma/schema.prisma`:

```prisma
model Order {
  // ... existing fields ...
  trackingNumber     String?     // ✅ NEW: Shipping tracking number
  shippedAt          DateTime?   // ✅ NEW: When marked as shipped
  deliveredAt        DateTime?   // ✅ NEW: When marked as delivered
  cancelledAt        DateTime?   // ✅ NEW: When cancelled
  cancellationReason String?     // ✅ NEW: Why cancelled
  // ... rest of fields ...
}
```

Run migration:
```bash
npx prisma migrate dev --name add_tracking_fields
npx prisma generate
```

#### Step 2: Create Status Update API (2 hours)

Update `/app/api/admin/orders/[id]/route.ts`:

```typescript
import { sendOrderStatusEmail } from "@/lib/email";
import { restoreInventory } from "@/lib/inventory";

// PATCH /api/admin/orders/[id] - Update order status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = Number.parseInt(params.id);
    const body = await req.json();
    const { action, trackingNumber, cancellationReason } = body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let updatedOrder;

    switch (action) {
      case "mark-shipped":
        if (!trackingNumber) {
          return NextResponse.json(
            { error: "Tracking number required" },
            { status: 400 }
          );
        }
        
        updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: {
            orderStatus: "shipped",
            trackingNumber,
            shippedAt: new Date(),
          },
        });

        // Send email
        await sendOrderStatusEmail({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          status: "shipped",
          trackingNumber,
        });
        break;

      case "mark-delivered":
        updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: {
            orderStatus: "delivered",
            deliveredAt: new Date(),
          },
        });

        await sendOrderStatusEmail({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          status: "delivered",
        });
        break;

      case "cancel":
        // Cancel order and restore inventory
        updatedOrder = await prisma.$transaction(async (tx) => {
          const cancelled = await tx.order.update({
            where: { id: orderId },
            data: {
              orderStatus: "cancelled",
              cancelledAt: new Date(),
              cancellationReason: cancellationReason || "Cancelled by admin",
            },
          });

          // Restore inventory
          await restoreInventory(
            orderId,
            order.items.map((item) => ({
              productId: item.productId,
              size: item.size,
              quantity: item.quantity,
            })),
            session.user.email || "admin"
          );

          return cancelled;
        });

        await sendOrderStatusEmail({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          status: "cancelled",
          cancellationReason: cancellationReason || "Cancelled by admin",
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
```

#### Step 3: Add Email Templates (1 hour)

Update `/lib/email.ts` with new email function:

```typescript
export async function sendOrderStatusEmail({
  orderNumber,
  customerName,
  customerEmail,
  status,
  trackingNumber,
  cancellationReason,
}: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  cancellationReason?: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const subject =
    status === "shipped"
      ? `Your Order ${orderNumber} Has Been Shipped! 🚚`
      : status === "delivered"
      ? `Your Order ${orderNumber} Has Been Delivered! 🎉`
      : `Order ${orderNumber} Cancelled`;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #C3FF3C; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .tracking { background: #fff; border: 2px dashed #C3FF3C; padding: 15px; margin: 20px 0; text-align: center; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #C3FF3C; }
        .button { display: inline-block; padding: 12px 24px; background: #C3FF3C; color: #000; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>3Dark</h1>
        </div>
        <div class="content">
  `;

  if (status === "shipped") {
    html += `
          <h2>Your Order is On Its Way!</h2>
          <p>Hi ${customerName},</p>
          <p>Great news! Your order <strong>${orderNumber}</strong> has been shipped and is on its way to you.</p>
          
          ${
            trackingNumber
              ? `
          <div class="tracking">
            <p style="margin:0; font-size: 14px; color: #666;">Tracking Number</p>
            <p class="tracking-number">${trackingNumber}</p>
            <p style="margin:0; font-size: 12px; color: #888;">Track your shipment with the courier company</p>
          </div>
          `
              : ""
          }
          
          <p>Expected delivery: 3-7 business days</p>
          
          <a href="https://3dark.in/account" class="button">View Order Details</a>
          
          <p>If you have any questions, feel free to contact us at support@3dark.in</p>
    `;
  } else if (status === "delivered") {
    html += `
          <h2>Your Order Has Been Delivered! 🎉</h2>
          <p>Hi ${customerName},</p>
          <p>Your order <strong>${orderNumber}</strong> has been successfully delivered!</p>
          
          <p>We hope you love your new glow-in-the-dark gear! Don't forget to share your photos on Instagram and tag us <strong>@3darkclothings</strong></p>
          
          <a href="https://3dark.in/account" class="button">Write a Review</a>
          
          <p>Thank you for shopping with 3Dark! ✨</p>
    `;
  } else if (status === "cancelled") {
    html += `
          <h2>Order Cancelled</h2>
          <p>Hi ${customerName},</p>
          <p>Your order <strong>${orderNumber}</strong> has been cancelled.</p>
          
          ${
            cancellationReason
              ? `<p><strong>Reason:</strong> ${cancellationReason}</p>`
              : ""
          }
          
          <p>If you paid online, your refund will be processed within 5-7 business days.</p>
          
          <p>If you have any questions, please contact us at support@3dark.in</p>
          
          <a href="https://3dark.in/shop" class="button">Continue Shopping</a>
    `;
  }

  html += `
        </div>
        <div class="footer">
          <p>3Dark - Glow in the Dark Clothing</p>
          <p>support@3dark.in | WhatsApp: +91 87507 93395</p>
          <p>&copy; ${new Date().getFullYear()} 3Dark. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: "3Dark <support@3dark.in>",
    to: customerEmail,
    subject,
    html,
  });
}
```

#### Step 4: Update Admin UI (1 hour)

Update `/app/admin/orders/[id]/page.tsx`:

```typescript
"use client";

import { useState } from "react";

export default function AdminOrderDetailClient({ order }: { order: any }) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleStatusUpdate(action: string) {
    if (
      action === "mark-shipped" &&
      !trackingNumber &&
      !confirm("Continue without tracking number?")
    ) {
      return;
    }

    if (
      action === "cancel" &&
      !confirm("Are you sure you want to cancel this order? Inventory will be restored.")
    ) {
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          trackingNumber: action === "mark-shipped" ? trackingNumber : undefined,
          cancellationReason:
            action === "cancel" ? cancellationReason : undefined,
        }),
      });

      if (res.ok) {
        alert("Order updated successfully!");
        window.location.reload();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update order");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div>
      {/* ... existing order details ... */}

      {/* Status Actions */}
      <div className="mt-6 rounded-lg bg-black/60 p-6 border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Order Actions</h3>

        {order.orderStatus === "confirmed" && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tracking Number (optional)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"
            />
            <button
              onClick={() => handleStatusUpdate("mark-shipped")}
              disabled={isProcessing}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Mark as Shipped
            </button>
          </div>
        )}

        {order.orderStatus === "shipped" && (
          <button
            onClick={() => handleStatusUpdate("mark-delivered")}
            disabled={isProcessing}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            Mark as Delivered
          </button>
        )}

        {!["delivered", "cancelled"].includes(order.orderStatus) && (
          <div className="mt-4 space-y-3 pt-4 border-t border-white/10">
            <textarea
              placeholder="Cancellation reason (optional)"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"
            />
            <button
              onClick={() => handleStatusUpdate("cancel")}
              disabled={isProcessing}
              className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🎯 PRIORITY 4: ORDER CANCELLATION WITH INVENTORY RESTORE

**Estimated Time:** 3-4 hours  
**Status:** HIGH PRIORITY

### Already covered in Priority 3! ✅

The order cancellation workflow with inventory restoration is included in Priority 3's implementation. The key components:

1. ✅ `restoreInventory()` function in `/lib/inventory.ts`
2. ✅ Cancel action in `/app/api/admin/orders/[id]/route.ts`
3. ✅ Cancellation email template in `/lib/email.ts`
4. ✅ Cancel button in admin UI

**Additional Requirements:**

### Customer-Initiated Cancellation (Optional):

Add to `/app/account/AccountClient.tsx`:

```typescript
async function handleCancelOrder(orderId: number) {
  if (!confirm("Are you sure you want to cancel this order?")) return;

  try {
    const res = await fetch(`/api/orders/${orderId}/cancel`, {
      method: "POST",
    });

    if (res.ok) {
      alert("Order cancelled successfully");
      window.location.reload();
    } else {
      const data = await res.json();
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error(error);
    alert("Failed to cancel order");
  }
}
```

Create `/app/api/orders/[id]/cancel/route.ts`:

```typescript
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = Number.parseInt(params.id);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify order belongs to customer
    if (order.customerEmail !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if order can be cancelled (within 24 hours)
    const hoursSinceOrder =
      (Date.now() - order.createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceOrder > 24) {
      return NextResponse.json(
        { error: "Orders can only be cancelled within 24 hours" },
        { status: 400 }
      );
    }

    // Check if order is already shipped/delivered
    if (["shipped", "delivered", "cancelled"].includes(order.orderStatus)) {
      return NextResponse.json(
        { error: "This order cannot be cancelled" },
        { status: 400 }
      );
    }

    // Cancel and restore inventory
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const cancelled = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: "cancelled",
          cancelledAt: new Date(),
          cancellationReason: "Cancelled by customer",
        },
      });

      await restoreInventory(
        orderId,
        order.items.map((item) => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
        })),
        session.user.email || "customer"
      );

      return cancelled;
    });

    // Send cancellation email
    await sendOrderStatusEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      status: "cancelled",
      cancellationReason: "Cancelled by customer",
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Order cancellation error:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
```

---

## 🎯 PRIORITY 5: CART STOCK VALIDATION & LIMITS

**Estimated Time:** 2-3 hours  
**Status:** MEDIUM-HIGH PRIORITY

### Files to Modify:
1. `/components/CartContext.tsx` - Add validation
2. `/app/checkout/CheckoutClient.tsx` - Add availability check
3. Create `/components/CartStockCheck.tsx` - New component

### Implementation Steps:

#### Step 1: Update CartContext (1 hour)

Modify `/components/CartContext.tsx`:

```typescript
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { StoreProduct, CartItem } from "@/lib/types";

type CartContextType = {
  items: CartItem[];
  addItem: (product: StoreProduct, size: string, qty?: number) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, qty: number) => void;
  clear: () => void;
  total: number;
  checkStock: () => Promise<StockIssue[]>; // ✅ NEW
};

interface StockIssue {
  productId: number;
  productName: string;
  size: string;
  requestedQty: number;
  availableQty: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // ✅ NEW: Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load cart:", e);
      }
    }
  }, []);

  // ✅ NEW: Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function addItem(product: StoreProduct, size: string, qty = 1) {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.product.id === product.id && i.size === size
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { product, size, qty }];
    });
  }

  function removeItem(productId: number, size: string) {
    setItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.size === size))
    );
  }

  function updateQuantity(productId: number, size: string, qty: number) {
    if (qty <= 0) {
      removeItem(productId, size);
      return;
    }
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.product.id === productId && i.size === size
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty };
        return copy;
      }
      return prev;
    });
  }

  function clear() {
    setItems([]);
    localStorage.removeItem("cart");
  }

  // ✅ NEW: Check stock availability for all cart items
  async function checkStock(): Promise<StockIssue[]> {
    try {
      const res = await fetch("/api/cart/check-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.product.id,
            size: i.size,
            qty: i.qty,
          })),
        }),
      });

      const data = await res.json();
      return data.issues || [];
    } catch (error) {
      console.error("Stock check failed:", error);
      return [];
    }
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clear, total, checkStock }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
```

#### Step 2: Create Stock Check API (30 min)

Create `/app/api/cart/check-stock/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    const issues = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: {
          id: true,
          name: true,
          stockBySizes: true,
          trackInventory: true,
        },
      });

      if (!product || !product.trackInventory) continue;

      const stockBySizes = product.stockBySizes
        ? JSON.parse(product.stockBySizes)
        : {};
      const availableQty = stockBySizes[item.size] || 0;

      if (availableQty < item.qty) {
        issues.push({
          productId: product.id,
          productName: product.name,
          size: item.size,
          requestedQty: item.qty,
          availableQty,
        });
      }
    }

    return NextResponse.json({ issues });
  } catch (error) {
    console.error("Stock check error:", error);
    return NextResponse.json(
      { error: "Failed to check stock" },
      { status: 500 }
    );
  }
}
```

#### Step 3: Add Stock Check to Checkout (1 hour)

Update `/app/checkout/CheckoutClient.tsx`:

```typescript
import { useCart } from "@/components/CartContext";

export default function CheckoutClient() {
  const { items, total: cartTotal, clear, checkStock } = useCart();
  const [stockIssues, setStockIssues] = useState<any[]>([]);
  const [isCheckingStock, setIsCheckingStock] = useState(false);

  // ✅ NEW: Check stock on component mount
  useEffect(() => {
    async function checkAvailability() {
      setIsCheckingStock(true);
      const issues = await checkStock();
      setStockIssues(issues);
      setIsCheckingStock(false);
    }
    checkAvailability();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("processing");
    setError(null);

    // ✅ NEW: Check stock before submitting
    const issues = await checkStock();
    if (issues.length > 0) {
      setStockIssues(issues);
      setError("Some items in your cart are no longer available. Please review below.");
      setStatus("error");
      return;
    }

    // ... rest of checkout logic ...
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      {/* ✅ NEW: Stock Issues Alert */}
      {stockIssues.length > 0 && (
        <div className="mb-6 rounded-lg bg-red-950/40 border border-red-500/40 p-4">
          <h3 className="text-sm font-semibold text-red-400 mb-2">
            ⚠️ Stock Availability Issues
          </h3>
          <ul className="space-y-2 text-xs text-red-300">
            {stockIssues.map((issue, idx) => (
              <li key={idx}>
                <strong>{issue.productName}</strong> ({issue.size}): Only {issue.availableQty} available, you have {issue.requestedQty} in cart
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-red-300">
            Please update your cart quantities before proceeding.
          </p>
        </div>
      )}

      {/* ... rest of component ... */}
    </div>
  );
}
```

---

## ✅ TESTING CHECKLIST

After implementing each priority, test thoroughly:

### Priority 1 Tests:
- [ ] Order with sufficient stock → Success
- [ ] Order with insufficient stock → Clear error message
- [ ] COD order → Inventory deducted immediately
- [ ] Razorpay order → Inventory deducted after payment
- [ ] Concurrent orders → Handle race conditions
- [ ] Inventory transactions logged correctly

### Priority 2 Tests:
- [ ] Shop page shows stock badges
- [ ] Product page disables out-of-stock sizes
- [ ] Stock messages display correctly
- [ ] Add to cart disabled when out of stock
- [ ] Stock updates reflect in real-time

### Priority 3 Tests:
- [ ] Mark as shipped with tracking → Email sent
- [ ] Mark as delivered → Email sent
- [ ] Cancel order → Inventory restored, email sent
- [ ] Order timeline shows correctly

### Priority 4 Tests:
- [ ] Customer cancellation within 24h → Success
- [ ] Customer cancellation after 24h → Error
- [ ] Inventory restored after cancellation

### Priority 5 Tests:
- [ ] Cart checks stock on load
- [ ] Warning shown for unavailable items
- [ ] Checkout blocked if stock insufficient
- [ ] Cart persists in localStorage

---

## 📅 IMPLEMENTATION TIMELINE

**Total Estimated Time:** 15-20 hours

- **Day 1 (6-8 hours):** Priority 1 (Inventory in Checkout)
- **Day 2 (3-4 hours):** Priority 2 (Stock Indicators)
- **Day 3 (4-5 hours):** Priority 3 (Order Fulfillment)
- **Day 4 (2-3 hours):** Priority 4 & 5 (Cancellation + Cart)
- **Day 5 (2-3 hours):** Testing & Fixes

**Launch Ready:** After Day 5

---

**Last Updated:** [Date]  
**Status:** Ready for implementation
