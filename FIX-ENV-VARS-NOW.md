# 🔧 Fix Database Environment Variables

## The Problem:
You have multiple DATABASE_URL variables with wrong values:
- ❌ `DATABASE_URL` (Preview) = `db.prisma.io` (WRONG - dummy database)
- ❌ `DATABASE_URL` (Production) = `db.prisma.io` (WRONG - dummy database)
- ✅ `POSTGRES_URL` (All Environments) = Real Vercel Postgres (CORRECT!)

## The Fix:

### Step 1: Delete Wrong DATABASE_URL Variables

1. Go to: Settings → Environment Variables
2. Find: `DATABASE_URL` (Preview) - the one with `db.prisma.io`
   - Click "..." menu
   - Click "Delete"
3. Find: `DATABASE_URL` (Production) - the one with `db.prisma.io`
   - Click "..." menu
   - Click "Delete"

### Step 2: Create Correct DATABASE_URL

You have two options:

**Option A: Copy from POSTGRES_URL (Easiest)**
1. Click on `POSTGRES_URL` (the one from Prisma Postgres)
2. Click "Reveal" to see the value
3. Copy the entire connection string
4. Click "Add New" environment variable
5. Name: `DATABASE_URL`
6. Value: Paste the connection string from POSTGRES_URL
7. Environments: Production, Preview, Development (all three)
8. Save

**Option B: Use POSTGRES_URL directly in code**
Update your `lib/db.ts` to use `POSTGRES_URL` instead of `DATABASE_URL`

## Step 3: Redeploy
After fixing the env vars, redeploy:
```bash
git commit --allow-empty -m "Trigger redeploy with correct database"
git push
```

---

## Quick Reference:

**Delete these:**
- ❌ DATABASE_URL (Preview) - db.prisma.io
- ❌ DATABASE_URL (Production) - db.prisma.io

**Keep these:**
- ✅ POSTGRES_URL (All Environments)
- ✅ POSTGRES_URL_PRISMA_DATABASE_URL
- ✅ POSTGRES_URL_DATABASE_URL

**Add this:**
- ✅ DATABASE_URL (All Environments) = copy value from POSTGRES_URL

---

Ready? Let's do it! 🚀
