# Development Workflow Guide - Local vs Production

**Date:** December 15, 2025  
**Status:** Best Practices

---

## 🎯 THE BEST APPROACH

You should maintain **separate environments** for development and production. Here's the recommended workflow:

---

## 📊 TWO ENVIRONMENTS EXPLAINED

### 🔧 LOCAL DEVELOPMENT (What we just set up)
**Purpose:** Testing, debugging, and building new features

```
Database:     SQLite (local file)
URL:          http://localhost:3000
Environment:  .env
Data:         Test/dummy data
Purpose:      Development & testing
Safety:       Can break things safely
```

### 🚀 PRODUCTION (Your live site)
**Purpose:** Real customers, real orders, real money

```
Database:     PostgreSQL (Vercel/Prisma)
URL:          https://3dark.in
Environment:  Vercel environment variables
Data:         Real products, orders, customers
Purpose:      Live e-commerce
Safety:       Must be stable and reliable
```

---

## ✅ RECOMMENDED WORKFLOW

### 1. **Develop & Test Locally** (Current Setup)

```bash
# Work on your local machine
cd /Users/adityarajak/Downloads/3dark-web

# Use SQLite database
# Edit code, test features, fix bugs
npm run dev

# Test everything thoroughly:
- Add products
- Test cart
- Complete checkout
- Test admin panel
- Fix any bugs
```

**Benefits:**
- ✅ Fast iteration
- ✅ No internet required
- ✅ Can't break production
- ✅ Free to experiment
- ✅ Test with dummy data

---

### 2. **Commit to Git**

```bash
# Once feature works locally
git add .
git commit -m "Add new feature: [description]"
git push origin main
```

---

### 3. **Deploy to Production**

```bash
# Vercel automatically deploys when you push to GitHub
# Or manually deploy:
vercel deploy --prod
```

**What happens:**
- ✅ Code pushed to GitHub
- ✅ Vercel detects changes
- ✅ Builds and deploys automatically
- ✅ Uses PostgreSQL database
- ✅ Uses production environment variables
- ✅ Live at https://3dark.in

---

## 🔄 COMPLETE DEVELOPMENT CYCLE

```
┌─────────────────────────────────────────────────────┐
│  1. DEVELOP LOCALLY (SQLite)                        │
│     - Write code                                     │
│     - Test features                                  │
│     - Fix bugs                                       │
│     - Add products (test data)                       │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  2. COMMIT TO GIT                                    │
│     git add .                                        │
│     git commit -m "Description"                      │
│     git push origin main                             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  3. VERCEL AUTO-DEPLOYS (PostgreSQL)                │
│     - Builds project                                 │
│     - Uses production database                       │
│     - Deploys to 3dark.in                            │
└─────────────────────────────────────────────────────┘
```

---

## 🗂️ DATABASE STRATEGY

### LOCAL (SQLite):
```
File:     prisma/dev.db
Size:     Small (~100KB)
Purpose:  Testing
Data:     Test products, fake orders
Reset:    Can delete and recreate anytime
```

### PRODUCTION (PostgreSQL):
```
Provider: Vercel Postgres / Prisma Cloud
Size:     Large (grows with real data)
Purpose:  Real business data
Data:     Real products, real orders, real customers
Reset:    NEVER! This is your real business data
```

---

## ⚙️ ENVIRONMENT CONFIGURATION

### Local Development (.env):
```bash
# Local SQLite database
DATABASE_URL="file:./prisma/dev.db"

# Local URLs
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Same keys for testing (Razorpay test keys, etc.)
RAZORPAY_KEY_ID="your_test_key"
RAZORPAY_KEY_SECRET="your_test_secret"
```

### Production (Vercel Environment Variables):
```bash
# Production PostgreSQL database
DATABASE_URL="postgres://..."

# Production URLs
NEXTAUTH_URL="https://3dark.in"
NEXT_PUBLIC_SITE_URL="https://3dark.in"

# Real Razorpay keys
RAZORPAY_KEY_ID="your_live_key"
RAZORPAY_KEY_SECRET="your_live_secret"
```

---

## 🔧 MANAGING TWO DATABASES

### Problem:
You have different data in local vs production. How to keep them in sync?

### Solution:

#### Option 1: Keep them SEPARATE (Recommended)
```
LOCAL:       Test data, dummy products
PRODUCTION:  Real products, real orders
```

**Workflow:**
1. Add/edit products in **production** admin panel
2. Test new features in **local** with dummy data
3. Deploy features to production when ready

---

#### Option 2: Pull Production Data to Local (Advanced)
If you need to test with real product data locally:

```bash
# 1. Export production database
# (In Vercel dashboard, get database URL)

# 2. Create a backup
pg_dump [production-db-url] > backup.sql

# 3. Import to local (requires PostgreSQL locally)
# Not recommended for SQLite - data structure is different
```

**Better approach:** Keep SQLite for local, add a few test products manually.

---

## 📝 BEST PRACTICES

### ✅ DO:
1. **Develop locally** with SQLite and test data
2. **Test thoroughly** before pushing to GitHub
3. **Use Git branches** for major features:
   ```bash
   git checkout -b feature/new-payment-system
   # Make changes
   git push origin feature/new-payment-system
   # Merge after testing
   ```
4. **Keep `.env` local** - never commit it to Git
5. **Use environment variables** for sensitive data
6. **Test in production** after deployment (quick smoke test)

### ❌ DON'T:
1. ❌ Don't edit production database directly
2. ❌ Don't commit `.env` or `.env.local` to Git
3. ❌ Don't test with real payment keys locally
4. ❌ Don't delete production database
5. ❌ Don't push untested code to production

---

## 🛠️ PRACTICAL WORKFLOW EXAMPLE

### Scenario: You want to add a new feature (e.g., Product Filters)

#### Step 1: Develop Locally
```bash
# 1. Create a feature branch
git checkout -b feature/product-filters

# 2. Start dev server
npm run dev

# 3. Build the feature
# - Edit components/ProductFilters.tsx
# - Test with local SQLite database
# - Test filtering works

# 4. Test thoroughly
# - All products display
# - Filters work correctly
# - Mobile responsive
# - No errors in console
```

#### Step 2: Commit & Push
```bash
# Once feature works perfectly
git add .
git commit -m "Add product filters to shop page"
git push origin feature/product-filters

# Optional: Create Pull Request on GitHub
# Review changes, then merge to main
```

#### Step 3: Deploy
```bash
# Option A: Merge to main (auto-deploys)
git checkout main
git merge feature/product-filters
git push origin main

# Option B: Manual deploy
vercel deploy --prod
```

#### Step 4: Verify Production
```bash
# 1. Visit https://3dark.in
# 2. Test the new feature
# 3. Check it works with real products
# 4. Monitor for errors
```

---

## 🔄 SCHEMA CHANGES (IMPORTANT!)

When you change the database schema (add fields, new tables):

### Local:
```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_new_field

# 3. Test thoroughly
```

### Production:
```bash
# 1. Push code to GitHub (includes new migration)
# 2. Vercel automatically runs migrations
# 3. OR manually:
npx prisma migrate deploy

# 4. Verify migration succeeded in Vercel logs
```

**⚠️ WARNING:** Schema changes affect production data. Test thoroughly locally first!

---

## 🎯 YOUR CURRENT SITUATION

### What You Have Now:

#### LOCAL (Current):
```
✅ SQLite database
✅ 3 test products
✅ 1 admin user (admin@3dark.com)
✅ Working dev server
✅ Can test everything safely
```

#### PRODUCTION (3dark.in):
```
✅ PostgreSQL database
✅ Real products (~35)
✅ Real admin user
✅ Live and taking orders
✅ Using Vercel environment variables
```

---

## 💡 RECOMMENDED APPROACH FOR YOU

### For Daily Development:

1. **Work Locally:**
   ```bash
   # Start dev server
   npm run dev
   
   # Test features with SQLite
   # Add 3-5 test products
   # Test cart, checkout, admin panel
   ```

2. **When Feature is Ready:**
   ```bash
   # Commit and push
   git add .
   git commit -m "Feature description"
   git push origin main
   
   # Vercel auto-deploys
   # Check https://3dark.in
   ```

3. **Manage Products:**
   - Add/edit real products in **production** admin panel
   - Test new features in **local** with dummy products
   - Don't worry about syncing product data

---

## 🚨 WHEN TO SWITCH BACK TO POSTGRESQL LOCALLY

You might want to use PostgreSQL locally if:

1. You need to test with real production data
2. SQLite limitations (no certain features)
3. Need exact parity with production

**How to switch back:**
```bash
# 1. Update prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 2. Update .env
DATABASE_URL="postgresql://localhost:5432/3dark_dev"

# 3. Install PostgreSQL locally
brew install postgresql  # macOS
# Or download from postgresql.org

# 4. Create local database
createdb 3dark_dev

# 5. Run migrations
npx prisma migrate dev

# 6. Seed with test data
```

**But for now, SQLite is perfect for testing!**

---

## 📋 CHECKLIST FOR SAFE DEVELOPMENT

- [ ] Local uses SQLite (test data)
- [ ] Production uses PostgreSQL (real data)
- [ ] `.env` is in `.gitignore` (not committed)
- [ ] Test thoroughly locally before pushing
- [ ] Use Git branches for major features
- [ ] Monitor Vercel deployments
- [ ] Keep production admin credentials secure
- [ ] Never test with real payment keys locally

---

## 🎊 SUMMARY - YOUR WORKFLOW

```
┌─────────────────────────────────────┐
│   LOCAL DEVELOPMENT (SQLite)        │
│   - Test new features               │
│   - Fix bugs                        │
│   - Dummy data                      │
│   - Fast iteration                  │
└───────────┬─────────────────────────┘
            │
            │ git push
            ▼
┌─────────────────────────────────────┐
│   GITHUB REPOSITORY                 │
│   - Version control                 │
│   - Code backup                     │
│   - Collaboration                   │
└───────────┬─────────────────────────┘
            │
            │ Auto deploy
            ▼
┌─────────────────────────────────────┐
│   PRODUCTION (PostgreSQL)           │
│   - Live site: 3dark.in             │
│   - Real products                   │
│   - Real orders                     │
│   - Real customers                  │
└─────────────────────────────────────┘
```

---

## ❓ QUESTIONS?

If you have specific scenarios in mind, let me know and I can provide detailed guidance!

**Common questions:**
- How to add products to production?
- How to test checkout without real payments?
- How to rollback if deployment breaks?
- How to backup production database?

Let me know what you need! 🚀
