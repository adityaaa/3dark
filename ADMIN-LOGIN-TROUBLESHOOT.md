# 🔴 Admin Login Not Working - Troubleshooting

## ✅ Verified Working:
- ✅ Admin account exists: `admin@3dark.com`
- ✅ Password is correct: `admin123` (verified with bcrypt)
- ✅ Database connection works
- ✅ Password hash matches

## ❓ Need to Check:

### 1. What Error Do You See?

When you try to login at http://localhost:3000/admin/login, what happens?

- [ ] "Invalid email or password" error message
- [ ] Page just refreshes and stays on login page
- [ ] Blank/white screen
- [ ] Network error
- [ ] Other: _______

### 2. Browser Console Logs

Open browser DevTools (F12) → Console tab and look for:

**Expected logs:**
```
🔐 Attempting admin login...
📝 Login result: { ok: true, ... }
✅ Login successful! Redirecting to: /admin
```

**If you see error logs:**
```
❌ Login failed: ...
```

**Please copy and paste what you see in the console.**

### 3. Network Tab

Open DevTools (F12) → Network tab:

1. Clear the network log
2. Try logging in
3. Look for: `POST /api/auth/callback/admin-login`
4. Click on it
5. Check:
   - Status code: Should be 200, not 401
   - Response: What does it say?

### 4. Check Terminal Output

Look at your terminal where `npm run dev` is running.

**When you click "Sign In", you should see:**
```
POST /api/auth/callback/admin-login 200 in Xms
```

**If you see:**
```
POST /api/auth/callback/admin-login 401 in Xms
```
Then credentials are being rejected.

---

## 🔧 Quick Diagnostic Commands:

Run these in terminal and send me the output:

### Check admin account:
```bash
sqlite3 prisma/dev.db "SELECT id, email, name FROM Admin;"
```

### Verify password:
```bash
node scripts/verify-admin-password.js
```

### Check which database is being used:
```bash
grep DATABASE_URL .env.local
```

### Check if dev server is running:
```bash
curl -I http://localhost:3000/api/auth/session
```

---

## 🐛 Common Issues:

### Issue 1: Using Wrong Login Page
- ❌ http://localhost:3000/login (customer login)
- ✅ http://localhost:3000/admin/login (admin login)

### Issue 2: Wrong Database
- If .env.local points to wrong database file
- Admin account might be in different database

### Issue 3: Browser Cached Old Data
```bash
# Clear browser:
- Open DevTools (F12)
- Application tab → Storage
- Click "Clear site data"
- Refresh page
```

### Issue 4: Dev Server Not Reloaded
```bash
# Restart dev server:
pkill -f "next dev"
npm run dev
```

---

## 📊 Current Status:

| Component | Status |
|-----------|--------|
| Admin account | ✅ Exists |
| Password | ✅ Valid (admin123) |
| Database | ✅ Connected |
| DATABASE_URL | ✅ Points to prisma/dev.db |
| Dev server | ❓ Need to verify |
| Browser | ❓ Need logs |

---

## 🚨 PLEASE PROVIDE:

1. **Exact error message** you see on screen
2. **Browser console logs** (copy/paste)
3. **Terminal logs** when you click Sign In
4. **Network tab** - status code of the login request

With this information, I can pinpoint the exact issue!

---

## 🎯 Manual Test:

Try this step-by-step:

1. Open fresh incognito/private window
2. Go to: http://localhost:3000/admin/login
3. Open DevTools (F12) → Console tab
4. Enter:
   - Email: `admin@3dark.com`
   - Password: `admin123`
5. Click "Sign In"
6. **Screenshot or copy/paste everything you see**

---

**Waiting for your feedback to diagnose the exact issue!** 🔍
