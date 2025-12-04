// app/admin/settings/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import SettingsForm from "./SettingsForm";

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  // Get current admin user
  const admin = await db.admin.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Settings</h1>

        <div className="max-w-2xl">
          <SettingsForm admin={admin} />
        </div>
      </div>
    </div>
  );
}
