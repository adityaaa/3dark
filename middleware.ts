// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes - require admin role
    if (path.startsWith("/admin")) {
      if (!token || (token as any).role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    // Customer account routes - require customer role
    if (path.startsWith("/account")) {
      if (!token || (token as any).role !== "customer") {
        return NextResponse.redirect(new URL("/login?callbackUrl=" + path, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Allow access if token exists
        if (token) return true;
        
        // For protected routes, require authentication
        if (path.startsWith("/admin") || path.startsWith("/account")) {
          return false;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all admin routes except the login page
     * Match all account routes
     */
    "/admin/((?!login).*)",
    "/account/:path*",
  ],
};
