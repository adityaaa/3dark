# 🚨 URGENT: Security Fix Required - Exposed Credentials

**Date:** December 8, 2025  
**Severity:** 🔴🔴 DOUBLE CRITICAL  
**Issues:** 
1. SMTP/Resend API credentials exposed (Dec 8)
2. PostgreSQL Database URI exposed (Dec 5) **← MORE DANGEROUS!**

---

## ⚠️ What Happened

GitGuardian detected **TWO** critical security breaches:

### 1. Resend API Key (December 8, 2025)
- ❌ Anyone can send emails using your account
- ❌ You may exceed your free tier limits
- ❌ Your account could be suspended

### 2. PostgreSQL Database URI (December 5, 2025) 🔥
- ❌ **Anyone can access your ENTIRE database**
- ❌ **Read all customer data, orders, products**
- ❌ **Modify or DELETE all data**
- ❌ **This is EXTREMELY dangerous!**

**Both credentials are in your Git history, even though the files are deleted now.**

---

## 🔧 IMMEDIATE ACTIONS (Do These NOW!)

### Step 1: Reset Database Password (MOST CRITICAL!) 🔥

**Your database is completely exposed! Do this FIRST!**

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Click "Storage" tab
   - Find your Postgres database

2. **Rotate Credentials:**
   - Click on your database
   - Go to "Settings"
   - Look for "Rotate Password" or "Reset Credentials"
   - Click it - Vercel will auto-update `DATABASE_URL`

3. **Redeploy:**
   - Go to your project
   - Deployments → Redeploy latest
   - Wait for completion

4. **Test website:**
   - Visit https://3dark.in
   - Make sure it still works

### Step 2: Revoke the Exposed Resend API Key

1. **Go to Resend Dashboard:**
   - https://resend.com/api-keys

2. **Delete the exposed API key:**
   - Find the current API key in the list
   - Click "Delete" or "Revoke"
   - Confirm deletion

3. **Create a NEW API key:**
   - Click "Create API Key"
   - Name: `3dark-production-new`
   - Copy the new key immediately
   - **Save it securely** (password manager)

### Step 2: Update Vercel Environment Variable

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select your project

2. **Update RESEND_API_KEY:**
   - Settings → Environment Variables
   - Find: `RESEND_API_KEY`
   - Click "Edit"
   - Paste the **NEW** API key
   - Save

3. **Redeploy:**
   - Go to Deployments
   - Click "Redeploy" on latest deployment
   - Or push any commit to trigger redeploy

### Step 3: Clean Git History (Remove Exposed Credentials)

**Option A: Using BFG Repo-Cleaner (Recommended)**

```bash
# Install BFG (if not installed)
brew install bfg  # macOS
# or download from: https://rtyley.github.io/bfg-repo-cleaner/

# Backup your repo first
cd /Users/adityarajak/Downloads
cp -r 3dark-web 3dark-web-backup

# Clean the credentials
cd 3dark-web
bfg --replace-text <(echo "RESEND_API_KEY=*==>RESEND_API_KEY=REMOVED")
bfg --replace-text <(echo "re_*==>REMOVED")

# Finalize the cleanup
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (this will rewrite history)
git push origin --force --all
```

**Option B: Using git-filter-repo (Alternative)**

```bash
# Install git-filter-repo
brew install git-filter-repo  # macOS

# Backup first
cd /Users/adityarajak/Downloads
cp -r 3dark-web 3dark-web-backup

# Remove sensitive files from history
cd 3dark-web
git filter-repo --path .env --path .env.local --path .env.production --invert-paths

# Force push
git push origin --force --all
```

**Option C: Delete and Recreate Repository (Nuclear Option)**

If the above are too complex:

1. **Create new GitHub repository** (3dark-new or similar)
2. **Remove Git history:**
   ```bash
   cd /Users/adityarajak/Downloads/3dark-web
   rm -rf .git
   git init
   git add .
   git commit -m "Initial commit - clean history"
   ```
3. **Push to new repository:**
   ```bash
   git remote add origin https://github.com/adityaaa/3dark-new.git
   git push -u origin main
   ```
4. **Update Vercel** to use new repository
5. **Delete old repository** on GitHub

---

## ✅ Verification Checklist

After completing the fix:

- [ ] Old Resend API key revoked/deleted
- [ ] New Resend API key generated
- [ ] Vercel environment variable updated
- [ ] Website redeployed successfully
- [ ] Test email sending (place test order)
- [ ] Git history cleaned (no sensitive data)
- [ ] GitHub repository force-pushed
- [ ] GitGuardian alert resolved

---

## 🔒 Prevention Measures

### 1. Update .gitignore (Already Done ✅)

Your `.gitignore` already has:
```
.env
.env.local
.env.*.local
.env.production
```

### 2. Pre-commit Hook (Optional but Recommended)

Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash

# Check for sensitive patterns
if git diff --cached | grep -E "(RESEND_API_KEY|RAZORPAY_KEY_SECRET|NEXTAUTH_SECRET)" | grep -v ".example"; then
    echo "🚨 ERROR: Attempting to commit sensitive credentials!"
    echo "Please remove sensitive data before committing."
    exit 1
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

### 3. Use Git-Secrets (Automated Protection)

```bash
# Install git-secrets
brew install git-secrets  # macOS

# Set up for your repo
cd /Users/adityarajak/Downloads/3dark-web
git secrets --install
git secrets --register-aws

# Add custom patterns
git secrets --add 'RESEND_API_KEY=re_[a-zA-Z0-9]+'
git secrets --add 'RAZORPAY_KEY_SECRET=[a-zA-Z0-9]+'
git secrets --add 'NEXTAUTH_SECRET=[a-zA-Z0-9]+'
```

### 4. Never Commit These Files:

❌ `.env`  
❌ `.env.local`  
❌ `.env.production`  
❌ `.env.development`  
✅ `.env.example` (safe - no real values)

### 5. Always Use Environment Variables in Production

- Vercel: Settings → Environment Variables
- Never hardcode secrets in code
- Use `.env.example` as template only

---

## 📋 Quick Fix Script (All-in-One)

Run this to fix everything quickly:

```bash
#!/bin/bash

echo "🚨 Security Fix - Cleaning exposed credentials"
echo ""
echo "⚠️  Make sure you've already:"
echo "1. Revoked old Resend API key"
echo "2. Created new Resend API key"
echo "3. Updated Vercel environment variable"
echo ""
read -p "Have you done the above? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please complete those steps first!"
    exit 1
fi

# Backup
cd /Users/adityarajak/Downloads
cp -r 3dark-web 3dark-web-backup-$(date +%Y%m%d-%H%M%S)

cd 3dark-web

# Remove .env files from git history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env .env.local .env.production .env.development' \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
echo ""
echo "⚠️  About to force push to GitHub. This will rewrite history."
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin --force --all
    git push origin --force --tags
    echo "✅ Done! Git history cleaned."
else
    echo "❌ Cancelled. Changes are local only."
fi
```

Save as `fix-security.sh` and run:
```bash
chmod +x fix-security.sh
./fix-security.sh
```

---

## 🔍 Check If Credentials Are Still Exposed

After cleaning, verify:

```bash
# Search for API keys in git history
git log --all --full-history -S "RESEND_API_KEY" --source -- .env*

# Should return nothing if cleaned successfully
```

---

## 💡 Why This Happened

Your `.env.production` file was committed in an earlier push. Even though you deleted it in commit `15c3df0`, it still exists in Git history.

**Git tracks ALL history permanently** unless you explicitly remove it.

---

## 📞 If You Need Help

### GitGuardian
- Dashboard: https://dashboard.gitguardian.com
- Mark incident as resolved after fix

### Resend Support
- If your account is compromised: support@resend.com
- Check usage: https://resend.com/emails

### Vercel Support
- Dashboard: https://vercel.com/support
- Check deployment logs after updating key

---

## ⏰ Timeline

**Do these in order:**

1. **NOW** (5 min): Revoke old API key, create new one
2. **NEXT** (2 min): Update Vercel env variable
3. **THEN** (5 min): Redeploy and test
4. **LATER TODAY** (15 min): Clean Git history
5. **FINALLY** (5 min): Set up prevention measures

---

## ✅ After You're Done

Reply back here with:
- [ ] "Revoked old key"
- [ ] "Created new key"  
- [ ] "Updated Vercel"
- [ ] "Tested email"
- [ ] "Cleaned git history"

Then I'll help you verify everything is secure! 🔒

---

**REMEMBER: The exposed key is PUBLIC. Revoke it immediately!** ⚠️
