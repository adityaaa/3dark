// app/checkout/CheckoutClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { CheckoutFormData } from "@/lib/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutClient() {
  const { items, total: cartTotal, clear } = useCart();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<any>(null);

  // Fetch customer data if logged in
  useEffect(() => {
    if (session?.user?.email && (session.user as any).role === "customer") {
      fetch("/api/customer/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.customer) {
            setCustomerData(data.customer);
            // Pre-fill form with customer data
            setFormData({
              name: data.customer.name || "",
              email: data.customer.email || "",
              phone: data.customer.phone || "",
              address: data.customer.address || "",
              city: data.customer.city || "",
              state: data.customer.state || "",
              pincode: data.customer.pincode || "",
              notes: "",
            });
          }
        })
        .catch((err) => console.error("Failed to fetch customer data:", err));
    }
  }, [session]);

  // Free shipping for all orders
  const shipping = 0;
  const total = cartTotal;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("processing");
    setError(null);

    try {
      // Create order
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            price: i.product.price,
            qty: i.qty,
            size: i.size,
          })),
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create order");
      }

      // Handle COD
      if (paymentMethod === "cod") {
        clear();
        setStatus("done");
        router.push(`/order-success?orderNumber=${data.orderNumber}`);
        return;
      }

      // Handle Razorpay
      if (data.method === "razorpay" && data.razorpayOrderId) {
        const options = {
          key: data.keyId,
          amount: data.amount * 100,
          currency: data.currency,
          order_id: data.razorpayOrderId,
          name: "3Dark",
          description: `Order ${data.orderNumber}`,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#C3FF3C",
          },
          handler: async function (response: any) {
            // Verify payment
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              clear();
              setStatus("done");
              router.push(`/order-success?orderNumber=${verifyData.orderNumber}`);
            } else {
              throw new Error("Payment verification failed");
            }
          },
          modal: {
            ondismiss: function () {
              setStatus("idle");
              setError("Payment cancelled");
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setError(err.message || "Something went wrong");
    }
  }

  if (items.length === 0 && status !== "done") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="mt-4 text-sm text-white/70">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      {/* Delivery Information Banner - Professional & Simple */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-500/30 p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">📦</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-white mb-3">
              Delivery Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-neon font-bold">✓</span>
                <div>
                  <p className="font-semibold text-white">Processing Time</p>
                  <p className="text-white/70">2-3 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-neon font-bold">✓</span>
                <div>
                  <p className="font-semibold text-white">Quality Checked</p>
                  <p className="text-white/70">Inspected before shipping</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-neon font-bold">✓</span>
                <div>
                  <p className="font-semibold text-white">Free Shipping</p>
                  <p className="text-white/70">On all orders</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-neon font-bold">✓</span>
                <div>
                  <p className="font-semibold text-white">Expected Delivery</p>
                  <p className="text-white/70">5-7 business days</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-white/60 bg-black/20 px-3 py-2 rounded border border-white/10">
              💡 Need it faster? We&apos;re working on express delivery options!
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left - Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="rounded-2xl bg-black/60 p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs text-white/60">Full Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-neon/60"
                />
              </div>
              <div>
                <label className="text-xs text-white/60">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-neon/60"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-white/60">Phone Number *</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-neon/60"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-2xl bg-black/60 p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-neon/60"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-xs text-white/60">City *</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-neon/60"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60">State *</label>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-neon/60"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60">Pincode *</label>
                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-neon/60"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/60">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-neon/60"
                  placeholder="Any special instructions..."
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-2xl bg-black/60 p-6 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  className="accent-neon"
                />
                <span className="text-sm">💳 UPI / Cards / Netbanking (Razorpay)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-neon"
                />
                <span className="text-sm">💵 Cash on Delivery</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-950/40 border border-red-500/40 p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "processing"}
            className="w-full rounded-full bg-neon px-6 py-3 text-sm font-semibold text-black shadow-glow hover:brightness-95 disabled:opacity-60"
          >
            {status === "processing"
              ? "Processing..."
              : paymentMethod === "cod"
              ? `Place Order - ₹${total}`
              : `Pay ₹${total} Securely`}
          </button>
        </form>

        {/* Right - Order Summary */}
        <div className="rounded-2xl bg-black/60 p-6 border border-white/10 h-fit sticky top-4">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.product.id + i.size} className="flex gap-3 text-xs">
                <div className="flex-1">
                  <p className="font-medium">{i.product.name}</p>
                  <p className="text-white/60">
                    Size: {i.size} × {i.qty}
                  </p>
                </div>
                <p className="font-semibold">₹{i.product.price * i.qty}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Shipping</span>
              <span className="text-green-500">FREE</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-white/10">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
