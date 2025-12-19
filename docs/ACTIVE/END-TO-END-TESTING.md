# End-to-End Testing Guide

**Date:** December 15, 2025  
**Status:** In Progress  
**Goal:** Verify all critical systems before launch

---

## 🎯 TESTING CHECKLIST

### ✅ Phase 1: Database & Server Setup (5 min)
- [ ] 1.1 Prisma client generated
- [ ] 1.2 Database migration applied
- [ ] 1.3 Dev server running
- [ ] 1.4 No console errors

### ✅ Phase 2: Frontend Pages (10 min)
- [ ] 2.1 Homepage loads correctly
- [ ] 2.2 Shop page displays products
- [ ] 2.3 Product detail pages work
- [ ] 2.4 About/Support pages load
- [ ] 2.5 Lookbook page loads

### ✅ Phase 3: Customer Authentication (10 min)
- [ ] 3.1 Register new customer account
- [ ] 3.2 Login with customer credentials
- [ ] 3.3 Customer dashboard accessible
- [ ] 3.4 Logout works correctly
- [ ] 3.5 Protected routes redirect to login

### ✅ Phase 4: Admin Authentication (10 min)
- [ ] 4.1 Admin login works
- [ ] 4.2 Admin dashboard accessible
- [ ] 4.3 All admin pages load (Products, Categories, Orders, etc.)
- [ ] 4.4 Admin logout works
- [ ] 4.5 Non-admin cannot access admin pages

### ✅ Phase 5: Shopping Cart (15 min)
- [ ] 5.1 Add product to cart
- [ ] 5.2 Cart shows correct size-specific price
- [ ] 5.3 Quantity update works
- [ ] 5.4 Remove from cart works
- [ ] 5.5 Cart persists across pages
- [ ] 5.6 Cart total calculates correctly

### ✅ Phase 6: Checkout Flow (20 min)
- [ ] 6.1 Checkout page loads with cart items
- [ ] 6.2 Customer info form works
- [ ] 6.3 Address form validation
- [ ] 6.4 Order summary shows correct prices
- [ ] 6.5 Razorpay payment modal opens
- [ ] 6.6 Test payment succeeds
- [ ] 6.7 Order created in database
- [ ] 6.8 Redirect to success page

### ✅ Phase 7: Order Emails (10 min)
- [ ] 7.1 Customer receives order confirmation email
- [ ] 7.2 Admin receives new order notification
- [ ] 7.3 Emails look good on mobile
- [ ] 7.4 All links in email work

### ✅ Phase 8: Admin Order Management (30 min)
- [ ] 8.1 New order appears in admin panel
- [ ] 8.2 Order details page shows all info
- [ ] 8.3 Status update: Pending → Confirmed
- [ ] 8.4 Status update: Confirmed → Sourcing
- [ ] 8.5 Select shop from dropdown
- [ ] 8.6 Status update: Sourcing → Processing
- [ ] 8.7 Status update: Processing → Quality Check
- [ ] 8.8 Status update: Quality Check → Packed
- [ ] 8.9 Add tracking number
- [ ] 8.10 Status update: Packed → Shipped
- [ ] 8.11 Customer receives status update emails
- [ ] 8.12 Status update: Shipped → Delivered

### ✅ Phase 9: Refund Flow (15 min)
- [ ] 9.1 Create test order
- [ ] 9.2 Admin clicks "Cannot Source"
- [ ] 9.3 Refund confirmation modal
- [ ] 9.4 Refund processed
- [ ] 9.5 Order status changed to "Refunded"
- [ ] 9.6 Customer receives refund email

### ✅ Phase 10: Customer Dashboard (10 min)
- [ ] 10.1 View all orders
- [ ] 10.2 View order details
- [ ] 10.3 Track order status
- [ ] 10.4 Cancel order (if allowed)

### ✅ Phase 11: Guest Order Tracking (5 min)
- [ ] 11.1 Track order page loads
- [ ] 11.2 Enter order ID and email
- [ ] 11.3 Order details displayed
- [ ] 11.4 Tracking info visible

### ✅ Phase 12: Admin Shop Management (15 min)
- [ ] 12.1 Shop management page loads
- [ ] 12.2 Add new shop
- [ ] 12.3 Edit shop details
- [ ] 12.4 View shop list
- [ ] 12.5 Shop appears in order workflow dropdown

### ✅ Phase 13: Mobile Responsiveness (10 min)
- [ ] 13.1 Homepage looks good on mobile
- [ ] 13.2 Shop page works on mobile
- [ ] 13.3 Product page responsive
- [ ] 13.4 Cart accessible on mobile
- [ ] 13.5 Checkout form works on mobile

### ✅ Phase 14: Error Handling (10 min)
- [ ] 14.1 Invalid login credentials show error
- [ ] 14.2 Empty cart checkout prevented
- [ ] 14.3 Failed payment handled gracefully
- [ ] 14.4 404 page works
- [ ] 14.5 API errors show user-friendly messages

---

## 📝 DETAILED TEST STEPS

### Phase 1: Database & Server Setup

**Commands to run:**
```bash
# 1. Generate Prisma client
npm run prisma:generate

# 2. Apply migrations
npm run prisma:migrate

# 3. Start dev server
npm run dev
```

**Expected Output:**
- ✅ No errors in terminal
- ✅ Server running on http://localhost:3000
- ✅ "Ready" message appears

---

### Phase 2: Frontend Pages

**Test Steps:**

1. **Homepage:** http://localhost:3000
   - Hero section loads
   - Featured products display
   - All images load
   - WhatsApp button works
   - Navigation works

2. **Shop Page:** http://localhost:3000/shop
   - All products display
   - Product cards show images, prices, sizes
   - "Add to Cart" buttons work
   - Stock status visible

3. **Product Page:** Click any product
   - Product images display
   - Size selection works
   - Price updates per size
   - Description shows
   - Reviews display

4. **About:** http://localhost:3000/about
   - Page loads correctly
   - Content displays

5. **Support:** http://localhost:3000/support
   - Contact form visible
   - Email/phone displayed

6. **Lookbook:** http://localhost:3000/lookbook
   - Coming soon page displays

---

### Phase 3: Customer Authentication

**Test Steps:**

1. **Register:** http://localhost:3000/register
   ```
   Name: Test Customer
   Email: test@example.com
   Password: TestPass123!
   ```
   - Form validation works
   - Registration succeeds
   - Redirects to /account

2. **Logout:**
   - Click logout
   - Redirects to homepage
   - Session cleared

3. **Login:** http://localhost:3000/login
   ```
   Email: test@example.com
   Password: TestPass123!
   ```
   - Login succeeds
   - Redirects to /account
   - Dashboard shows user name

4. **Protected Route:**
   - Logout
   - Try to access http://localhost:3000/account
   - Should redirect to /login?callbackUrl=/account
   - Login and verify redirect back to /account

---

### Phase 4: Admin Authentication

**Test Steps:**

1. **Admin Login:** http://localhost:3000/admin/login
   ```
   Email: [your-admin-email]
   Password: [your-admin-password]
   ```
   - Login succeeds
   - Redirects to /admin/dashboard

2. **Admin Pages:**
   - Dashboard: http://localhost:3000/admin/dashboard
   - Products: http://localhost:3000/admin/products
   - Categories: http://localhost:3000/admin/categories
   - Brands: http://localhost:3000/admin/brands
   - Orders: http://localhost:3000/admin/orders
   - Shops: http://localhost:3000/admin/shops
   - Inventory: http://localhost:3000/admin/inventory

3. **Admin Logout:**
   - Click logout button
   - Verify redirect to /admin/login
   - Try accessing /admin/dashboard
   - Should redirect back to login

---

### Phase 5: Shopping Cart

**Test Steps:**

1. **Add to Cart:**
   - Go to shop page
   - Select "RC Unisex Black Tiger" product
   - Select size: **M** (should show ₹499)
   - Click "Add to Cart"
   - Success message appears

2. **Verify Cart:**
   - Click cart icon (top right)
   - Cart drawer opens
   - Product shows: RC Unisex Black Tiger
   - Size shows: M
   - Price shows: ₹499 (NOT base price!)
   - Quantity: 1

3. **Update Quantity:**
   - Increase quantity to 2
   - Subtotal updates: ₹998
   - Decrease quantity to 1
   - Subtotal updates: ₹499

4. **Add Different Size:**
   - Go back to product
   - Select size: **L** (different price)
   - Add to cart
   - Cart now has 2 items
   - Each shows correct size-specific price

5. **Remove Item:**
   - Click remove on one item
   - Item removed from cart
   - Total recalculates

---

### Phase 6: Checkout Flow

**Test Steps:**

1. **Start Checkout:**
   - Have 1-2 items in cart
   - Click "Proceed to Checkout"
   - Redirects to /checkout

2. **Fill Customer Info:**
   ```
   Full Name: John Doe
   Email: john@example.com
   Phone: 9876543210
   
   Address: 123 Test Street
   City: Mumbai
   State: Maharashtra
   PIN: 400001
   ```

3. **Verify Order Summary:**
   - Items listed correctly
   - Prices match cart
   - Total calculated correctly

4. **Test Payment:**
   - Click "Proceed to Payment"
   - Razorpay modal opens
   - Use test card:
     ```
     Card: 4111 1111 1111 1111
     CVV: 123
     Expiry: Any future date
     ```
   - Click "Pay"

5. **Verify Success:**
   - Redirects to success page
   - Order ID displayed
   - Order details shown

---

### Phase 7: Order Emails

**Check your email inbox:**

1. **Customer Email:**
   - Subject: "Order Confirmed - 3Dark"
   - Order number visible
   - Items listed
   - Total amount shown
   - Tracking link works

2. **Admin Email:**
   - Subject: "New Order - 3Dark"
   - Order details visible
   - Customer info shown
   - Link to admin panel works

---

### Phase 8: Admin Order Management

**Test Steps:**

1. **View Orders:**
   - Go to http://localhost:3000/admin/orders
   - New order appears in list
   - Click on order

2. **Order Detail Page:**
   - Order information complete
   - Customer details visible
   - Items listed with sizes/prices
   - Timeline shows "Pending"

3. **Confirm Order:**
   - Click "Confirm Order" button
   - Status changes to "Confirmed"
   - Timeline updates
   - Check customer email for update

4. **Start Sourcing:**
   - Click "Start Sourcing" button
   - Status changes to "Sourcing"
   - Timeline updates

5. **Select Shop:**
   - Shop dropdown appears
   - Add a test shop first if empty:
     - Go to http://localhost:3000/admin/shops
     - Add shop: "Test Shop, Mumbai"
   - Back to order detail
   - Select shop from dropdown
   - Click "Mark as Processing"
   - Status changes to "Processing"

6. **Quality Check:**
   - Click "Mark as Quality Check"
   - Status changes to "Quality Check"

7. **Pack Order:**
   - Click "Mark as Packed"
   - Status changes to "Packed"

8. **Ship Order:**
   - Enter tracking number: "TEST123456789"
   - Click "Mark as Shipped"
   - Status changes to "Shipped"
   - Check customer email for tracking info

9. **Deliver:**
   - Click "Mark as Delivered"
   - Status changes to "Delivered"
   - Final email sent to customer

---

### Phase 9: Refund Flow

**Test Steps:**

1. **Create New Test Order:**
   - Place another test order
   - Go to admin order detail

2. **Cannot Source:**
   - On order detail page
   - Status should be "Confirmed" or "Sourcing"
   - Click "Cannot Source - Refund" button
   - Confirmation modal appears

3. **Process Refund:**
   - Click "Yes, Process Refund"
   - Status changes to "Refunded"
   - Check customer email
   - Refund email received

---

### Phase 10: Customer Dashboard

**Test Steps:**

1. **Login as Customer:**
   - http://localhost:3000/login
   - Use test@example.com

2. **View Dashboard:**
   - http://localhost:3000/account
   - All orders listed
   - Order statuses visible

3. **View Order Detail:**
   - Click "View Details" on any order
   - Order info displayed
   - Tracking info (if shipped)
   - Timeline visible

---

### Phase 11: Guest Order Tracking

**Test Steps:**

1. **Track Order Page:**
   - http://localhost:3000/track-order
   - Enter order ID (from email)
   - Enter email used for order
   - Click "Track Order"

2. **Verify:**
   - Order details displayed
   - Current status shown
   - Timeline visible
   - Tracking number (if shipped)

---

### Phase 12: Admin Shop Management

**Test Steps:**

1. **Shops Page:**
   - http://localhost:3000/admin/shops
   - If not logged in, redirects to login
   - After login, shows shops list

2. **Add Shop:**
   ```
   Name: Sadar Bazaar Traders
   Location: Sadar Bazaar, Delhi
   Address: Shop 45, Sadar Bazaar Market, Delhi 110006
   Contact: +91 9876543210
   WhatsApp: +91 9876543210
   Email: sadar.traders@gmail.com
   Owner: Rajesh Kumar
   Notes: Reliable for t-shirts
   ```
   - Click "Add Shop"
   - Shop appears in list

3. **Edit Shop:**
   - Click edit icon
   - Update details
   - Save changes
   - Verify updates

4. **Use in Order:**
   - Go back to an order in "Sourcing" status
   - New shop appears in dropdown
   - Select and verify

---

### Phase 13: Mobile Responsiveness

**Test on mobile or use Chrome DevTools:**

1. Open DevTools (F12)
2. Click mobile icon
3. Select "iPhone 12 Pro" or similar
4. Test all pages:
   - Navigation menu works
   - Images responsive
   - Forms usable
   - Buttons clickable
   - Cart accessible

---

### Phase 14: Error Handling

**Test Steps:**

1. **Invalid Login:**
   - Try logging in with wrong password
   - Error message displays
   - Form doesn't break

2. **Empty Cart Checkout:**
   - Clear cart
   - Try accessing /checkout directly
   - Should show "Cart is empty" or redirect

3. **Failed Payment:**
   - Use invalid card details in Razorpay test mode
   - Error handled gracefully
   - User can retry

4. **404 Page:**
   - http://localhost:3000/invalid-page
   - Custom 404 page or Next.js default

5. **API Errors:**
   - Check browser console for errors
   - No unhandled promise rejections
   - Network errors handled

---

## 🐛 ISSUES FOUND

Track any bugs found during testing:

### Issue 1: [Title]
**Severity:** High/Medium/Low  
**Description:**  
**Steps to Reproduce:**  
**Expected:**  
**Actual:**  
**Fix:**  

---

## ✅ TESTING COMPLETE

**Date Completed:** _______________  
**Tested By:** _______________  
**Status:** Pass / Fail  

**Summary:**
- Total Tests: 100+
- Passed: ___
- Failed: ___
- Blocked: ___

**Ready for Launch:** Yes / No

---

## 📋 LAUNCH BLOCKERS

Issues that MUST be fixed before launch:

1. [ ] None found / List issues

---

## 🎉 POST-TESTING

After all tests pass:

1. [ ] Document all found issues
2. [ ] Fix critical bugs
3. [ ] Re-test fixed issues
4. [ ] Update deployment docs
5. [ ] Prepare for production deploy
