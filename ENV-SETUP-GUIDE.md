# 3DARK - Environment Setup Guide

## 🔧 Required Environment Variables

To enable all features of the 3Dark e-commerce platform, you need to configure the following environment variables in your `.env` or `.env.local` file.

---

## 📋 Environment Variables

### 1. **Database**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/3dark"
# OR for SQLite (development)
# DATABASE_URL="file:./dev.db"
```

### 2. **NextAuth (Authentication)**
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-minimum-32-characters-long"
```

**How to generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. **Razorpay (Payment Gateway)** ⚠️ Currently Failing
```env
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

**Note:** If these are not configured or invalid, checkout will automatically fall back to Cash on Delivery (COD).

**Get Razorpay Credentials:**
1. Sign up at https://razorpay.com/
2. Go to Settings → API Keys
3. Generate Test/Live API keys
4. Copy Key ID and Key Secret

### 4. **Email Service (Optional)** ⚠️ Currently Failing
```env
# Option 1: Resend
RESEND_API_KEY="re_xxxxxxxxxxxxx"

# Option 2: SendGrid
SENDGRID_API_KEY="SG.xxxxxxxxxxxxx"

# Option 3: SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

**Note:** Email failures won't break checkout - orders will still be created successfully.

---

## 🚀 Quick Setup

### 1. Copy the example environment file:
```bash
cp .env.example .env.local
```

### 2. Edit `.env.local` with your values:
```bash
nano .env.local
# OR
code .env.local
```

### 3. Restart your development server:
```bash
npm run dev
```

---

## ⚠️ Current Issues & Workarounds

### Issue 1: Razorpay API Keys Invalid (401 Error)
**Error:**
```
statusCode: 401,
error: { description: 'Authentication failed', code: 'BAD_REQUEST_ERROR' }
```

**Fix:**
1. Check if `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are in `.env.local`
2. Verify the keys are correct (no extra spaces)
3. Make sure you're using **Test** keys for development
4. Restart the server after adding keys

**Temporary Workaround:**
- The system will automatically convert Razorpay orders to COD if Razorpay fails
- Users will be notified with: "Payment gateway temporarily unavailable. Order converted to Cash on Delivery."

### Issue 2: Email API Key Invalid (401 Error)
**Error:**
```
statusCode: 401,
name: 'validation_error',
message: 'API key is invalid'
```

**Fix:**
1. Add valid email service API key to `.env.local`
2. Choose one email provider (Resend, SendGrid, or SMTP)
3. Restart the server

**Temporary Workaround:**
- Orders still get created successfully
- Email errors are logged but don't break checkout
- Users receive order confirmation on screen

---

## 🔐 Security Best Practices

### 1. **Never commit `.env` files**
```bash
# Already in .gitignore:
.env
.env.local
.env*.local
```

### 2. **Use different keys for development and production**
```env
# Development
RAZORPAY_KEY_ID="rzp_test_xxxxx"

# Production
RAZORPAY_KEY_ID="rzp_live_xxxxx"
```

### 3. **Rotate secrets regularly**
- Change NEXTAUTH_SECRET every few months
- Rotate API keys if compromised
- Use environment-specific keys

---

## 📝 Example .env.local File

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-very-long-secret-key-minimum-32-characters-long-please"

# Razorpay (Optional - will fallback to COD if not set)
RAZORPAY_KEY_ID="rzp_test_1234567890"
RAZORPAY_KEY_SECRET="your_razorpay_secret_key"

# Email (Optional - won't break checkout if not set)
RESEND_API_KEY="re_your_resend_api_key"

# Admin Email (for order notifications)
ADMIN_EMAIL="admin@3dark.com"
```

---

## ✅ Testing Configuration

### Check if Razorpay is configured:
```bash
# In terminal, while server is running:
curl http://localhost:3000/api/checkout \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Look for:
# ✅ Razorpay configured
# OR
# ❌ Razorpay credentials not configured
```

### Check server logs:
```bash
npm run dev

# Watch for:
# ✅ Order confirmation email sent
# ❌ Email send error: API key is invalid
```

---

## 🆘 Troubleshooting

### Problem: "API key is invalid" for Razorpay
**Solution:**
1. Log in to Razorpay Dashboard
2. Go to Settings → API Keys
3. Regenerate keys if needed
4. Update `.env.local`
5. Restart server: `Ctrl+C` then `npm run dev`

### Problem: Orders work but emails don't send
**Solution:**
- This is okay! Orders are still created
- Check email API key in `.env.local`
- Verify email service is active
- Check spam folder for test emails

### Problem: Checkout always uses COD even when selecting Razorpay
**Solution:**
- Razorpay credentials are missing or invalid
- Check console logs for Razorpay errors
- Verify `.env.local` has correct keys
- System automatically falls back to COD for reliability

---

## 📚 Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Resend Documentation](https://resend.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] Change all API keys to production keys
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Generate new `NEXTAUTH_SECRET`
- [ ] Use production database URL
- [ ] Test Razorpay with real payment
- [ ] Verify emails are sending
- [ ] Test order creation end-to-end
- [ ] Enable error monitoring (Sentry, etc.)

---

**Last Updated:** January 5, 2026  
**Status:** Development - Some services require configuration
