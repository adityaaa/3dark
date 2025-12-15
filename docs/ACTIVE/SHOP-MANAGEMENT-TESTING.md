# Shop Management Testing Guide

**Date:** December 15, 2025  
**Feature:** Admin Shop Management UI  
**URL:** http://localhost:3000/admin/shops

---

## 🎯 PURPOSE

This page allows you to manage local shops where you source products for on-demand fulfillment.

---

## ✅ HOW TO TEST

### 1. **Add a New Shop**

Fill in the form at the top with shop details:

**Example Shop 1:**
```
Shop Name: Sadar Bazaar Traders
Location: Sadar Bazaar, Delhi
Address: Shop 45, Sadar Bazaar Market, Delhi 110006
Contact: +91 9876543210
WhatsApp: +91 9876543210
Email: sadar.traders@gmail.com
Owner Name: Rajesh Kumar
Notes: Reliable supplier for t-shirts and caps. Good pricing.
```

Click **"Add Shop"** button.

**Expected Result:**
- ✅ Success message appears
- ✅ Shop appears in the list below
- ✅ Form clears for next entry

---

**Example Shop 2:**
```
Shop Name: Chandni Chowk Apparel
Location: Chandni Chowk, Delhi
Address: 23-B, Chandni Chowk, Old Delhi 110006
Contact: +91 9988776655
WhatsApp: +91 9988776655
Email: chandni.apparel@gmail.com
Owner Name: Amit Sharma
Notes: Specializes in kids clothing. Fast delivery.
```

---

**Example Shop 3:**
```
Shop Name: Karol Bagh Fashion
Location: Karol Bagh, Delhi
Address: 78, Ajmal Khan Road, Karol Bagh, Delhi 110005
Contact: +91 9123456789
WhatsApp: +91 9123456789
Email: karolbagh.fashion@gmail.com
Owner Name: Priya Singh
Notes: Best for adult t-shirts and shorts. Wholesale rates.
```

---

### 2. **View Shop List**

After adding shops, scroll down to see the list.

**What to Check:**
- [ ] All shops you added are visible
- [ ] Shop details display correctly
- [ ] Active status shows as "Active" (green badge)
- [ ] Contact information is correct

---

### 3. **Edit a Shop** (Feature to be added)

Currently not implemented, but will allow:
- Clicking "Edit" button on a shop
- Modifying shop details
- Saving changes

---

### 4. **Toggle Shop Active Status** (Feature to be added)

Currently not implemented, but will allow:
- Marking shop as inactive (if temporarily closed)
- Hiding inactive shops from sourcing

---

## 🔍 VERIFICATION STEPS

### Check Database:

After adding shops, verify in database:

```sql
SELECT * FROM "Shop" ORDER BY createdAt DESC LIMIT 5;
```

**Expected Result:**
- ✅ All shops saved with correct data
- ✅ `isActive` = true by default
- ✅ Timestamps are correct
- ✅ All fields populated

---

### Check in Admin Order Workflow:

Later, when you go to an order detail page:
- [ ] Shop dropdown should list all active shops
- [ ] Admin can select which shop to source from
- [ ] Order gets linked to selected shop

---

## 🐛 COMMON ISSUES

### "Failed to add shop" error:
- **Cause:** Network error or API issue
- **Check:** Browser console for error details
- **Fix:** Verify API is running, check logs

### Shop doesn't appear in list:
- **Cause:** List not refreshing
- **Fix:** Reload page (we'll add auto-refresh later)

### Form doesn't clear after submit:
- **Cause:** JavaScript error
- **Check:** Browser console
- **Fix:** Already handled in code

---

## 📝 FIELDS EXPLAINED

| Field | Required | Description |
|-------|----------|-------------|
| **Shop Name** | Yes | Business name of the shop |
| **Location** | Yes | Area/market name (e.g., "Sadar Bazaar") |
| **Address** | No | Full street address |
| **Contact** | Yes | Phone number for orders |
| **WhatsApp** | No | WhatsApp number (can be same as contact) |
| **Email** | No | Email for communication |
| **Owner Name** | No | Shop owner's name |
| **Notes** | No | Internal notes (product specialties, pricing, reliability) |

---

## 🎯 SUCCESS CRITERIA

After testing, you should have:
- [ ] 3-5 shops added to system
- [ ] All shops visible in list
- [ ] All data correct in database
- [ ] No console errors
- [ ] Ready to use in order workflow

---

## 🚀 NEXT STEPS

After Shop Management is working:

1. **Link to Order Workflow**
   - Go to `/admin/orders/[id]` page
   - Should see shop dropdown
   - Can assign order to shop

2. **Add Edit Functionality**
   - Edit shop details
   - Update contact info
   - Modify notes

3. **Add Shop Performance**
   - Track orders per shop
   - Monitor success rate
   - View shop statistics

---

## 💡 PRO TIPS

### Organizing Your Shops:

**By Specialty:**
- Kids clothing shops
- Adult apparel shops
- Accessories/caps shops

**By Location:**
- Sadar Bazaar shops
- Chandni Chowk shops
- Karol Bagh shops

**By Reliability:**
- Primary suppliers (always available)
- Backup suppliers (use when primary is out)
- Emergency suppliers (last resort)

### Using Notes Field:

```
Notes examples:
- "Specializes in Radhey Collection. Has 50+ designs in stock."
- "Fast turnaround - can deliver within 24 hours."
- "Wholesale pricing: 20% cheaper than others."
- "Closed on Tuesdays. Don't source from here on Mondays."
- "Great for urgent orders. Available via WhatsApp 24/7."
```

---

## 🔗 RELATED DOCUMENTATION

- `/docs/ACTIVE/IMPLEMENTATION-PLAN-PHASE-1.md` - Overall plan
- `/docs/ACTIVE/ON-DEMAND-RELIABILITY-STRATEGY.md` - Sourcing strategy
- `/docs/ACTIVE/PHASE-1-PROGRESS.md` - Progress tracking

---

**Testing Status:** Ready to test ✅  
**Time Required:** 10-15 minutes  
**Next Feature:** Link shops to order workflow

---

*Test this now and let me know if you encounter any issues!*
