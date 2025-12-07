// app/account/edit-profile/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EditProfileClient from "./EditProfileClient";

export const metadata = {
  title: "Edit Profile - 3Dark",
  description: "Update your profile information",
};

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "customer") {
    redirect("/login?callbackUrl=/account/edit-profile");
  }

  const customer = await prisma.customer.findUnique({
    where: { email: session.user?.email! },
  });

  if (!customer) {
    redirect("/login");
  }

  return <EditProfileClient customer={customer} />;
}
