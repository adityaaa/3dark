import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';

/**
 * TEMPORARY ENDPOINT - Setup admin account in production database
 * 
 * ⚠️ DELETE THIS FILE AFTER USE FOR SECURITY!
 * 
 * Usage:
 *   POST /api/admin/setup
 *   Body: { "secret": "your-setup-secret" }
 */

export async function POST(request: Request) {
  try {
    // Get the setup secret from request body
    const body = await request.json();
    const { secret, password, email } = body;
    
    // Security check - verify setup secret
    const expectedSecret = process.env.ADMIN_SETUP_SECRET;
    
    if (!expectedSecret) {
      return NextResponse.json({ 
        error: 'Setup not configured',
        message: 'ADMIN_SETUP_SECRET environment variable is not set'
      }, { status: 500 });
    }
    
    if (secret !== expectedSecret) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Invalid setup secret'
      }, { status: 401 });
    }

    // Admin credentials (allow custom email and password)
    const adminEmail = email || 'admin@3dark.in';
    const adminPassword = password || 'admin123'; // Use provided password or default
    const adminName = 'Admin';

    // Check if admin already exists
    const existingAdmin = await db.admin.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      // Admin exists, update password
      const hashedPassword = await hash(adminPassword, 10);
      
      const updated = await db.admin.update({
        where: { id: existingAdmin.id },
        data: { password: hashedPassword }
      });

      return NextResponse.json({ 
        success: true,
        message: 'Admin account already exists. Password has been reset.',
        admin: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          createdAt: updated.createdAt
        },
        credentials: {
          email: adminEmail,
          password: adminPassword,
          loginUrl: '/admin/login'
        }
      });
    }

    // Create new admin account
    const hashedPassword = await hash(adminPassword, 10);
    
    const admin = await db.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Admin account created successfully!',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        createdAt: admin.createdAt
      },
      credentials: {
        email: adminEmail,
        password: adminPassword,
        loginUrl: '/admin/login'
      },
      warning: '⚠️ DELETE /app/api/admin/setup AFTER USE!'
    });

  } catch (error) {
    console.error('❌ Admin setup error:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create admin account',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    message: 'Admin setup endpoint is active',
    warning: '⚠️ This endpoint should be deleted after admin setup is complete!',
    usage: 'POST with { "secret": "your-setup-secret" } in body'
  });
}
