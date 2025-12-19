# Archived Migration Scripts

This folder contains migration scripts that have already been run in production and are kept for historical reference only.

## ⚠️ DO NOT RUN THESE SCRIPTS

These scripts have already been executed in the production database. Running them again could cause data corruption or errors.

---

## Scripts in Archive

### 1. `seed-products.ts`
**Purpose:** Initial product seeding with sample data  
**Status:** ✅ Already run in production  
**Date:** November-December 2024  

### 2. `fix-image-paths.ts`
**Purpose:** Migration to update old filesystem image paths to Vercel Blob URLs  
**Status:** ✅ Already run in production  
**Date:** December 2024  

### 3. `apply-category-migration.ts`
**Purpose:** Database migration to add product categories, age groups, and brand management  
**Status:** ✅ Already run in production  
**Date:** December 2024  

---

## Active Scripts

Scripts that are still actively used can be found in the `/scripts` directory:

- `create-admin.ts` - Create new admin users (can be run as needed)

---

## Migration History

1. **Initial Setup** (Nov 2024)
   - SQLite database setup
   - Basic product schema
   - Initial product seeding

2. **PostgreSQL Migration** (Nov 2024)
   - Migrated from SQLite to Vercel Postgres
   - Re-ran initial migrations

3. **Image Storage Migration** (Dec 2024)
   - Migrated from filesystem to Vercel Blob
   - Updated all product image paths

4. **Category & Brand System** (Dec 2024)
   - Added product categories (tshirt, shorts, pants, beanie-hat)
   - Added age groups (adult, kids)
   - Added Brand table and brand-level pricing
   - Updated all products with category/ageGroup data

---

## Recovery Information

If you need to recreate the database from scratch:

1. Run Prisma migrations: `npx prisma migrate deploy`
2. Generate Prisma client: `npx prisma generate`
3. Create admin user: `npx tsx scripts/create-admin.ts`
4. Manually re-add products through the admin panel or create a new seed script

**Note:** Product images are stored in Vercel Blob and will not be affected by database recreation.
