"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Admin {
  id: number;
  email: string;
  name: string;
}

export default function SettingsForm({ admin }: { admin: Admin }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: admin.name,
    email: admin.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate passwords if changing
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setMessage({ type: "error", text: "New password must be at least 6 characters" });
        setLoading(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match" });
        setLoading(false);
        return;
      }
      if (!formData.currentPassword) {
        setMessage({ type: "error", text: "Current password is required to change password" });
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      setMessage({ type: "success", text: "Settings updated successfully!" });
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Refresh the page to show updated data
      router.refresh();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 rounded-lg p-6">
      {message && (
        <div
          className={`p-4 rounded ${
            message.type === "success"
              ? "bg-green-900/50 text-green-200 border border-green-700"
              : "bg-red-900/50 text-red-200 border border-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Information */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-purple-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="border-t border-gray-800 pt-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <p className="text-sm text-gray-400 mb-4">
          Leave blank if you don't want to change your password.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-purple-500"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-purple-500"
              placeholder="Enter new password (min 6 characters)"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-purple-500"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
