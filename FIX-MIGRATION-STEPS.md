# Fix Customer Model Migration - Manual Steps

## Problem
The Customer model migration failed during deployment and needs to be resolved.

## Solution

### Step 1: Set DATABASE_URL (if not already set)
```bash
export DATABASE_URL="postgres://8e955f9686ef1d52dadc2de570d4372042ed307af3c46cf23b8fdb5c1a259f60:sk_ZwTqtvKFAgsx9ma3MPTEl@db.prisma.io:5432/postgres?sslmode=require"
```

### Step 2: Mark the failed migration as rolled back
```bash
npx prisma migrate resolve --rolled-back "20251207142229_add_customer_model"
```

### Step 3: Try deploying migrations again
```bash
npx prisma migrate deploy
```

### Step 4: If Step 3 shows "No pending migrations", manually apply the migration
```bash
# Mark it as applied (since the table might already exist partially)
npx prisma migrate resolve --applied "20251207142229_add_customer_model"
```

### Step 5: Verify migration status
```bash
npx prisma migrate status
```

## Alternative: If Customer table doesn't exist

If the Customer table doesn't exist at all, you can create it manually:

```bash
# Connect to your database and run the migration SQL directly
# The SQL is in: prisma/migrations/20251207142229_add_customer_model/migration.sql
```

Or use this one-liner:
```bash
cat prisma/migrations/20251207142229_add_customer_model/migration.sql | psql $DATABASE_URL
```

## Verification

After fixing, verify the Customer table exists:
```bash
npx prisma db execute --stdin < scripts/check-customer-table.sql
```

## Final Step: Update package.json

Once migrations are working, update your build script:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

Then commit and push:
```bash
git add package.json
git commit -m "Restore full build script with prisma migrate deploy"
git push origin main
```
