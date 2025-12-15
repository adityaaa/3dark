"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  
  const handleLogout = async () => {
    // Sign out and redirect
    await signOut({ 
      callbackUrl: "/admin/login",
      redirect: true 
    });
    
    // Force reload to clear any cached data
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
      title="Logout"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Logout</span>
    </button>
  );
}
