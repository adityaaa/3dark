// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes - require admin role
    if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
      if (!token || (token as any).role !== "admin") {
        const loginUrl = new URL("/admin/login", req.url);
        loginUrl.searchParams.set("callbackUrl", path);
        return NextResponse.redirect(loginUrl);
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
        
        // Always allow login pages
        if (path === "/admin/login" || path === "/login") {
          return true;
        }
        
        // For protected admin routes, require admin token
        if (path.startsWith("/admin")) {
          return !!token && (token as any).role === "admin";
        }
        
        // For protected account routes, require customer token
        if (path.startsWith("/account")) {
          return !!token && (token as any).role === "customer";
        }
        
        // Allow all other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all admin routes
     * Match all account routes
     * Exclude static files and api routes
     */
    "/admin/:path*",
    "/account/:path*",
  ],
};
