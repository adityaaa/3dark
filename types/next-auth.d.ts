// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: "admin" | "customer";
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "admin" | "customer";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "customer";
  }
}
