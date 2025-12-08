# 🔧 Vercel Environment Variable Update

## Update EMAIL_FROM in Vercel

You need to update the `EMAIL_FROM` environment variable in Vercel to use your new email address.

### Steps:

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select your project: `3dark-web` (or your project name)

2. **Navigate to Settings → Environment Variables:**
   - Click **Settings** tab
   - Click **Environment Variables** in sidebar

3. **Find and Edit EMAIL_FROM:**
   - Look for: `EMAIL_FROM`
   - Current value: `3Dark <orders@3dark.in>` or `3Dark <support@3dark.in>`
   - **New value:** `3Dark <order@3dark.in>`
   - Click **Save**

4. **Redeploy (Optional but Recommended):**
   - Go to **Deployments** tab
   - Click **Redeploy** on latest deployment
   - Or just push a new commit to trigger redeployment

---

## Alternative: Update All Email Addresses

If you want to keep flexibility, you can add separate environment variables:

```bash
EMAIL_FROM="3Dark <order@3dark.in>"
SUPPORT_EMAIL="support@3dark.in"
NO_REPLY_EMAIL="no-reply@3dark.in"
```

Then use them in your code based on the email type:
- Order confirmations → `order@3dark.in`
- Support emails → `support@3dark.in`
- Automated notifications → `no-reply@3dark.in`

---

## Current Status:

✅ Email accounts created in Hostinger:
- `support@3dark.in`
- `order@3dark.in`
- `no-reply@3dark.in`

✅ MX records active in Vercel DNS

✅ Code updated to use `order@3dark.in`

⏳ Pending: Update `EMAIL_FROM` in Vercel

⏳ Pending: Test sending/receiving emails

---

## After Update:

1. Wait 2-3 minutes for Vercel to apply changes
2. Test by making a test order
3. Check `order@3dark.in` webmail for order confirmation
4. Verify customer receives the email too

---

**Quick Link:** https://vercel.com/dashboard
