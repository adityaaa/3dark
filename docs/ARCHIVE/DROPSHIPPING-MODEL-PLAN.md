# 3Dark On-Demand Sourcing Implementation Plan

## Business Model Overview

3Dark operates on an **on-demand sourcing model**:
1. Products are manufactured/purchased
2. Products are distributed to local souvenir shops
3. When an online order is received:
   - Admin contacts the shopkeeper who has the item
   - Item is retrieved from the shop
   - Admin packs and ships to customer
4. Processing time: 2-3 days for sourcing + shipping time

## System Implications

### ✅ What We Have
- Order management system
- Payment integration (Razorpay)
- Email notifications
- Inventory tracking system (as a sales tracker)
- Customer accounts and order history

### 🔄 What Needs Adaptation

#### 1. Order Workflow (CRITICAL)
**Current:** Order → Payment → Processing → Shipped
**Needed:** Order → Payment → **Pending Confirmation** → Confirmed → Sourced → Packed → Shipped

**New Order Statuses:**
```typescript
enum OrderStatus {
  PENDING_PAYMENT    // Waiting for Razorpay confirmation
  PENDING_CONFIRMATION // Payment received, admin needs to verify with shops
  CONFIRMED          // Admin confirmed availability with shop
  SOURCING          // Retrieving item from shop
  PACKING           // Item received, being packed
  SHIPPED           // Shipped to customer
  DELIVERED         // Delivered
  CANCELLED         // Cancelled (before sourcing)
  REFUNDED          // Refunded (if couldn't source)
}
```

#### 2. Inventory System (LOW PRIORITY)
- Current system tracks "estimated availability"
- NOT real-time blocking inventory
- Use for:
  - Sales tracking
  - Trend analysis
  - Rough availability estimates
- Admin updates based on shop feedback

#### 3. Customer Communication (CRITICAL)
**Need to set expectations:**
- Processing time: 2-3 business days
- Sourcing process explained
- Order confirmation with expected sourcing date
- Update when item is sourced and shipped

## Implementation Priority

### Phase 1: Launch-Ready (Next 2 Days)

#### Task 1: Update Order Status System
**File:** `prisma/schema.prisma`
- Add new status values
- Migration script

**Files to Update:**
- `/app/api/payment/verify/route.ts` - Create orders as PENDING_CONFIRMATION
- `/app/admin/orders/[id]/page.tsx` - Admin can change status through workflow
- `/app/api/admin/orders/[id]/route.ts` - Handle status transitions

#### Task 2: Customer Messaging
**Files:**
- `/app/checkout/page.tsx` - Add processing time notice
- `/app/api/payment/verify/route.ts` - Update order confirmation email
- `/app/account/orders/page.tsx` - Show status with explanations

**Messages to Add:**
```
"Your order is being prepared! We're sourcing your items from our trusted partners. 
This typically takes 2-3 business days before shipping."
```

#### Task 3: Admin Workflow
**File:** `/app/admin/orders/[id]/page.tsx`
- Clear workflow buttons: Confirm → Source → Pack → Ship
- Notes field for shop contact info
- Quick status updates

#### Task 4: Soft Stock Warnings (Optional)
**Files:**
- `/app/product/[slug]/product-client.tsx` - Show "Limited availability" instead of blocking
- `/app/shop/page.tsx` - Similar treatment

### Phase 2: Post-Launch (Week 1)

#### Task 5: Enhanced Admin Features
- Shopkeeper contact management
- Inventory sync requests
- Bulk status updates

#### Task 6: Analytics
- Track sourcing times
- Shop performance
- Stock accuracy

#### Task 7: Customer Features
- More detailed tracking
- Estimated delivery calculator
- Notifications at each stage

## Key Differences from Traditional E-Commerce

| Aspect | Traditional | 3Dark Model |
|--------|------------|-------------|
| **Inventory** | Real-time stock | Estimated availability |
| **Checkout** | Instant confirmation | Pending confirmation |
| **Processing** | 1 day (pick & pack) | 2-3 days (source & pack) |
| **Out of Stock** | Block purchase | Allow with note |
| **Fulfillment** | Warehouse → Customer | Shop → Warehouse → Customer |

## Email Templates

### Order Confirmation (After Payment)
```
Subject: Order Confirmed - We're Preparing Your Items! #[ORDER_ID]

Hi [Customer Name],

Thank you for your order! We've received your payment and are now preparing your items.

🔍 What Happens Next:
1. We're sourcing your items from our trusted partners (2-3 business days)
2. Once received, we'll pack them with care
3. You'll get a tracking number when shipped

📦 Order Details: [ORDER ITEMS]
💰 Total Paid: ₹[AMOUNT]
⏱️ Expected Processing: 2-3 business days

We'll update you at each step!

Track your order: [TRACKING_LINK]
```

### Item Sourced Confirmation
```
Subject: Great News! Your Items Are Ready to Ship #[ORDER_ID]

Hi [Customer Name],

Your items have been sourced and are being packed for shipment!

📦 You'll receive your tracking number within 24 hours.

Expected delivery: [DATE_RANGE]
```

## Checkout Page Updates

Add prominent notice:
```tsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
  <h3 className="font-semibold text-blue-900 mb-2">
    📦 About Processing Time
  </h3>
  <p className="text-blue-800 text-sm">
    We source our products on-demand to ensure freshness and quality. 
    Your order will be processed within 2-3 business days before shipping.
  </p>
</div>
```

## Admin Dashboard Updates

Add workflow buttons:
```tsx
<div className="flex gap-2">
  <button onClick={() => updateStatus('CONFIRMED')}>
    ✅ Confirm Availability
  </button>
  <button onClick={() => updateStatus('SOURCING')}>
    🔍 Mark as Sourcing
  </button>
  <button onClick={() => updateStatus('PACKING')}>
    📦 Item Received - Packing
  </button>
  <button onClick={() => updateStatus('SHIPPED')}>
    🚚 Shipped (Add Tracking)
  </button>
</div>
```

## Next Steps

1. ✅ Review this plan
2. ⏳ Implement Task 1: Order Status System
3. ⏳ Implement Task 2: Customer Messaging
4. ⏳ Implement Task 3: Admin Workflow
5. ⏳ Test complete order flow
6. ⏳ Update documentation
7. 🚀 Launch!

---
**Created:** ${new Date().toISOString()}
**Model:** On-Demand Sourcing / Dropshipping
**Status:** Ready for implementation
