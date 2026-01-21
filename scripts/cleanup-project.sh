#!/bin/bash

# ===========================================
# 3Dark Project Cleanup Script
# ===========================================
# This script automates the cleanup process
# Run with: ./scripts/cleanup-project.sh
# ===========================================

set -e  # Exit on error

echo "🧹 3Dark Project Cleanup Script"
echo "================================"
echo ""
echo "⚠️  This will:"
echo "   - Archive 78 old documentation files"
echo "   - Remove backup files (.backup, -new)"
echo "   - Archive 28 one-time scripts"
echo "   - Clean build cache (~262MB)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Cleanup cancelled"
    exit 1
fi

echo ""
echo "🚀 Starting cleanup..."
echo ""

# ===========================================
# Phase 1: Create archive directories
# ===========================================
echo "📁 Creating archive directories..."
mkdir -p docs/archive
mkdir -p scripts/archive
echo "✅ Directories created"

# ===========================================
# Phase 2: Archive old documentation
# ===========================================
echo ""
echo "📝 Archiving old documentation..."

# Count files before
DOC_COUNT=$(ls -1 *.md 2>/dev/null | wc -l | tr -d ' ')
echo "   Found $DOC_COUNT markdown files"

# Archive by category
mv ADMIN-*.md docs/archive/ 2>/dev/null || true
mv DATABASE-*.md docs/archive/ 2>/dev/null || true
mv DEPLOYMENT-*.md docs/archive/ 2>/dev/null || true
mv LAUNCH-*.md docs/archive/ 2>/dev/null || true
mv PHASE-*.md docs/archive/ 2>/dev/null || true
mv PRIORITY-*.md docs/archive/ 2>/dev/null || true
mv IMPLEMENTATION-*.md docs/archive/ 2>/dev/null || true
mv SETUP-*.md docs/archive/ 2>/dev/null || true
mv FIX-*.md docs/archive/ 2>/dev/null || true
mv ANALYSIS-*.md docs/archive/ 2>/dev/null || true
mv SUMMARY-*.md docs/archive/ 2>/dev/null || true
mv STATUS-*.md docs/archive/ 2>/dev/null || true
mv COMPLETE-*.md docs/archive/ 2>/dev/null || true
mv CRITICAL-*.md docs/archive/ 2>/dev/null || true
mv CUSTOMER-*.md docs/archive/ 2>/dev/null || true
mv AI-*.md docs/archive/ 2>/dev/null || true
mv CATEGORY*.md docs/archive/ 2>/dev/null || true
mv CLEANUP*.md docs/archive/ 2>/dev/null || true
mv CODE_*.md docs/archive/ 2>/dev/null || true
mv DAY-*.md docs/archive/ 2>/dev/null || true
mv DNS-*.md docs/archive/ 2>/dev/null || true
mv DROPSHIPPING-*.md docs/archive/ 2>/dev/null || true
mv EMAIL*.md docs/archive/ 2>/dev/null || true
mv ENV-*.md docs/archive/ 2>/dev/null || true
mv FINAL_*.md docs/archive/ 2>/dev/null || true
mv FREE_*.md docs/archive/ 2>/dev/null || true
mv GIT_*.md docs/archive/ 2>/dev/null || true
mv HOMEPAGE-*.md docs/archive/ 2>/dev/null || true
mv IMPROVEMENTS-*.md docs/archive/ 2>/dev/null || true
mv INVENTORY-*.md docs/archive/ 2>/dev/null || true
mv LOGIN-*.md docs/archive/ 2>/dev/null || true
mv LOOKBOOK-*.md docs/archive/ 2>/dev/null || true
mv MIGRATION*.md docs/archive/ 2>/dev/null || true
mv MOBILE-*.md docs/archive/ 2>/dev/null || true
mv MODERN-*.md docs/archive/ 2>/dev/null || true
mv NEXT-*.md docs/archive/ 2>/dev/null || true
mv ON-DEMAND-*.md docs/archive/ 2>/dev/null || true
mv PAYMENT-*.md docs/archive/ 2>/dev/null || true
mv PRODUCTION-*.md docs/archive/ 2>/dev/null || true
mv PROJECT-*.md docs/archive/ 2>/dev/null || true
mv QUICK-*.md docs/archive/ 2>/dev/null || true
mv RAZORPAY-*.md docs/archive/ 2>/dev/null || true
mv REVIEW-*.md docs/archive/ 2>/dev/null || true
mv SECURITY-*.md docs/archive/ 2>/dev/null || true
mv SHOP-*.md docs/archive/ 2>/dev/null || true
mv SIZE-*.md docs/archive/ 2>/dev/null || true
mv SUCCESSFUL-*.md docs/archive/ 2>/dev/null || true
mv TASKS_*.md docs/archive/ 2>/dev/null || true
mv TOP-*.md docs/archive/ 2>/dev/null || true
mv UPDATE-*.md docs/archive/ 2>/dev/null || true
mv VERCEL-*.md docs/archive/ 2>/dev/null || true

# Keep only essential docs (move them back if accidentally archived)
mv docs/archive/README.md . 2>/dev/null || true
mv docs/archive/COMPREHENSIVE-AUDIT-REPORT-JAN-2026.md . 2>/dev/null || true
mv docs/archive/ACTION-PLAN-PRIORITY.md . 2>/dev/null || true
mv docs/archive/PROJECT-CLEANUP-OPTIMIZATION-PLAN.md . 2>/dev/null || true

# Count files after
DOC_COUNT_AFTER=$(ls -1 *.md 2>/dev/null | wc -l | tr -d ' ')
ARCHIVED_DOCS=$((DOC_COUNT - DOC_COUNT_AFTER))
echo "✅ Archived $ARCHIVED_DOCS documentation files"
echo "   Kept $DOC_COUNT_AFTER essential docs"

# ===========================================
# Phase 3: Remove backup files
# ===========================================
echo ""
echo "🗑️  Removing backup files..."

BACKUP_COUNT=0

if [ -f "app/checkout/page.tsx.backup" ]; then
    rm app/checkout/page.tsx.backup
    ((BACKUP_COUNT++))
    echo "   ✓ Deleted app/checkout/page.tsx.backup"
fi

if [ -f "components/NavbarClient.tsx.backup" ]; then
    rm components/NavbarClient.tsx.backup
    ((BACKUP_COUNT++))
    echo "   ✓ Deleted components/NavbarClient.tsx.backup"
fi

if [ -f ".env.local.backup" ]; then
    mv .env.local.backup docs/archive/
    ((BACKUP_COUNT++))
    echo "   ✓ Archived .env.local.backup to docs/"
fi

echo "✅ Removed/archived $BACKUP_COUNT backup files"

# ===========================================
# Phase 4: Handle duplicate components
# ===========================================
echo ""
echo "🔄 Checking for duplicate components..."

if [ -f "app/admin/orders/[id]/OrderDetailClient-new.tsx" ]; then
    if [ -f "app/admin/orders/[id]/OrderDetailClient.tsx" ]; then
        echo "   ⚠️  Both OrderDetailClient.tsx and OrderDetailClient-new.tsx exist"
        echo "   Keeping OrderDetailClient-new.tsx (newer version)"
        rm app/admin/orders/[id]/OrderDetailClient.tsx
        mv app/admin/orders/[id]/OrderDetailClient-new.tsx app/admin/orders/[id]/OrderDetailClient.tsx
        echo "   ✓ Replaced with newer version"
    else
        mv app/admin/orders/[id]/OrderDetailClient-new.tsx app/admin/orders/[id]/OrderDetailClient.tsx
        echo "   ✓ Renamed OrderDetailClient-new.tsx"
    fi
fi

echo "✅ Component cleanup complete"

# ===========================================
# Phase 5: Archive one-time scripts
# ===========================================
echo ""
echo "📦 Archiving old scripts..."

SCRIPT_COUNT=0

# Migration scripts
for file in scripts/*migration*.{ts,sh,sql} scripts/resolve-*.ts; do
    if [ -f "$file" ]; then
        mv "$file" scripts/archive/ 2>/dev/null && ((SCRIPT_COUNT++)) || true
    fi
done

# Fix scripts
for file in scripts/fix-*.{ts,sql} scripts/check-*.{ts,sql}; do
    if [ -f "$file" ]; then
        mv "$file" scripts/archive/ 2>/dev/null && ((SCRIPT_COUNT++)) || true
    fi
done

# Old setup scripts
mv scripts/initial-setup.ts scripts/archive/ 2>/dev/null && ((SCRIPT_COUNT++)) || true
mv scripts/minimal-seed.js scripts/archive/ 2>/dev/null && ((SCRIPT_COUNT++)) || true
mv scripts/quick-seed.js scripts/archive/ 2>/dev/null && ((SCRIPT_COUNT++)) || true
mv scripts/seed-products.ts scripts/archive/ 2>/dev/null && ((SCRIPT_COUNT++)) || true
mv scripts/update-admin-password.ts scripts/archive/ 2>/dev/null && ((SCRIPT_COUNT++)) || true

echo "✅ Archived $SCRIPT_COUNT old scripts"

# ===========================================
# Phase 6: Clean build artifacts
# ===========================================
echo ""
echo "🏗️  Cleaning build artifacts..."

BUILD_SIZE_BEFORE=0
if [ -d ".next" ]; then
    BUILD_SIZE_BEFORE=$(du -sm .next 2>/dev/null | cut -f1)
fi

rm -rf .next
rm -rf .vercel
rm -f tsconfig.tsbuildinfo

echo "✅ Cleaned build cache (~${BUILD_SIZE_BEFORE}MB freed)"

# ===========================================
# Phase 7: Update .gitignore
# ===========================================
echo ""
echo "📝 Updating .gitignore..."

# Add cleanup entries if not already present
if ! grep -q "docs/archive/" .gitignore 2>/dev/null; then
    cat >> .gitignore << EOF

# Cleanup archives
docs/archive/
scripts/archive/

# Backup files
*.backup
*.old
*-old.*
*-new.*

# Build artifacts
.next/
.vercel/
tsconfig.tsbuildinfo
EOF
    echo "✅ Updated .gitignore"
else
    echo "✅ .gitignore already up to date"
fi

# ===========================================
# Phase 8: Create archive README
# ===========================================
echo ""
echo "📄 Creating archive documentation..."

cat > docs/archive/README.md << 'EOF'
# Archived Documentation

This folder contains old documentation files that are no longer actively used but kept for reference.

## Archive Date
January 6, 2026

## Archived Categories

- **Admin Docs:** Troubleshooting and setup guides (resolved)
- **Database Docs:** Migration and connection fixes (completed)
- **Deployment Docs:** Initial deployment guides (superseded)
- **Launch Docs:** Pre-launch planning (completed)
- **Implementation Docs:** Development progress (historical)

## Current Documentation

See the project root for current documentation:
- `README.md` - Project overview and setup
- `COMPREHENSIVE-AUDIT-REPORT-JAN-2026.md` - Full system audit
- `ACTION-PLAN-PRIORITY.md` - Current priorities
- `PROJECT-CLEANUP-OPTIMIZATION-PLAN.md` - This cleanup plan

## Retention Policy

These files will be kept for 3 months for reference, then can be safely deleted.
EOF

cat > scripts/archive/README.md << 'EOF'
# Archived Scripts

This folder contains one-time scripts that have served their purpose.

## Archive Date
January 6, 2026

## Script Categories

- **Migration Scripts:** Database migration fixes (no longer needed)
- **Fix Scripts:** One-time data/structure fixes (completed)
- **Setup Scripts:** Initial setup utilities (superseded by newer versions)

## Active Scripts

See the `scripts/` folder for currently used scripts:
- `seed-local.js` - Seed local database
- `create-admin.js` - Create admin account
- `verify-admin-password.js` - Verify admin login
- And more...

## Retention Policy

These scripts will be kept for 6 months for reference, then can be safely deleted.
EOF

echo "✅ Archive documentation created"

# ===========================================
# Summary
# ===========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Cleanup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo "   • Archived $ARCHIVED_DOCS documentation files → docs/archive/"
echo "   • Removed/archived $BACKUP_COUNT backup files"
echo "   • Archived $SCRIPT_COUNT old scripts → scripts/archive/"
echo "   • Cleaned build cache (~${BUILD_SIZE_BEFORE}MB freed)"
echo "   • Updated .gitignore"
echo "   • Created archive documentation"
echo ""
echo "🎯 Next Steps:"
echo "   1. Review changes:"
echo "      $ git status"
echo ""
echo "   2. Rebuild project:"
echo "      $ npm run build"
echo ""
echo "   3. Test everything:"
echo "      $ npm run dev"
echo "      Open http://localhost:3000"
echo ""
echo "   4. Commit changes:"
echo "      $ git add -A"
echo "      $ git commit -m '🧹 Project cleanup: Archive old docs and scripts'"
echo ""
echo "   5. Deploy (optional):"
echo "      $ git push origin main"
echo ""
echo "📁 Kept Essential Files:"
echo "   • README.md"
echo "   • COMPREHENSIVE-AUDIT-REPORT-JAN-2026.md"
echo "   • ACTION-PLAN-PRIORITY.md"
echo "   • PROJECT-CLEANUP-OPTIMIZATION-PLAN.md"
echo ""
echo "🎉 Your project is now clean and organized!"
