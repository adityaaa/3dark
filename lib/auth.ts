// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-login",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const admin = await db.admin.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          admin.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: admin.id.toString(),
          email: admin.email,
          name: admin.name,
          role: "admin",
        };
      },
    }),
    CredentialsProvider({
      id: "customer-login",
      name: "Customer",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const customer = await db.customer.findUnique({
          where: { email: credentials.email },
        });

        if (!customer) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          customer.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: customer.id.toString(),
          email: customer.email,
          name: customer.name,
          role: "customer",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("🔄 REDIRECT CALLBACK:", { url, baseUrl });
      
      // If there's a callbackUrl in the query, use it
      if (url.startsWith(baseUrl)) {
        const urlObj = new URL(url);
        const callbackUrl = urlObj.searchParams.get("callbackUrl");
        if (callbackUrl) {
          console.log("✅ Using callbackUrl:", callbackUrl);
          return callbackUrl.startsWith("/") ? `${baseUrl}${callbackUrl}` : callbackUrl;
        }
      }
      
      // Default redirects based on URL path
      if (url.includes("/admin/login") || url.includes("/api/auth/callback/admin-login")) {
        console.log("✅ Admin login detected, redirecting to /admin");
        return `${baseUrl}/admin`;
      }
      
      if (url.includes("/login") || url.includes("/api/auth/callback/customer-login")) {
        console.log("✅ Customer login detected, redirecting to /account");
        return `${baseUrl}/account`;
      }
      
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        console.log("✅ Relative URL, prepending baseUrl");
        return `${baseUrl}${url}`;
      }
      
      // Allows callback URLs on the same origin
      if (url.startsWith(baseUrl)) {
        console.log("✅ Same origin, using as-is");
        return url;
      }
      
      console.log("⚠️ Fallback to baseUrl");
      return baseUrl;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
