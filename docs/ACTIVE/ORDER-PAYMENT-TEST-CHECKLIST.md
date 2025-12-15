# Order & Payment Testing Checklist

**Date:** December 14, 2025  
**Status:** Testing in Progress 🧪

---

## 🎯 TESTING OBJECTIVES

1. Verify payment flow works end-to-end
2. Ensure orders are created in database correctly
3. Confirm email notifications are sent
4. Check admin panel displays orders properly

---

## ✅ TEST SCENARIOS

### Test 1: Guest Checkout with Razorpay (Online Payment)

**Steps:**
1. [ ] Browse to `/shop` page
2. [ ] Select a product (e.g., "RC-unisex-black-tiger")
3. [ ] Choose a size
4. [ ] Add to cart
5. [ ] View cart
6. [ ] Click "Proceed to Checkout"
7. [ ] Fill in customer details:
   - Name: Test Customer 1
   - Email: test1@example.com
   - Phone: 9999999999
   - Address: Test Address 123
   - City: Delhi
   - State: Delhi
   - Pincode: 110001
8. [ ] Select payment method: Online Payment (Razorpay)
9. [ ] Click "Place Order"
10. [ ] Complete Razorpay payment (use test mode)

**Expected Results:**
- [ ] Razorpay popup opens
- [ ] Payment can be completed (test mode)
- [ ] Order confirmation page shows
- [ ] Order number is displayed
- [ ] Confirmation email sent to test1@example.com

**Database Verification:**
- [ ] Order exists in `Order` table
- [ ] Order status: `pending_payment` or `confirmed`
- [ ] Order items exist in `OrderItem` table
- [ ] All customer details saved correctly

---

### Test 2: Guest Checkout with COD

**Steps:**
1. [ ] Browse to `/shop` page
2. [ ] Select a different product
3. [ ] Add to cart
4. [ ] Proceed to checkout
5. [ ] Fill in customer details:
   - Name: Test Customer 2
   - Email: test2@example.com
   - Phone: 8888888888
   - Address: Test Address 456
   - City: Mumbai
   - State: Maharashtra
   - Pincode: 400001
6. [ ] Select payment method: Cash on Delivery
7. [ ] Click "Place Order"

**Expected Results:**
- [ ] Order confirmation page shows immediately
- [ ] Order number is displayed
- [ ] COD confirmation message shown
- [ ] Confirmation email sent to test2@example.com

**Database Verification:**
- [ ] Order exists with paymentMethod: "cod"
- [ ] Order status: `pending` or `confirmed`
- [ ] Payment status: `pending`

---

### Test 3: Logged-in Customer Checkout

**Steps:**
1. [ ] Create customer account or login
   - Go to `/register`
   - Register with: test3@example.com
   - Or login to existing account
2. [ ] Browse shop and add product to cart
3. [ ] Proceed to checkout
4. [ ] Verify customer details auto-filled
5. [ ] Place order

**Expected Results:**
- [ ] Order linked to customer account
- [ ] Order visible in customer dashboard (`/account`)
- [ ] Customer details pre-filled in checkout
- [ ] Email sent to logged-in email

**Database Verification:**
- [ ] Order has `customerId` field populated
- [ ] Relationship between Order and Customer correct

---

## 📧 EMAIL VERIFICATION

### Check Email Content:
- [ ] Order confirmation email received
- [ ] Email has correct order number
- [ ] Email lists all ordered items
- [ ] Email shows correct prices
- [ ] Email has delivery timeline (2-3 days + shipping)
- [ ] Email has customer support contact
- [ ] Email is mobile-friendly

### Email Address to Check:
- Test emails should go to the addresses used in checkout
- Admin notification should go to your admin email

---

## 🔧 ADMIN PANEL VERIFICATION

**Steps:**
1. [ ] Open admin panel: http://localhost:3001/admin/login
2. [ ] Login with admin credentials
3. [ ] Navigate to Orders section
4. [ ] Find the test orders

**Expected Results:**
- [ ] All 3 test orders visible in list
- [ ] Order details are correct
- [ ] Customer information displayed
- [ ] Order items listed correctly
- [ ] Payment status shown correctly
- [ ] Can click into order detail page

---

## 🐛 COMMON ISSUES TO WATCH FOR

### Payment Issues:
- [ ] Razorpay popup doesn't open → Check RAZORPAY_KEY_ID in env
- [ ] Payment fails → Check RAZORPAY_KEY_SECRET
- [ ] Amount is wrong → Check calculation in checkout API

### Email Issues:
- [ ] Email not received → Check RESEND_API_KEY
- [ ] Email from wrong address → Check EMAIL_FROM variable
- [ ] Email content broken → Check email template

### Database Issues:
- [ ] Order not created → Check console logs for errors
- [ ] Missing items → Check items array in POST request
- [ ] Wrong customer → Check customerId linking

### UI Issues:
- [ ] Cart doesn't update → Check CartContext
- [ ] Checkout form errors → Check validation
- [ ] Redirect fails → Check success page routing

---

## 📝 TEST RESULTS LOG

### Test 1 - Guest + Razorpay:
```
Status: [ ] Pass / [ ] Fail
Order Number: _______________
Issues Found: ________________
```

### Test 2 - Guest + COD:
```
Status: [ ] Pass / [ ] Fail
Order Number: _______________
Issues Found: ________________
```

### Test 3 - Logged-in Customer:
```
Status: [ ] Pass / [ ] Fail
Order Number: _______________
Issues Found: ________________
```

---

## 🔍 DATABASE QUERIES TO RUN

After testing, run these to verify data:

```sql
-- Check orders created
SELECT id, orderNumber, customerName, customerEmail, 
       orderStatus, paymentStatus, paymentMethod, total, createdAt
FROM "Order"
WHERE customerEmail LIKE 'test%@example.com'
ORDER BY createdAt DESC;

-- Check order items
SELECT oi.*, p.name as productName
FROM "OrderItem" oi
JOIN "Product" p ON oi.productId = p.id
WHERE oi.orderId IN (
  SELECT id FROM "Order" 
  WHERE customerEmail LIKE 'test%@example.com'
);

-- Check customer linking
SELECT o.orderNumber, o.customerName, c.email, c.name
FROM "Order" o
LEFT JOIN "Customer" c ON o.customerId = c.id
WHERE o.customerEmail LIKE 'test%@example.com';
```

---

## ✅ SUCCESS CRITERIA

All tests pass if:
- [ ] All 3 orders created successfully
- [ ] All orders visible in admin panel
- [ ] All confirmation emails sent
- [ ] No console errors during checkout
- [ ] Payment integration works (test mode)
- [ ] Database entries are correct
- [ ] Logged-in customer orders linked properly

---

## 🚀 NEXT STEPS AFTER TESTING

If all tests pass:
- [ ] Update DAY-1-PROGRESS.md with results
- [ ] Move to Email System Verification
- [ ] Document any minor issues for later

If tests fail:
- [ ] Document exact error messages
- [ ] Check console logs
- [ ] Debug and fix issues
- [ ] Re-test until all pass

---

**URLs for Testing:**
- Homepage: http://localhost:3001
- Shop: http://localhost:3001/shop
- Register: http://localhost:3001/register
- Login: http://localhost:3001/login
- Admin: http://localhost:3001/admin/login

**Test Mode:**
- Razorpay: Use test mode in dashboard
- Emails: Will send to real addresses (or use test API)

---

*Start Time: _______*  
*End Time: _______*  
*Duration: _______*  
*Result: [ ] All Pass [ ] Some Fail [ ] Blocked*
