# 🚀 Quick Start Guide - Fix Admin Login & Empty Shop

## Problem
1. ❌ Cannot login as admin
2. ❌ No data showing in shop

## Solution - One Command Setup

Run this single command to fix both issues:

```bash
npx tsx scripts/initial-setup.ts
```

This will:
- ✅ Create admin account with credentials
- ✅ Seed all products from `/public/products/` directory
- ✅ Set up proper categories, pricing, and galleries

## Default Admin Credentials

After running the setup:
- **Email:** `admin@3dark.com`
- **Password:** `Admin@3dark2024`
- **Login URL:** `http://localhost:3000/admin`

⚠️ **IMPORTANT:** Change the password after first login!

## Custom Admin Credentials

To use custom credentials, run:

```bash
ADMIN_EMAIL="your@email.com" ADMIN_PASSWORD="YourSecurePassword" npx tsx scripts/initial-setup.ts
```

## Step-by-Step Instructions

### 1. Run Initial Setup
```bash
cd /Users/adityarajak/Downloads/3dark-web
npx tsx scripts/initial-setup.ts
```

Expected output:
```
🚀 Starting Initial Setup for 3dark.in
==================================================

🔐 Setting up Admin Account...
✅ Admin user created successfully!
   Email: admin@3dark.com
   Password: Admin@3dark2024

🌱 Seeding Products...
Found 36 product images
Grouped into X unique products

✅ Tiger Shorts (shorts, adult)
✅ Leopard Hat (beanie-hat, adult)
...
✅ Successfully seeded X products!
```

### 2. Seed Fake Reviews (Optional but Recommended)
```bash
npx tsx scripts/seed-fake-reviews.ts
```

This adds 2-5 fake reviews per product for social proof.

### 3. Login & Test
- Go to `http://localhost:3000/admin`
- Login with `admin@3dark.com` / `Admin@3dark2024`
- Visit `http://localhost:3000/shop` to see products

## Troubleshooting

### Admin Already Exists
If you see "Admin already exists", your admin account is already created. To reset password:

```bash
NEW_PASSWORD="YourNewPassword" npx tsx scripts/update-admin-password.ts
```

### No Products Found
Make sure you have product images in `/public/products/` directory. The script expects files like:
- `Caballo-adult-Tiger-Shorts-A-0321-1.jpg`
- `RC-unisex-black-tiger-GR-693-1.png`

### Cannot Login After Setup
1. Verify admin exists:
   ```bash
   npx prisma studio
   ```
   Check the `Admin` table.

2. Try creating admin manually:
   ```bash
   ADMIN_EMAIL="admin@3dark.com" ADMIN_PASSWORD="Admin@3dark2024" npx tsx scripts/create-admin.ts
   ```

3. Check if you're using the correct login page:
   - Admin: `/admin` (not `/login`)
   - Customer: `/login`

### Products Not Showing
1. Check database:
   ```bash
   npx prisma studio
   ```
   Look at `Product` table.

2. Verify image paths in database match files in `/public/products/`

3. Check console for errors on shop page

## Production Deployment

After local setup works, deploy to Vercel:

```bash
# Commit changes
git add .
git commit -m "Add initial setup script and seed data"
git push origin main

# Run setup on production (via Vercel CLI or SSH)
# Make sure to set DATABASE_URL to production database
npx tsx scripts/initial-setup.ts
```

## Manual Commands (Alternative to initial-setup.ts)

If you prefer to run steps individually:

### Create Admin
```bash
ADMIN_EMAIL="admin@3dark.com" ADMIN_PASSWORD="Admin@3dark2024" npx tsx scripts/create-admin.ts
```

### Seed Products
```bash
# Use the archived seed script or create products via admin panel
npx tsx scripts/archive/seed-products.ts
```

### Update Admin Password
```bash
NEW_PASSWORD="YourNewPassword" npx tsx scripts/update-admin-password.ts
```

## Next Steps After Setup

1. **Change Admin Password**
   - Login to admin panel
   - Go to settings (if available) or use update-admin-password script

2. **Add/Edit Products**
   - Use admin panel at `/admin/products` to manage products
   - Upload additional images
   - Update descriptions and pricing

3. **Configure Brand Pricing**
   - Set up category and age-specific pricing at `/admin/brand-pricing`

4. **Test Customer Flow**
   - Create test customer account at `/register`
   - Add products to cart
   - Complete checkout
   - Track order

5. **Add Reviews**
   - Seed fake reviews: `npx tsx scripts/seed-fake-reviews.ts`
   - Real customer reviews will appear after delivery

## Support

If issues persist:
1. Check `dev.db` or production database with Prisma Studio
2. Review logs in terminal/console
3. Verify environment variables in `.env` and Vercel
4. Check DEPLOYMENT-STATUS.md for production issues

---

**Last Updated:** December 2024
**Status:** Ready to Deploy 🚀
