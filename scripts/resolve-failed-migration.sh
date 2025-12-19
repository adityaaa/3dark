#!/bin/bash
# scripts/resolve-failed-migration.sh
# Run this script to resolve the failed migration in production

echo "🔧 Resolving failed migration in production database..."
echo ""
echo "This script will:"
echo "1. Mark the failed migration as resolved"
echo "2. Apply the Customer model migration"
echo ""

# Step 1: Mark migration as resolved
echo "Step 1: Marking failed migration as resolved..."
npx prisma migrate resolve --applied 20251207_add_customer_model

# Step 2: Deploy migrations
echo ""
echo "Step 2: Deploying migrations..."
npx prisma migrate deploy

echo ""
echo "✅ Migration resolved! You can now redeploy on Vercel."
