# 🔧 Update Vercel Environment Variable - Step by Step

## Current Task: Update EMAIL_FROM to use order@3dark.in

---

## Method 1: Via Vercel Dashboard (Easiest) 👈 RECOMMENDED

### Step 1: Open Vercel Dashboard
1. Go to: **https://vercel.com/dashboard**
2. Sign in if needed

### Step 2: Find Your Project
- Look for your project in the list (likely named `3dark-web` or `3dark`)
- Click on the project name

### Step 3: Go to Settings
1. Click the **"Settings"** tab at the top
2. In the left sidebar, click **"Environment Variables"**

### Step 4: Find EMAIL_FROM Variable
- Scroll through the list of environment variables
- Look for: `EMAIL_FROM`

**If it exists:**
1. Click the **"..."** (three dots) menu on the right
2. Click **"Edit"**
3. Change the value to: `3Dark <order@3dark.in>`
4. Click **"Save"**

**If it doesn't exist:**
1. Scroll to the top
2. Click **"Add New"** button
3. Fill in:
   - **Name:** `EMAIL_FROM`
   - **Value:** `3Dark <order@3dark.in>`
   - **Environment:** Check all (Production, Preview, Development)
4. Click **"Save"**

### Step 5: Redeploy (Important!)
After saving, you need to redeploy for changes to take effect:

**Option A: Automatic (Recommended)**
- Just push any commit to GitHub
- Vercel will automatically redeploy
- We'll do this in the next step

**Option B: Manual Redeploy**
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click **"..."** (three dots)
4. Click **"Redeploy"**
5. Confirm

---

## Method 2: Via Vercel CLI (Alternative)

### If you have Vercel CLI installed:
```bash
# Login to Vercel
vercel login

# Add/update environment variable
vercel env add EMAIL_FROM

# When prompted, enter: 3Dark <order@3dark.in>
# Select: Production, Preview, Development (all)

# Redeploy
vercel --prod
```

### If you don't have Vercel CLI:
```bash
# Install Vercel CLI globally
npm install -g vercel

# Then follow steps above
```

---

## Method 3: Push a Commit to Trigger Redeploy

We'll commit the EMAIL-STRATEGY.md file and push it:

### Run these commands in your terminal:

```bash
# 1. Make sure you're on the cleanup branch
git status

# 2. Stage the new EMAIL-STRATEGY.md file
git add EMAIL-STRATEGY.md COMPLETE-SETUP-SUMMARY.md

# 3. Commit the changes
git commit -m "📧 Add comprehensive email strategy guide"

# 4. Push to GitHub (triggers automatic Vercel deployment)
git push origin cleanup/remove-unused-files
```

After pushing, Vercel will automatically:
1. Detect the new commit
2. Start building
3. Deploy with the updated environment variables (if you updated them in dashboard)

---

## ✅ Verification Checklist

After updating and redeploying:

### 1. Check Vercel Dashboard
- [ ] Go to Settings → Environment Variables
- [ ] Confirm `EMAIL_FROM` = `3Dark <order@3dark.in>`
- [ ] Shows green checkmark

### 2. Check Deployment Status
- [ ] Go to Deployments tab
- [ ] Latest deployment shows "Ready"
- [ ] No build errors

### 3. Test Email Sending
- [ ] Go to your website: https://3dark.in
- [ ] Place a test order
- [ ] Check if email arrives
- [ ] Verify "From" address is `order@3dark.in`

---

## 🎯 Quick Reference

### What to Update:
```
Variable Name: EMAIL_FROM
Old Value: 3Dark <orders@3dark.in>  (or support@3dark.in)
New Value: 3Dark <order@3dark.in>
```

### Where to Update:
- Vercel Dashboard → Your Project → Settings → Environment Variables

### When It Takes Effect:
- After next deployment (automatic on git push, or manual redeploy)

---

## 🚨 Common Issues & Solutions

### Issue 1: "Variable already exists"
**Solution:** Edit the existing variable instead of adding new one

### Issue 2: "Changes not taking effect"
**Solution:** 
1. Make sure you saved in Vercel dashboard
2. Trigger a redeploy (push new commit or manual redeploy)
3. Wait 2-3 minutes for build to complete

### Issue 3: "Can't find the project"
**Solution:**
1. Make sure you're logged into the correct Vercel account
2. Check if project is under a team (switch account in top-left)

### Issue 4: "Email still showing old address"
**Solution:**
1. Clear browser cache
2. Check Vercel logs: Deployments → Latest → View Function Logs
3. Verify env variable is actually set (it will show in logs)

---

## 📸 Visual Guide

### What Vercel Dashboard Looks Like:

```
┌─────────────────────────────────────────┐
│ Settings                                 │
├─────────────────────────────────────────┤
│ > General                               │
│ > Domains                               │
│ > Environment Variables  ← Click here   │
│ > Git                                   │
│ > Security                              │
└─────────────────────────────────────────┘

Environment Variables Page:
┌─────────────────────────────────────────┐
│ [Add New] button at top                 │
│                                         │
│ Key              Value         Actions  │
│ DATABASE_URL     postgres://... [...]   │
│ EMAIL_FROM       3Dark <ord... [Edit]   │ ← Find this
│ RESEND_API_KEY   re_xxxxx...  [...]    │
│ ...                                     │
└─────────────────────────────────────────┘
```

---

## 🎬 Let's Do It Now!

I'll help you commit and push the new files, which will trigger a deployment.

**Ready?** Just let me know and I'll run the commands! 🚀

Or if you prefer to use the Vercel dashboard, just:
1. Open https://vercel.com/dashboard
2. Find your project
3. Settings → Environment Variables
4. Edit EMAIL_FROM to: `3Dark <order@3dark.in>`
5. Save and redeploy

Which method would you like to use?
