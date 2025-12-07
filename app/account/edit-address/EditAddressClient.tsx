// app/account/edit-address/EditAddressClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Customer = {
  id: number;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
};

export default function EditAddressClient({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [address, setAddress] = useState(customer.address || "");
  const [city, setCity] = useState(customer.city || "");
  const [state, setState] = useState(customer.state || "");
  const [pincode, setPincode] = useState(customer.pincode || "");
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
        body: JSON.stringify({ address, city, state, pincode }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/account"), 1500);
      } else {
        setError(data.error || "Failed to update address");
      }
    } catch (err) {
      setError("Failed to update address. Please try again.");
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

      <h1 className="text-3xl font-bold mb-6">Edit Shipping Address</h1>

      <div className="bg-white/5 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-white/70 mb-2">
              Street Address *
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C3FF3C]"
              placeholder="House no., Street, Area"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-white/70 mb-2">
                City *
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C3FF3C]"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-white/70 mb-2">
                State *
              </label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C3FF3C]"
              />
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-white/70 mb-2">
                Pincode *
              </label>
              <input
                id="pincode"
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
                pattern="[0-9]{6}"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C3FF3C]"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg text-sm">
              Address updated successfully! Redirecting...
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
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
