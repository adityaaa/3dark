# 🚀 MIGRATION GUIDE - Apply Product Categories to Production

## ⚠️ IMPORTANT - Read Before Starting

This migration will:
- Add `category` and `ageGroup` columns to the Product table
- Create a new `Brand` table
- Restructure the `BrandPricing` table

**Existing products will automatically get:**
- `category = "tshirt"`
- `ageGroup = "adult"`

**You will need to manually update products after migration.**

---

## Step 1: Backup Database ✅

Before running the migration, create a backup of your production database:

```bash
# From Vercel dashboard:
# Go to Storage > Your Postgres DB > Settings > Backups
# Or use pg_dump if you have direct access
```

---

## Step 2: Run Migration Script 🔧

**Via Vercel CLI (Recommended):**

```bash
# Make sure you're on main branch
git checkout main

# Pull latest changes
git pull origin main

# Run the migration script on production
vercel env pull .env.production.local
npx tsx scripts/apply-category-migration.ts
```

**Or via SSH/Direct Database Access:**

```bash
# Connect to production database
# Run the migration script
npx tsx scripts/apply-category-migration.ts
```

---

## Step 3: Verify Migration ✅

After running the migration, verify:

```bash
# Check if new columns exist
psql $DATABASE_URL -c "SELECT id, name, brand, category, ageGroup FROM \"Product\" LIMIT 5;"

# Check if Brand table exists
psql $DATABASE_URL -c "SELECT * FROM \"Brand\";"

# Check BrandPricing structure
psql $DATABASE_URL -c "SELECT * FROM \"BrandPricing\";"
```

**Expected Results:**
- All products should have `category = 'tshirt'` and `ageGroup = 'adult'`
- Brand table should contain: "Caballo", "Rock Chang" (your existing brands)
- BrandPricing should have `category` and `ageGroup` columns

---

## Step 4: Regenerate Prisma Client 🔄

```bash
npx prisma generate
```

---

## Step 5: What Next? 📋

After migration is complete:

1. **Code is NOT deployed yet** - The feature branch has updated code
2. **Existing site continues to work** - Old code works with new database structure
3. **Manual product updates needed** - You'll need to set correct categories for existing products

---

## Next Session Tasks

In our next session, we'll:
1. ✅ Verify migration succeeded
2. 🔧 Complete the admin UI updates (ProductForm, BrandPricingForm)
3. 🔧 Update API routes
4. 🔧 Update frontend pages
5. 🧪 Test thoroughly
6. 🚀 Deploy to production

---

## Rollback Plan (If Something Goes Wrong)

If migration fails:

```bash
# Restore from backup
# Or manually drop new columns:
psql $DATABASE_URL -c "ALTER TABLE \"Product\" DROP COLUMN IF EXISTS category;"
psql $DATABASE_URL -c "ALTER TABLE \"Product\" DROP COLUMN IF EXISTS ageGroup;"
psql $DATABASE_URL -c "DROP TABLE IF EXISTS \"Brand\";"
# Restore old BrandPricing structure from backup
```

---

## Questions Before Running?

- Do you have database backups enabled?
- Do you have direct database access or using Vercel CLI?
- Ready to proceed?

