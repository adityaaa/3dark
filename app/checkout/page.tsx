"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">(
    "idle"
  );

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return;

    setStatus("processing");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            price: i.product.price,
            qty: i.qty,
            size: i.size
          })),
          total
        })
      });
      const data = await res.json();

      if (data.ok) {
        setStatus("done");
        clear();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (!items.length && status !== "done") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="mt-4 text-sm text-white/70">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <form onSubmit={handleCheckout} className="space-y-3">
          <div>
            <label className="text-xs text-white/60">Full name</label>
            <input
              required
              className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-neon/60"
            />
          </div>
          <div>
            <label className="text-xs text-white/60">Phone</label>
            <input
              required
              className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-neon/60"
            />
          </div>
          <div>
            <label className="text-xs text-white/60">Address</label>
            <textarea
              required
              className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-neon/60"
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs text-white/60">Pincode</label>
            <input
              required
              className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-neon/60"
            />
          </div>

          <button
            type="submit"
            disabled={status === "processing"}
            className="mt-2 w-full rounded-full bg-neon px-5 py-2 text-sm font-semibold text-black shadow-glow hover:brightness-95 disabled:opacity-60"
          >
            {status === "processing"
              ? "Processing payment…"
              : `Pay ₹${total} securely`}
          </button>

          {status === "done" && (
            <p className="text-xs text-neon mt-2">
              Order placed successfully (dummy flow). Wire Razorpay next.
            </p>
          )}
          {status === "error" && (
            <p className="text-xs text-red-400 mt-2">
              Payment failed (dummy). Check server logs / Razorpay config.
            </p>
          )}
        </form>

        <div className="rounded-2xl bg-bg-soft/80 p-4 border border-white/10">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <ul className="mt-3 space-y-2 text-xs text-white/75">
            {items.map((i) => (
              <li
                key={i.product.id + i.size}
                className="flex justify-between gap-2"
              >
                <span>
                  {i.product.name} ({i.size}) × {i.qty}
                </span>
                <span>₹{i.product.price * i.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <p className="mt-2 text-[11px] text-white/50">
            Shipping & taxes calculated based on your address. Razorpay will be
            used for secure payment.
          </p>
        </div>
      </div>
    </div>
  );
}
