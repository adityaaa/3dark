# 🚀 Production Admin Setup Guide

**Date**: January 6, 2026  
**Issue**: Admin login fails in production because the admin account doesn't exist in the production PostgreSQL database.

---

## 🔍 The Problem:

Your **local database** (SQLite at `prisma/dev.db`) has the admin account, but your **production database** (PostgreSQL on Vercel) is empty and doesn't have any admin users yet.

---

## ✅ Solution: Create Admin Account in Production

### Option 1: Using Vercel CLI (Recommended)

#### Step 1: Install dependencies (if not done)
```bash
npm install
```

#### Step 2: Run the setup script with production database URL
```bash
# Get your production DATABASE_URL from Vercel dashboard
# Then run:
DATABASE_URL="your-production-postgres-url" node scripts/setup-production-admin.js
```

**Where to find DATABASE_URL:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Copy the `DATABASE_URL` value

---

### Option 2: Using Vercel Dashboard (Alternative)

If you can't run the script locally with the production database URL, you can create an API endpoint:

#### Step 1: Create a setup API endpoint

Create: `app/api/admin/setup/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Check if setup is allowed (for security)
    const { secret } = await request.json();
    
    // Use a secret key to prevent unauthorized access
    if (secret !== process.env.ADMIN_SETUP_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if admin already exists
    const existingAdmin = await db.admin.findUnique({
      where: { email: 'admin@3dark.in' }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin already exists',
        email: existingAdmin.email 
      });
    }

    // Create admin account
    const hashedPassword = await hash('admin123', 10);
    
    const admin = await db.admin.create({
      data: {
        email: 'admin@3dark.in',
        password: hashedPassword,
        name: 'Admin'
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Admin account created',
      email: admin.email,
      createdAt: admin.createdAt
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      error: 'Failed to create admin account',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
```

#### Step 2: Add secret to Vercel environment variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `ADMIN_SETUP_SECRET` = `your-random-secret-key-123`

#### Step 3: Call the setup endpoint
```bash
curl -X POST https://your-site.vercel.app/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-random-secret-key-123"}'
```

#### Step 4: Delete the setup endpoint after use (important for security!)
Remove the `app/api/admin/setup` folder after setup is complete.

---

### Option 3: Quick Fix - Run Script Locally

Since you have the script ready, here's the fastest way:

```bash
# 1. Get your production DATABASE_URL from Vercel dashboard
# 2. Run this command (replace with your actual URL):

DATABASE_URL="postgresql://user:password@host:5432/database" node scripts/setup-production-admin.js
```

**Example:**
```bash
DATABASE_URL="postgresql://default:abc123@ep-cool-sun-123456.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require" node scripts/setup-production-admin.js
```

---

## 🎯 After Setup - Login Credentials:

| Field | Value |
|-------|-------|
| **URL** | `https://your-site.vercel.app/admin/login` |
| **Email** | `admin@3dark.in` |
| **Password** | `admin123` |

---

## 🔒 Security Recommendations:

1. **Change the default password** after first login
2. **Delete any setup API endpoints** after use
3. **Don't commit DATABASE_URL** to git
4. **Use strong passwords** in production

---

## 🐛 Troubleshooting:

### "Can't reach database server"
- Check that DATABASE_URL is correct
- Make sure PostgreSQL is accessible from your network
- Verify SSL mode is included in connection string

### "Admin already exists"
- The script will update the password if admin exists
- Try logging in with the credentials again

### "Script doesn't run"
- Make sure you have Node.js installed
- Run `npm install` first to get dependencies
- Check that bcryptjs is installed: `npm list bcryptjs`

---

## 📋 Next Steps:

1. ✅ Choose one of the options above
2. ✅ Create admin account in production
3. ✅ Test login at production URL
4. ✅ Change password after first login
5. ✅ Remove any temporary setup scripts/endpoints

---

**Need help?** Share:
- Which option you chose
- Any error messages you see
- Your Vercel project URL
