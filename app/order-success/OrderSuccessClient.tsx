// app/order-success/OrderSuccessClient.tsx
"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function OrderSuccessClient({ orderNumber }: { orderNumber?: string }) {
  const { data: session } = useSession();
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isCustomer = session?.user && (session.user as any).role === "customer";
  const canCreateAccount = !isCustomer && orderNumber;

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/create-from-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to create account");
      } else {
        setAccountCreated(true);
        setShowCreateAccount(false);
      }
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center mb-8">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-green-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-white/70">Thank you for your order</p>
      </div>

      {orderNumber && (
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <div className="text-center">
            <p className="text-white/70 mb-2">Your Order Number</p>
            <p className="text-2xl font-bold text-[#C3FF3C]">{orderNumber}</p>
            <p className="text-sm text-white/70 mt-4">
              A confirmation email has been sent to your email address with order details.
            </p>
          </div>
        </div>
      )}

      {/* Create Account Section (for guest checkouts) */}
      {canCreateAccount && !accountCreated && (
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          {!showCreateAccount ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Create an Account</h2>
              <p className="text-white/70 text-sm mb-4">
                Save your order details and enjoy faster checkout next time!
              </p>
              <button
                onClick={() => setShowCreateAccount(true)}
                className="px-6 py-3 bg-[#C3FF3C] text-black font-semibold rounded-lg hover:bg-[#b3ef2c] transition"
              >
                Create Account
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Create Your Account</h2>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm text-white/70 mb-2">
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C3FF3C]"
                    placeholder="At least 6 characters"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm text-white/70 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C3FF3C]"
                    placeholder="Confirm your password"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateAccount(false)}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-[#C3FF3C] text-black font-semibold rounded-lg hover:bg-[#b3ef2c] transition disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {accountCreated && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6 text-center">
          🎉 Account created successfully! You can now{" "}
          <Link href="/login" className="underline font-semibold">
            login
          </Link>{" "}
          to view your orders.
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {isCustomer && (
          <Link
            href="/account"
            className="flex-1 text-center px-6 py-3 bg-[#C3FF3C] text-black font-semibold rounded-lg hover:bg-[#b3ef2c] transition"
          >
            View My Orders
          </Link>
        )}
        {!isCustomer && orderNumber && (
          <Link
            href={`/track-order?orderNumber=${orderNumber}`}
            className="flex-1 text-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition"
          >
            Track Order
          </Link>
        )}
        <Link
          href="/shop"
          className="flex-1 text-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
