// app/account/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AccountClient from "./AccountClient";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "My Account - 3Dark",
  description: "Manage your orders, profile, and addresses",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not logged in or not a customer
  if (!session || session.user?.role !== "customer") {
    redirect("/login?callbackUrl=/account");
  }

  // Fetch customer data with orders
  const customer = await prisma.customer.findUnique({
    where: { email: session.user.email! },
    include: {
      orders: {
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      reviews: {
        select: {
          id: true,
          orderId: true,
          productId: true,
          rating: true,
          title: true,
          comment: true,
          createdAt: true,
        },
      },
    },
  });

  if (!customer) {
    redirect("/login");
  }

  return <AccountClient customer={customer} />;
}
