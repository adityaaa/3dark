#!/bin/bash

# 🚨 Complete Security Cleanup Script
# Removes ALL exposed credentials from git history

set -e  # Exit on any error

echo "🚨 SECURITY CLEANUP - Remove All Exposed Credentials"
echo "===================================================="
echo ""
echo "This script will:"
echo "  1. Backup your repository"
echo "  2. Remove .env files from ALL git history"
echo "  3. Remove all sensitive data"
echo "  4. Force push to GitHub (rewrites history)"
echo ""
echo "⚠️  PREREQUISITES:"
echo "  ✅ Revoked old Resend API key"
echo "  ✅ Created new Resend API key"  
echo "  ✅ Rotated/Reset PostgreSQL password"
echo "  ✅ Updated Vercel environment variables"
echo ""

read -p "Have you completed ALL prerequisites above? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please complete prerequisites first!"
    echo ""
    echo "What to do:"
    echo "  1. Resend: https://resend.com/api-keys - Delete old key"
    echo "  2. Vercel: https://vercel.com/dashboard - Rotate DB password"
    echo "  3. Vercel: Settings → Environment Variables - Verify new values"
    echo ""
    exit 1
fi

echo ""
echo "Starting cleanup process..."
echo ""

# Step 1: Backup
echo "📦 Step 1/5: Creating backup..."
cd /Users/adityarajak/Downloads
BACKUP_NAME="3dark-web-backup-$(date +%Y%m%d-%H%M%S)"
cp -r 3dark-web "$BACKUP_NAME"
echo "✅ Backup created: $BACKUP_NAME"
echo ""

# Step 2: Clean git history
cd 3dark-web

echo "🧹 Step 2/5: Removing sensitive files from git history..."
echo "This may take a few minutes..."

# Remove .env files from entire history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env .env.local .env.production .env.development .env.production.local' \
  --prune-empty --tag-name-filter cat -- --all

echo "✅ Sensitive files removed from history"
echo ""

# Step 3: Clean up refs
echo "🗑️  Step 3/5: Cleaning up git references..."
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
echo "✅ Git references cleaned"
echo ""

# Step 4: Verify cleanup
echo "🔍 Step 4/5: Verifying cleanup..."
FOUND=$(git log --all --full-history -S "RESEND_API_KEY" --source -- .env* | wc -l)
if [ "$FOUND" -gt 0 ]; then
    echo "⚠️  Warning: Some references still found. May need additional cleanup."
else
    echo "✅ No sensitive data found in history"
fi
echo ""

# Step 5: Force push
echo "🚀 Step 5/5: Force push to GitHub..."
echo "⚠️  This will REWRITE GitHub history!"
echo "⚠️  Anyone who has cloned the repo will need to re-clone!"
echo ""
read -p "Continue with force push? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Pushing to GitHub..."
    git push origin --force --all
    git push origin --force --tags
    echo ""
    echo "✅ Force push complete!"
    echo ""
    echo "🎉 SUCCESS! Your git history is now clean!"
    echo ""
    echo "Next steps:"
    echo "  1. Check GitGuardian: https://dashboard.gitguardian.com"
    echo "  2. Mark incidents as resolved"
    echo "  3. Test your website: https://3dark.in"
    echo "  4. Place test order to verify everything works"
    echo ""
    echo "📁 Backup location: /Users/adityarajak/Downloads/$BACKUP_NAME"
else
    echo ""
    echo "❌ Cancelled. Local changes only."
    echo "Git history cleaned locally but NOT pushed to GitHub."
    echo "Exposed credentials are still visible on GitHub!"
    echo ""
    echo "To push later, run:"
    echo "  cd /Users/adityarajak/Downloads/3dark-web"
    echo "  git push origin --force --all"
    echo "  git push origin --force --tags"
fi
