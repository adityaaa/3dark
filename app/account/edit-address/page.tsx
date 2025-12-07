// app/account/edit-address/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EditAddressClient from "./EditAddressClient";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Edit Address - 3Dark",
  description: "Update your shipping address",
};

export default async function EditAddressPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "customer") {
    redirect("/login?callbackUrl=/account/edit-address");
  }

  const customer = await prisma.customer.findUnique({
    where: { email: session.user?.email! },
  });

  if (!customer) {
    redirect("/login");
  }

  return <EditAddressClient customer={customer} />;
}
