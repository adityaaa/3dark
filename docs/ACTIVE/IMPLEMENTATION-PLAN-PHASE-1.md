# Phase 1 Implementation Plan - On-Demand Sourcing

**Start Date:** December 14, 2025  
**Target Launch:** December 16-17, 2025  
**Focus:** Core features for reliable on-demand sourcing

---

## 🎯 GOALS FOR PHASE 1

1. ✅ Set clear customer expectations about sourcing process
2. ✅ Enable efficient admin workflow for order confirmation
3. ✅ Handle "can't source" cases gracefully with refunds
4. ✅ Track which shops fulfill which orders
5. ✅ Build customer trust through transparency

---

## 📋 IMPLEMENTATION CHECKLIST

### **DAY 1: Database & Core System (4-5 hours)**

#### Task 1.1: Update Order Status System ✅
- [x] Add new order statuses to Prisma schema
- [x] Create migration
- [x] Update Order model with new fields

**New Statuses:**
```
PENDING_PAYMENT       // Waiting for Razorpay
PENDING_CONFIRMATION  // Payment received, need to check shops
CONFIRMED            // Available, sourcing started
SOURCING             // Retrieving from shop
PACKING              // Received, being packed
SHIPPED              // Shipped with tracking
DELIVERED            // Delivered
CANCELLED            // Cancelled before sourcing
REFUNDED             // Couldn't source, refunded
```

#### Task 1.2: Shop Network Database ✅
- [x] Create Shop model
- [x] Create ShopInventory model  
- [x] Create OrderSource model (track which shop fulfilled order)
- [x] Run migrations

#### Task 1.3: Product Notification Model ✅
- [x] Create ProductNotification model (for "notify me when available")
- [x] Run migration

---

### **DAY 1: Customer-Facing Changes (3-4 hours)**

#### Task 2.1: Checkout Page Banner ✅
- [x] Add transparent communication banner
- [x] Explain 2-3 day sourcing process
- [x] Set expectations clearly

#### Task 2.2: Update Order Confirmation Email ✅
- [x] Add sourcing timeline explanation
- [x] Add "What happens next" section
- [x] Include order tracking link

#### Task 2.3: Enhanced Order Tracking Page ✅
- [x] Visual timeline component
- [x] Show current status with detailed explanation
- [x] Expected dates for each stage

---

### **DAY 2: Admin Workflow (4-5 hours)**

#### Task 3.1: Admin Order Management Updates ✅
- [x] Add workflow action buttons (Confirm → Source → Pack → Ship)
- [x] Add "Cannot Source" button with refund flow
- [x] Add notes field for shop coordination
- [x] Add shop selection dropdown

#### Task 3.2: Shop Management Dashboard ✅
- [x] Create /admin/shops page
- [x] Add/Edit/List shops
- [x] Track shop contact info (phone, WhatsApp)
- [x] Mark shops as active/inactive

#### Task 3.3: Order Source Tracking ✅
- [x] When confirming order, select which shop
- [x] Track sourcing notes
- [x] Display in order details

---

### **DAY 2: Refund & Safety Net (2-3 hours)**

#### Task 4.1: "Cannot Source" API Endpoint ✅
- [x] Create `/api/admin/orders/[id]/cannot-source` endpoint
- [x] Integrate Razorpay refund API
- [x] Update order status to REFUNDED
- [x] Send customer email with alternatives

#### Task 4.2: Product Notification System ✅
- [x] Add customer to waitlist when item unavailable
- [x] Create API to notify when back in stock
- [x] Email template for notifications

---

### **DAY 3: Testing & Polish (3-4 hours)**

#### Task 5.1: End-to-End Testing ✅
- [ ] Test full order flow: Order → Confirm → Source → Ship
- [ ] Test "cannot source" refund flow
- [ ] Test email notifications
- [ ] Test admin workflow

#### Task 5.2: Email Templates ✅
- [ ] Order confirmation (with timeline)
- [ ] Order confirmed by admin
- [ ] Order sourcing update
- [ ] Order shipped (with tracking)
- [ ] Cannot source (with refund info)

#### Task 5.3: Documentation ✅
- [ ] Update admin user guide
- [ ] Create order fulfillment SOP
- [ ] Document refund process

---

## 🚀 WHAT WE'RE BUILDING

### **1. New Order Flow**

```
Customer Places Order
        ↓
[PENDING_PAYMENT] - Waiting for Razorpay
        ↓
Payment Success
        ↓
[PENDING_CONFIRMATION] - Admin checks with shops (24h)
        ↓
Admin confirms availability
        ↓
[CONFIRMED] - Send confirmation email to customer
        ↓
[SOURCING] - Retrieving from shop
        ↓
[PACKING] - Quality check & pack
        ↓
[SHIPPED] - Add tracking number, notify customer
        ↓
[DELIVERED] - Mark as delivered
```

### **2. "Cannot Source" Flow**

```
Customer Places Order
        ↓
[PENDING_CONFIRMATION]
        ↓
Admin checks shops → NOT AVAILABLE
        ↓
Admin clicks "Cannot Source"
        ↓
System:
  1. Initiates Razorpay refund
  2. Updates status to REFUNDED
  3. Adds customer to waitlist
  4. Sends email with:
     - Refund confirmation
     - Alternative products
     - Notify me option
```

### **3. Admin Dashboard**

```
┌─────────────────────────────────────────┐
│  Order #1234 - PENDING_CONFIRMATION     │
├─────────────────────────────────────────┤
│  Customer: John Doe                     │
│  Items: Tiger Shorts (L) x1             │
│  Amount: ₹899                           │
│                                         │
│  📞 SHOP COORDINATION:                  │
│  Select Shop: [Dropdown]                │
│  Notes: [Text area]                     │
│                                         │
│  ACTIONS:                               │
│  [✅ Confirm Available]                 │
│  [❌ Cannot Source - Refund]            │
└─────────────────────────────────────────┘
```

---

## 📊 SUCCESS METRICS

After Phase 1, we should have:

- ✅ Clear customer expectations (reduced support queries)
- ✅ Efficient admin workflow (5 min to process each order)
- ✅ Graceful failure handling (no angry customers)
- ✅ Order-to-shop tracking (know which shops are reliable)
- ✅ Automated refunds (no manual Razorpay dashboard work)

---

## 🔄 PHASE 2 (Next Week)

After launch and initial orders:

1. **Shop Inventory Dashboard** - Track what each shop has
2. **WhatsApp Notifications** - Auto-send status updates
3. **Express Sourcing Option** - Premium 24h sourcing (+₹149)
4. **Quality Photo Approval** - Send photos before shipping
5. **Shop Performance Analytics** - Track success rates

---

## 💻 TECHNICAL DETAILS

### Database Changes:
```typescript
// New models
- Shop (id, name, location, contact, whatsapp)
- ShopInventory (shopId, productId, size, quantity)
- OrderSource (orderId, shopId, notes, sourcedAt)
- ProductNotification (productId, size, email, phone)

// Order model updates
- New statuses (enum)
- shopNotes field
- refundReason field
- refundedAt field
- confirmedAt field
- sourcedAt field
- packedAt field
```

### New API Endpoints:
```
POST   /api/admin/orders/[id]/confirm
POST   /api/admin/orders/[id]/cannot-source
POST   /api/admin/orders/[id]/update-status
GET    /api/admin/shops
POST   /api/admin/shops
PUT    /api/admin/shops/[id]
DELETE /api/admin/shops/[id]
```

### Email Templates Needed:
```
1. order-confirmation-sourcing.tsx
2. order-confirmed-by-admin.tsx
3. order-sourcing-update.tsx
4. order-shipped-tracking.tsx
5. order-cannot-source-refund.tsx
```

---

## ✅ READY TO START?

I'll begin with:
1. **Database schema updates** (Prisma models)
2. **Checkout page banner** (customer transparency)
3. **Order status enum** (new workflow)

Then move to:
4. **Admin order management** (workflow buttons)
5. **Shop management** (basic CRUD)
6. **Refund API** (cannot source handling)

**Estimated Time:** 12-14 hours total
**Can Launch:** End of Day 3

Shall I proceed? 🚀
