// app/checkout/CheckoutClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { CheckoutFormData } from "@/lib/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface GlobalThis {
  Razorpay: any;
}

export default function CheckoutClient() {
  const { items, total: cartTotal, clear } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  
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

  // Fetch customer data if logged in
  useEffect(() => {
    if (session?.user?.email && (session.user as any).role === "customer") {
      fetch("/api/customer/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.customer) {
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
  
  // Determine button text
  const getButtonText = () => {
    if (status === "processing") return "Processing...";
    if (paymentMethod === "cod") return `Place Order - ₹${total}`;
    return `Pay ₹${total} Securely`;
  };

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

        const razorpay = new (globalThis as any).Razorpay(options);
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
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-8 pb-32 md:pb-8">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Checkout</h1>

      {/* Delivery Information Banner - Professional & Simple */}
      <div className="mb-4 md:mb-6 rounded-xl bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-500/30 p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="text-2xl md:text-3xl">📦</div>
          <div className="flex-1">
            <h3 className="font-bold text-base md:text-lg text-white mb-2 md:mb-3">
              Delivery Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
              <div className="flex items-start gap-2">
                <span className="text-neon font-bold text-sm md:text-base">✓</span>
                <div>
                  <p className="font-semibold text-white">Processing Time</p>
                  <p className="text-white/70">2-3 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-neon font-bold text-sm md:text-base">✓</span>
                <div>
                  <p className="font-semibold text-white">Quality Checked</p>
                  <p className="text-white/70">Inspected before shipping</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-neon font-bold text-sm md:text-base">✓</span>
                <div>
                  <p className="font-semibold text-white">Free Shipping</p>
                  <p className="text-white/70">On all orders</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-neon font-bold text-sm md:text-base">✓</span>
                <div>
                  <p className="font-semibold text-white">Expected Delivery</p>
                  <p className="text-white/70">5-7 business days</p>
                </div>
              </div>
            </div>
            <div className="mt-3 md:mt-4 text-[10px] md:text-xs text-white/60 bg-black/20 px-2 md:px-3 py-1.5 md:py-2 rounded border border-white/10">
              💡 Need it faster? We&apos;re working on express delivery options!
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:gap-8 md:grid-cols-3">
        {/* Left - Form */}
        <form id="checkout-form" onSubmit={handleSubmit} className="md:col-span-2 space-y-4 md:space-y-6">
          {/* Contact Information */}
          <div className="rounded-xl md:rounded-2xl bg-black/60 p-4 md:p-6 border border-white/10">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Contact Information</h2>
            <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="checkout-name" className="text-xs text-white/60 font-medium">Full Name *</label>
                <input
                  id="checkout-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 md:px-4 py-2.5 md:py-3 text-sm outline-none focus:border-neon/60 transition min-h-[44px] touch-manipulation"
                />
              </div>
              <div>
                <label htmlFor="checkout-email" className="text-xs text-white/60 font-medium">Email *</label>
                <input
                  id="checkout-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 md:px-4 py-2.5 md:py-3 text-sm outline-none focus:border-neon/60 transition min-h-[44px] touch-manipulation"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="checkout-phone" className="text-xs text-white/60 font-medium">Phone Number *</label>
                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 md:px-4 py-2.5 md:py-3 text-sm outline-none focus:border-neon/60 transition min-h-[44px] touch-manipulation"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl md:rounded-2xl bg-black/60 p-4 md:p-6 border border-white/10">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Shipping Address</h2>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label htmlFor="checkout-address" className="text-xs text-white/60 font-medium">Address *</label>
                <textarea
                  id="checkout-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 md:px-4 py-2.5 md:py-3 text-sm outline-none focus:border-neon/60 transition touch-manipulation resize-none"
                />
              </div>
              <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="checkout-city" className="text-xs text-white/60 font-medium">City *</label>
                  <input
                    id="checkout-city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 md:px-4 py-2.5 md:py-3 text-sm outline-none focus:border-neon/60 transition min-h-[44px] touch-manipulation"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-state" className="text-xs text-white/60 font-medium">State *</label>
                  <input
                    id="checkout-state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 md:px-4 py-2.5 md:py-3 text-sm outline-none focus:border-neon/60 transition min-h-[44px] touch-manipulation"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-pincode" className="text-xs text-white/60 font-medium">Pincode *</label>
                  <input
                    id="checkout-pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                    inputMode="numeric"
                    className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 md:px-4 py-2.5 md:py-3 text-sm outline-none focus:border-neon/60 transition min-h-[44px] touch-manipulation"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="order-notes" className="text-xs text-white/60 font-medium">Order Notes (Optional)</label>
                <textarea
                  id="order-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/40 px-3 md:px-4 py-2.5 md:py-3 text-sm outline-none focus:border-neon/60 transition touch-manipulation resize-none"
                  placeholder="Any special instructions..."
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl md:rounded-2xl bg-black/60 p-4 md:p-6 border border-white/10">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer min-h-[44px] p-2 rounded-lg hover:bg-white/5 transition touch-manipulation">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  className="accent-neon w-4 h-4"
                />
                <span className="text-sm md:text-base">💳 UPI / Cards / Netbanking (Razorpay)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer min-h-[44px] p-2 rounded-lg hover:bg-white/5 transition touch-manipulation">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-neon w-4 h-4"
                />
                <span className="text-sm md:text-base">💵 Cash on Delivery</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-950/40 border border-red-500/40 p-3 text-xs md:text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Desktop Submit Button */}
          <button
            type="submit"
            disabled={status === "processing"}
            className="hidden md:block w-full rounded-full bg-neon px-6 py-3.5 text-sm font-semibold text-black shadow-glow hover:brightness-95 disabled:opacity-60 transition min-h-[48px]"
          >
            {getButtonText()}
          </button>
        </form>

        {/* Right - Order Summary (Desktop Only) */}
        <div className="hidden md:block rounded-2xl bg-black/60 p-6 border border-white/10 h-fit sticky top-24">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
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

      {/* Mobile Fixed Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-40 safe-area-bottom">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400">Total Amount</p>
            <p className="text-xl font-bold">₹{total}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-green-500 font-semibold">FREE Shipping</p>
            <p className="text-xs text-gray-400">{items.length} items</p>
          </div>
        </div>
        <button
          type="submit"
          form="checkout-form"
          disabled={status === "processing"}
          className="w-full rounded-full bg-neon px-6 py-3.5 text-sm font-semibold text-black shadow-glow hover:brightness-95 disabled:opacity-60 transition min-h-[48px] touch-manipulation"
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}
