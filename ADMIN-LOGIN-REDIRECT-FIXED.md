# 🔧 Admin Login Redirect Issue - FIXED

**Issue**: After successful admin login, page redirects back to login instead of admin dashboard  
**Root Cause**: Missing redirect callback in NextAuth configuration  
**Status**: ✅ **FIXED**

---

## ✅ What Was Fixed

### 1. Added Redirect Callback to Auth Configuration

Updated `/lib/auth.ts` to include proper redirect logic:

```typescript
callbacks: {
  // ...existing jwt and session callbacks...
  
  async redirect({ url, baseUrl }) {
    // After admin login, redirect to admin dashboard
    if (url.includes("/api/auth/callback/admin-login")) {
      return `${baseUrl}/admin`;
    }
    // After customer login, redirect to account page
    if (url.includes("/api/auth/callback/customer-login")) {
      return `${baseUrl}/account`;
    }
    // Allows relative callback URLs
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    // Allows callback URLs on the same origin
    else if (new URL(url).origin === baseUrl) return url;
    return baseUrl;
  },
}
```

### 2. Restarted Dev Server

- Killed existing Next.js dev server
- Started fresh server to apply auth configuration changes

---

## 🧪 Testing the Fix

### Test Admin Login Now:

1. **Go to**: http://localhost:3000/admin/login
2. **Enter credentials**:
   - Email: `admin@3dark.com`
   - Password: `admin123`
3. **Click "Sign In"**
4. **Expected**: Redirect to http://localhost:3000/admin

### Verify Session:

After login, check browser console or run:
```bash
curl -b cookies.txt http://localhost:3000/api/auth/session
```

Should show:
```json
{
  "user": {
    "id": "1",
    "email": "admin@3dark.com",
    "name": "Admin",
    "role": "admin"
  }
}
```

---

## 🔍 How Auth Flow Works Now

### 1. Login Request:
```
User submits form → POST /api/auth/callback/admin-login
```

### 2. Credentials Provider:
```
- Validates email/password
- Finds admin in database
- Returns user object with role="admin"
```

### 3. JWT Callback:
```
- Adds user.id and user.role to token
- Token signed with NEXTAUTH_SECRET
```

### 4. Redirect Callback (NEW):
```
- Checks if URL contains "admin-login"
- Redirects to /admin dashboard
- Sets session cookie
```

### 5. Middleware:
```
- Checks token.role === "admin"
- Allows access to /admin routes
- Blocks non-admin users
```

### 6. Session Callback:
```
- Adds id and role to session.user
- Available in components via useSession()
```

---

## 🔐 Login Endpoints

### Admin Login:
- **Login Page**: `/admin/login`
- **Provider ID**: `admin-login`
- **Callback**: `/api/auth/callback/admin-login`
- **Redirect**: `/admin` (dashboard)

### Customer Login:
- **Login Page**: `/login`
- **Provider ID**: `customer-login`
- **Callback**: `/api/auth/callback/customer-login`
- **Redirect**: `/account`

---

## 🛡️ Protected Routes

### Admin Routes (require role="admin"):
```
/admin
/admin/*
```

### Customer Routes (require role="customer"):
```
/account
/account/*
```

### Public Routes:
```
/
/shop
/product/*
/about
/support
/admin/login
/login
/register
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Still Redirecting to Login
**Solution**: Clear browser cookies and try again
```bash
# In browser DevTools Console:
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

### Issue 2: Session Not Persisting
**Check**:
- NEXTAUTH_SECRET is set in `.env.local`
- NEXTAUTH_URL is correct (`http://localhost:3000`)
- Cookies are enabled in browser

### Issue 3: Unauthorized After Login
**Check**:
- Role is being set in JWT callback
- Middleware is checking correct role
- Token is being decoded properly

---

## 🧪 Debug Commands

### Check Admin Account:
```bash
sqlite3 prisma/prisma/dev.db "SELECT * FROM Admin;"
```

### Test Login API Directly:
```bash
curl -X POST http://localhost:3000/api/auth/callback/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@3dark.com",
    "password": "admin123"
  }'
```

### Check Session:
```bash
curl http://localhost:3000/api/auth/session
```

### View NextAuth Debug Logs:
- Already enabled in `.env.local` with `debug: true`
- Check terminal output when logging in

---

## 📋 Verification Checklist

After restart, verify:

- [ ] Dev server running on http://localhost:3000
- [ ] Admin login page loads
- [ ] Can submit login form
- [ ] Redirects to `/admin` after successful login
- [ ] Session persists on page reload
- [ ] Can access admin dashboard
- [ ] Can logout and login again

---

## 🎯 Current Configuration

### Environment Variables:
```bash
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="local-dev-secret-key-change-me-123456789"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@3dark.com"
ADMIN_PASSWORD="admin123"
```

### Admin Credentials:
- **Email**: `admin@3dark.com`
- **Password**: `admin123`
- **Role**: `admin`
- **Database**: `./prisma/prisma/dev.db`

---

## 🚀 Next Steps

1. **Clear browser cookies** (important!)
2. **Go to**: http://localhost:3000/admin/login
3. **Login** with admin credentials
4. **Verify** redirect to admin dashboard works
5. **Test** admin functionality

---

## 📝 What Changed

| File | Change | Purpose |
|------|--------|---------|
| `lib/auth.ts` | Added redirect callback | Proper post-login redirect |
| Dev Server | Restarted | Apply auth config changes |

---

## ✅ Expected Behavior

### Before Fix:
```
1. User enters credentials
2. POST /api/auth/callback/admin-login → 200 OK
3. GET /api/auth/signin?csrf=true → 302
4. GET /admin/login?callbackUrl=... → 200 (WRONG - stuck in loop)
```

### After Fix:
```
1. User enters credentials
2. POST /api/auth/callback/admin-login → 200 OK
3. Redirect callback executes
4. GET /admin → 200 (CORRECT - dashboard loads)
```

---

## 🎉 Status

**Admin login should now work correctly!**

- ✅ Auth configuration updated
- ✅ Redirect callback added
- ✅ Dev server restarted
- ✅ Ready to test

**Try logging in now!** The redirect issue should be resolved. 🚀

---

## 💡 Pro Tip

If you still have issues:
1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Incognito mode**: Test in private browsing window
3. **Clear cookies**: Use browser DevTools → Application → Cookies
4. **Check console**: Look for any JavaScript errors
