# 🔐 Login Redirect Issue - Troubleshooting Guide

**Issue**: After clicking "Sign In", user stays on login page instead of redirecting to dashboard

**Status**: Investigating and fixing

---

## 🔍 What We've Verified:

✅ **Admin Account**: Exists and password is correct
✅ **Database**: Connected and accessible  
✅ **Password Hashing**: Working correctly
✅ **Auth Configuration**: Redirect callback is set up

---

## 🐛 Root Cause Analysis:

Based on the logs:
```
POST /api/auth/callback/admin-login 200 in 6ms
GET /api/auth/signin?csrf=true 302 in 4ms
GET /admin/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000 200 in 17ms
```

The login is **successful (200)**, but then:
1. NextAuth redirects to `/api/auth/signin` (302)
2. Then redirects back to `/admin/login` 

This suggests the **session isn't being set** or the **redirect callback isn't working**.

---

## 🔧 Fixes Applied:

### 1. Updated Redirect Callback (auth.ts)
Added comprehensive logging and multiple redirect strategies:
- Check for explicit `callbackUrl` parameter
- Detect admin vs customer login from URL
- Fallback redirects based on role

### 2. Added Debug Logging
Console logs will now show:
- `🔄 REDIRECT CALLBACK: { url, baseUrl }`
- Which redirect path was chosen
- Whether session is being set

### 3. Improved Error Handling
- Better error messages in login forms
- Fallback redirects if primary method fails

---

## 🧪 Testing Steps:

### Test 1: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try logging in
4. Look for:
   - `🔄 REDIRECT CALLBACK` logs
   - Any error messages
   - Session/cookie warnings

### Test 2: Check Network Tab

1. Open DevTools → Network tab
2. Try logging in
3. Check the requests:
   - `POST /api/auth/callback/admin-login` → Should be 200
   - Look at response headers
   - Check if `Set-Cookie` header is present

### Test 3: Check Application Storage

1. Open DevTools → Application tab
2. Go to Cookies → http://localhost:3000
3. After login, check for:
   - `next-auth.session-token` cookie
   - Cookie value should be set
   - Cookie should not be expired

---

## 🔍 Common Issues and Solutions:

### Issue 1: Cookie Not Being Set

**Symptoms:**
- Login returns 200
- Redirects back to login
- No session cookie in browser

**Solutions:**
```typescript
// Check NEXTAUTH_SECRET is set
console.log(process.env.NEXTAUTH_SECRET); // Should not be undefined

// Check NEXTAUTH_URL matches your dev server
console.log(process.env.NEXTAUTH_URL); // Should be http://localhost:3000
```

**Fix:**
Update `.env.local`:
```bash
NEXTAUTH_SECRET="local-dev-secret-key-change-me-123456789"
NEXTAUTH_URL="http://localhost:3000"
```

### Issue 2: Wrong Redirect URL

**Symptoms:**
- Login works
- Redirects to wrong page
- Gets caught in redirect loop

**Solution:**
Check the `callbackUrl` parameter:
```typescript
// In login page
const callbackUrl = searchParams.get("callbackUrl") || "/admin";
```

### Issue 3: Middleware Blocking

**Symptoms:**
- Login works
- Redirects to dashboard
- Immediately redirected back to login

**Solution:**
Check `middleware.ts`:
```typescript
// Make sure login pages are excluded
if (path === "/admin/login" || path === "/login") {
  return true;
}
```

### Issue 4: Session Not Persisting

**Symptoms:**
- Can login
- Session lost on refresh
- Logged out immediately

**Solution:**
```typescript
// Check session configuration
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

---

## 🚀 Quick Fixes to Try:

### Fix 1: Clear Browser Data
```bash
# Clear all cookies and localStorage
1. Open DevTools
2. Application → Storage → Clear site data
3. Try logging in again
```

### Fix 2: Restart Dev Server
```bash
# Kill and restart
pkill -f "next dev"
npm run dev
```

### Fix 3: Force Redirect in Login Page

Update admin login page to manually redirect on success:

```typescript
const result = await signIn("admin-login", {
  email,
  password,
  redirect: false, // Handle redirect manually
});

if (result?.ok) {
  // Force redirect
  window.location.href = "/admin";
}
```

### Fix 4: Check Session After Login

Add this to test if session is set:

```typescript
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();
console.log("Session:", session, "Status:", status);
```

---

## 📋 Debug Checklist:

- [ ] `.env.local` has `NEXTAUTH_SECRET` set
- [ ] `.env.local` has `NEXTAUTH_URL="http://localhost:3000"`
- [ ] Database connection working
- [ ] Admin account exists and password correct
- [ ] Dev server restarted after auth.ts changes
- [ ] Browser cookies cleared
- [ ] Check browser console for redirect logs
- [ ] Check Network tab for Set-Cookie header
- [ ] Verify session cookie is set after login

---

## 🎯 Current Configuration:

### Environment Variables:
```bash
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="local-dev-secret-key-change-me-123456789"
NEXTAUTH_URL="http://localhost:3000"
```

### Admin Credentials:
- **Email**: admin@3dark.com
- **Password**: admin123

### Expected Flow:
1. User enters credentials
2. POST to `/api/auth/callback/admin-login`
3. NextAuth validates credentials
4. Session JWT created
5. Cookie set: `next-auth.session-token`
6. Redirect callback triggered
7. User redirected to `/admin`

---

## 📞 Next Steps:

1. **Check browser console** for redirect logs
2. **Check if session cookie** is being set
3. **Try manual redirect** if auto-redirect fails
4. **Clear browser data** and try again
5. **Report what you see** in console/network tabs

---

## 🔥 Emergency Fix:

If nothing works, try this manual redirect approach:

```typescript
// In app/admin/login/page.tsx
const result = await signIn("admin-login", {
  email,
  password,
  redirect: false,
});

if (result?.ok) {
  // Wait for session to be set
  await new Promise(resolve => setTimeout(resolve, 500));
  // Force redirect
  router.push("/admin");
  router.refresh();
} else {
  setError(result?.error || "Login failed");
}
```

---

**Let's check the browser console together to see what's happening!** 🔍
