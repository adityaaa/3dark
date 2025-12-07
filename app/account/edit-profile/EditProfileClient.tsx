// app/account/edit-profile/EditProfileClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
};

export default function EditProfileClient({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/account"), 1500);
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link href="/account" className="text-[#C3FF3C] hover:underline text-sm">
          ← Back to Account
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <div className="bg-white/5 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
              Email (cannot be changed)
            </label>
            <input
              id="email"
              type="email"
              value={customer.email}
              disabled
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white/50 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
              Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C3FF3C]"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C3FF3C]"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg text-sm">
              Profile updated successfully! Redirecting...
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href="/account"
              className="flex-1 text-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#C3FF3C] text-black font-semibold rounded-lg hover:bg-[#b3ef2c] transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
