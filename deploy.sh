#!/bin/bash
# 🚀 3Dark Deployment Script

echo "========================================="
echo "🚀 3Dark - Production Deployment"
echo "========================================="
echo ""

# Check if we're on the feature branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

if [ "$CURRENT_BRANCH" != "feature/product-categories" ]; then
    echo "⚠️  Warning: You're not on feature/product-categories branch"
    echo "   Switch to feature/product-categories first!"
    exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes:"
    git status -s
    echo ""
    read -p "Do you want to commit them first? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
    else
        echo "❌ Deployment cancelled. Please commit your changes first."
        exit 1
    fi
fi

echo ""
echo "📊 Summary of changes:"
git log main..HEAD --oneline
echo ""

read -p "🔍 Ready to merge and deploy to production? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

echo ""
echo "1️⃣  Switching to main branch..."
git checkout main

echo "2️⃣  Pulling latest changes..."
git pull origin main

echo "3️⃣  Merging feature/product-categories into main..."
git merge feature/product-categories

if [ $? -ne 0 ]; then
    echo "❌ Merge conflict detected! Please resolve conflicts manually."
    exit 1
fi

echo "4️⃣  Pushing to main branch..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Push failed! Please check your connection and try again."
    exit 1
fi

echo ""
echo "========================================="
echo "✅ Deployment Complete!"
echo "========================================="
echo ""
echo "📍 Vercel will now automatically deploy your changes."
echo "🌐 Monitor deployment: https://vercel.com/dashboard"
echo "🔗 Production URL: https://3dark.in"
echo ""
echo "🧪 Next Steps:"
echo "   1. Wait for Vercel deployment to complete (2-3 minutes)"
echo "   2. Visit https://3dark.in and test the site"
echo "   3. Login to admin panel and verify new features"
echo "   4. Create initial brands and products"
echo "   5. Test complete purchase flow"
echo ""
echo "📚 Documentation:"
echo "   - FINAL_STATUS.md"
echo "   - FINAL_TESTING_CHECKLIST.md"
echo "   - FREE_SIZE_FEATURE.md"
echo ""
echo "🎉 Your 3Dark store is live and ready!"
echo "========================================="
