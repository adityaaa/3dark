# Product Review System Implementation Guide

## 🎯 Overview

A complete review system has been implemented with:
- **Fake/seed reviews** for initial social proof
- **Verified customer reviews** (only after delivery)
- **Star ratings** with distribution
- **Review display** on product pages

---

## ✅ What's Been Done

### 1. Database Schema

**New `Review` Model** added to Prisma schema:
```prisma
model Review {
  id          Int      @id @default(autoincrement())
  productId   Int
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  customerId  Int?     // Null for fake/seed reviews
  customer    Customer? @relation(fields: [customerId], references: [id], onDelete: SetNull)
  orderId     Int?     // Only set for verified purchases
  order       Order?   @relation(fields: [orderId], references: [id], onDelete: SetNull)
  rating      Int      // 1-5 stars
  title       String?  // Optional review title
  comment     String   // Review text
  isVerified  Boolean  @default(false) // True if from actual purchase
  isFake      Boolean  @default(false) // True for seed/fake reviews
  customerName String  // Display name (for fake reviews or override)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Migration created**: `20251207144844_add_review_model`

### 2. Seed Script

**File**: `scripts/seed-fake-reviews.js`

**Features**:
- Creates 3-8 reviews per product
- 80% positive reviews (4-5 stars)
- 15% average reviews (3 stars)
- Realistic Indian customer names
- Varied review templates
- Random dates (last 60 days)

**Run it**:
```bash
node scripts/seed-fake-reviews.js
```

### 3. API Routes

**File**: `app/api/reviews/route.ts`

**GET `/api/reviews?productId=123`**
- Fetches all reviews for a product
- Returns average rating
- Returns rating distribution
- Returns review list

**POST `/api/reviews`**
- Creates new customer review
- **Requires order to be "delivered"**
- Prevents duplicate reviews
- Marks review as "verified purchase"

### 4. UI Component

**File**: `components/ProductReviews.tsx`

**Features**:
- Shows average rating with stars
- Displays rating distribution chart
- Lists all reviews with:
  - Star rating
  - Review title
  - Comment
  - Customer name
  - "Verified Purchase" badge
  - Date posted
- Responsive design
- Loading states

---

## 🚀 How to Use

### Step 1: Add Products First

Before seeding reviews, you need products in your database. Use the admin panel:

1. Go to `/admin/login`
2. Add products via `/admin/products/new`
3. Upload product images
4. Save products

### Step 2: Seed Fake Reviews

Once you have products:

```bash
# This will add 3-8 reviews per product
node scripts/seed-fake-reviews.js
```

### Step 3: Add Reviews to Product Pages

In your product page file (e.g., `app/product/[slug]/page.tsx`), add:

```tsx
import ProductReviews from "@/components/ProductReviews";

// Inside your component, after product details:
<ProductReviews productId={product.id} />
```

### Step 4: Let Customers Review (After Delivery)

When a customer's order is marked as "delivered", they can review:

**Option A: Add Review Button in Order Details**
```tsx
{order.orderStatus === "delivered" && !order.hasReview && (
  <button onClick={() => openReviewModal(order.id, product.id)}>
    Write a Review
  </button>
)}
```

**Option B: Send Review Request Email**
After delivery, send an email with a review link:
```
https://3dark.in/product/tiger-tshirt?reviewOrder=12345
```

---

## 📋 Next Steps

### 1. Update Product Pages

Add the `<ProductReviews />` component to show reviews:

```tsx
// app/product/[slug]/page.tsx
import ProductReviews from "@/components/ProductReviews";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  return (
    <div>
      {/* Product details */}
      
      {/* Add reviews section */}
      <ProductReviews productId={product.id} />
    </div>
  );
}
```

### 2. Add Review Submission UI

Create a modal or page for customers to submit reviews:

```tsx
// components/ReviewModal.tsx
"use client";

import { useState } from "react";

export default function ReviewModal({ orderId, productId, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        productId,
        rating,
        title,
        comment,
        customerId: session?.user?.id, // from useSession()
        customerName: session?.user?.name,
      }),
    });

    if (res.ok) {
      onSuccess();
    }
    setLoading(false);
  };

  // ... rest of modal UI
}
```

### 3. Add Review CTA to Order Details

In customer dashboard order view:

```tsx
{order.orderStatus === "delivered" && (
  <button
    onClick={() => setShowReviewModal(true)}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Write a Review
  </button>
)}
```

### 4. Update Admin Dashboard

Add review management:
- View all reviews
- Mark fake reviews for removal
- Respond to reviews
- Filter by rating

---

## 🎨 Customization

### Change Review Templates

Edit `scripts/seed-fake-reviews.js`:
```javascript
const REVIEW_TEMPLATES = {
  5: [ /* your 5-star reviews */ ],
  4: [ /* your 4-star reviews */ ],
  3: [ /* your 3-star reviews */ ],
};
```

### Adjust Review Count

```javascript
// Change this line in seed-fake-reviews.js:
const numReviews = Math.floor(Math.random() * 6) + 3; // 3-8 reviews
// To:
const numReviews = Math.floor(Math.random() * 11) + 5; // 5-15 reviews
```

### Styling

All styles are in `components/ProductReviews.tsx`. Customize:
- Colors
- Layout
- Typography
- Star icons

---

## 🔒 Security & Rules

### Review Submission Rules

1. ✅ Customer must have an account
2. ✅ Order must be marked "delivered"
3. ✅ One review per product per order
4. ✅ Rating must be 1-5 stars
5. ✅ Comment is required
6. ✅ Title is optional

### Review Display

- ✅ Fake reviews marked with `isFake: true`
- ✅ Verified purchases show badge
- ✅ Reviews sorted by date (newest first)
- ✅ Anonymous reviews not allowed

---

## 📊 Example Usage

### Seed Reviews
```bash
$ node scripts/seed-fake-reviews.js
🌱 Starting to seed fake reviews...

Found 12 products

Adding 5 reviews for: Tiger Print T-Shirt
Adding 6 reviews for: Leopard Shorts
...

✅ Successfully seeded 68 fake reviews!
📊 Average: 5.7 reviews per product
```

### API Response
```json
{
  "success": true,
  "reviews": [...],
  "stats": {
    "average": 4.6,
    "total": 7,
    "counts": {
      "5": 4,
      "4": 2,
      "3": 1,
      "2": 0,
      "1": 0
    }
  }
}
```

---

## 🐛 Troubleshooting

### No Products Found
**Issue**: Seed script shows 0 products
**Fix**: Add products via admin panel first

### Reviews Not Showing
**Issue**: Component shows "No reviews yet"
**Fix**: 
1. Check if reviews exist in database
2. Verify productId is correct
3. Check browser console for errors

### Can't Submit Review
**Issue**: API returns error
**Check**:
1. Order status is "delivered"
2. Customer is logged in
3. No duplicate review exists

---

## 🎯 Production Checklist

Before going live:

- [ ] Seed fake reviews for all products
- [ ] Add ProductReviews component to product pages
- [ ] Create review submission UI
- [ ] Test review submission flow
- [ ] Set up email notifications for review requests
- [ ] Add review management to admin panel
- [ ] Test review display on mobile
- [ ] Verify "Verified Purchase" badge works
- [ ] Ensure duplicate reviews are prevented

---

## 📚 Files Created/Modified

**New Files**:
- `scripts/seed-fake-reviews.js`
- `app/api/reviews/route.ts`
- `components/ProductReviews.tsx`

**Modified**:
- `prisma/schema.prisma` (added Review model)

**Migration**:
- `prisma/migrations/20251207144844_add_review_model/migration.sql`

---

**Need help?** The review system is ready to go! Just add products and run the seed script. 🚀
