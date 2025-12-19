#!/bin/bash

# Fix Failed Customer Model Migration
# This script resolves the failed migration and applies it to production

echo "🔧 Fixing failed Customer model migration..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL is not set"
    echo "Please set it first:"
    echo "export DATABASE_URL='your-production-database-url'"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Step 1: Mark the failed migration as rolled back
echo "📝 Step 1: Marking failed migration as rolled back..."
npx prisma migrate resolve --rolled-back "20251207142229_add_customer_model"

if [ $? -ne 0 ]; then
    echo "❌ Failed to mark migration as rolled back"
    exit 1
fi

echo "✅ Migration marked as rolled back"
echo ""

# Step 2: Try to deploy migrations
echo "📝 Step 2: Deploying migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "⚠️  Migration deploy had issues. Let's check the status..."
    npx prisma migrate status
    exit 1
fi

echo "✅ Migrations deployed successfully"
echo ""

# Step 3: Verify migration status
echo "📝 Step 3: Verifying migration status..."
npx prisma migrate status

echo ""
echo "✅ Migration fix complete!"
echo ""
echo "Next steps:"
echo "1. Update package.json build script to include 'prisma migrate deploy'"
echo "2. Test customer registration and login on your live site"
echo "3. Monitor Vercel logs for any issues"
