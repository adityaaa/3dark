# 🔑 HOW TO ADD RAZORPAY API KEYS

## Current Issue:
Your Razorpay keys are set to placeholder values, causing authentication errors.

---

## 🚀 Quick Fix Guide

### Step 1: Get Your Razorpay Keys

1. **Visit Razorpay Dashboard:**
   - Go to: https://dashboard.razorpay.com/
   - Sign in with your account (or create one if you don't have it)

2. **Switch to Test Mode** (for testing):
   - Look for the toggle at the top of the dashboard
   - Make sure you're in **Test Mode** (not Live Mode)

3. **Generate API Keys:**
   - Navigate to: **Settings** → **API Keys**
   - Click **Generate Test Keys** button
   - You'll see:
     - **Key ID**: Something like `rzp_test_xxxxxxxxxxx`
     - **Key Secret**: Something like `xxxxxxxxxxxxxxxxxxxxx`
   - **IMPORTANT**: Copy these immediately! The secret is only shown once.

### Step 2: Update Your .env File

Open your `.env` file and replace the placeholder values:

```bash
# BEFORE (current - WRONG):
RAZORPAY_KEY_ID="your_test_key_id"
RAZORPAY_KEY_SECRET="your_test_key_secret"

# AFTER (replace with your real keys):
RAZORPAY_KEY_ID="rzp_test_AbCdEf1234567890"
RAZORPAY_KEY_SECRET="YourActualSecretKeyHere1234567890"
```

### Step 3: Restart Your Development Server

After updating the keys:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 📝 Full .env Configuration

Your `.env` file should look like this (with your real values):

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/3dark"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID="rzp_test_AbCdEf1234567890"           # Replace with your key
RAZORPAY_KEY_SECRET="YourActualSecretKeyHere123"       # Replace with your secret
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"          # Optional for now

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxx"              # Replace if you have one
ADMIN_EMAIL="admin@3dark.com"
```

---

## 🧪 Testing Your Configuration

After adding the keys and restarting:

1. **Try a test checkout**:
   - Add a product to cart
   - Go to checkout
   - Fill in the form
   - Select **Razorpay** payment method
   - Click **Place Order**

2. **Expected behavior**:
   - Razorpay payment modal should open
   - You can use Razorpay test card numbers for testing

3. **Razorpay Test Card Numbers**:
   ```
   Card Number: 4111 1111 1111 1111
   CVV: Any 3 digits
   Expiry: Any future date
   Name: Any name
   ```

---

## 🔒 Security Notes

1. **Never commit .env file to Git**:
   - `.env` is already in `.gitignore`
   - Never push API keys to GitHub

2. **Keep Test and Live Keys Separate**:
   - Use Test keys for development
   - Use Live keys only in production

3. **Rotate Keys Regularly**:
   - If keys are exposed, generate new ones immediately
   - Update in Razorpay dashboard and your .env file

---

## 🆘 Troubleshooting

### Still getting "API key is invalid" error?

1. **Double-check the keys**:
   - Make sure you copied them correctly
   - No extra spaces or quotes
   - Keys should start with `rzp_test_` (for test mode)

2. **Restart the dev server**:
   ```bash
   # Stop: Ctrl+C
   # Start: npm run dev
   ```

3. **Check Razorpay dashboard**:
   - Make sure keys are active
   - Check if test mode is enabled

4. **Try regenerating keys**:
   - Delete old keys from dashboard
   - Generate new ones
   - Update .env file
   - Restart server

---

## 💡 Alternative: Use COD During Development

If you want to skip Razorpay setup for now:

1. Just select **Cash on Delivery** during checkout
2. COD works without any API keys
3. You can add Razorpay keys later

The app is designed to **fallback to COD** if Razorpay fails, so your orders will still work!

---

## 📧 Need Help?

If you're still having issues:
1. Check the terminal logs for specific error messages
2. Verify your Razorpay account is fully set up
3. Make sure you're using Test Mode keys for development
4. Contact Razorpay support if keys aren't working

---

**Good luck! 🚀**
