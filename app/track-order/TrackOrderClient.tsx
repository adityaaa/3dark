"use client";

import { useState } from "react";
import { Package, Search, CheckCircle2, Truck, MapPin, Clock } from "lucide-react";

interface OrderStatus {
  orderNumber: string;
  status: string;
  items: Array<{
    name: string;
    qty: number;
    price: number;
  }>;
  total: number;
  customerName: string;
  customerPhone: string;
  address: string;
  createdAt: string;
  estimatedDelivery?: string;
}

export default function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState("");

  async function handleTrackOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`
      );
      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(
          data.error || "Order not found. Please check your order number and phone number."
        );
      }
    } catch (err) {
      setError("Failed to track order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const getStatusSteps = (status: string) => {
    const steps = [
      { label: "Order Placed", icon: CheckCircle2, status: "placed" },
      { label: "Processing", icon: Package, status: "processing" },
      { label: "Shipped", icon: Truck, status: "shipped" },
      { label: "Delivered", icon: MapPin, status: "delivered" },
    ];

    const statusOrder = ["placed", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(status.toLowerCase());

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon/10 border border-neon/30 mb-4">
            <Package className="w-8 h-8 text-neon" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Track Your Order</h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Enter your order number and phone number to check your order status and estimated
            delivery time.
          </p>
        </div>

        {/* Track Order Form */}
        <form
          onSubmit={handleTrackOrder}
          className="bg-bg-soft border border-white/10 rounded-2xl p-6 md:p-8 mb-8"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-white/80 mb-2">
                Order Number *
              </label>
              <input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., ORD-2026-00123"
                required
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 text-white placeholder:text-white/40 focus:border-neon/50 focus:outline-none transition-colors"
              />
              <p className="text-xs text-white/50 mt-1">
                You can find this in your order confirmation email
              </p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., 9876543210"
                required
                pattern="[0-9]{10}"
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 text-white placeholder:text-white/40 focus:border-neon/50 focus:outline-none transition-colors"
              />
              <p className="text-xs text-white/50 mt-1">
                Enter the phone number used while placing the order
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-950/40 border border-red-500/40 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-neon text-black font-semibold hover:brightness-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Order Status */}
        {order && (
          <div className="space-y-6">
            {/* Order Info Card */}
            <div className="bg-bg-soft border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Order {order.orderNumber}</h2>
                  <p className="text-sm text-white/60">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/30">
                    <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                    <span className="text-sm font-semibold text-neon capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="mb-8">
                <div className="flex items-center justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/10">
                    <div
                      className="h-full bg-neon transition-all duration-500"
                      style={{
                        width: `${(getStatusSteps(order.status).filter((s) => s.completed).length - 1) * 33.33}%`,
                      }}
                    />
                  </div>

                  {/* Steps */}
                  {getStatusSteps(order.status).map((step) => (
                    <div key={step.status} className="flex flex-col items-center relative z-10">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                          step.completed
                            ? "bg-neon border-neon text-black"
                            : "bg-bg border-white/20 text-white/40"
                        }`}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 text-center ${
                          step.completed ? "text-white font-medium" : "text-white/40"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Delivery */}
              {order.estimatedDelivery && order.status !== "delivered" && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-950/30 border border-blue-500/30">
                  <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Estimated Delivery</p>
                    <p className="text-sm text-white/70">
                      {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white/80 mb-2">Delivery Address</h3>
                <p className="text-sm text-white/70">{order.customerName}</p>
                <p className="text-sm text-white/70">{order.customerPhone}</p>
                <p className="text-sm text-white/70 mt-1">{order.address}</p>
              </div>

              {/* Order Items */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white/80 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-white/70">
                        {item.name} x {item.qty}
                      </span>
                      <span className="font-medium">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-3 mt-3 border-t border-white/10">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-neon">₹{order.total}</span>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-bg-soft border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-white/70 mb-4">
                If you have any questions about your order, feel free to contact us.
              </p>
              <a
                href="https://wa.me/919425322743"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-neon hover:underline"
              >
                Contact Support on WhatsApp →
              </a>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!order && (
          <div className="text-center">
            <p className="text-sm text-white/60 mb-2">Can&apos;t find your order number?</p>
            <p className="text-xs text-white/50">
              Check your email inbox for the order confirmation email from 3Dark.
              <br />
              Or contact us on{" "}
              <a
                href="https://wa.me/919425322743"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon hover:underline"
              >
                WhatsApp
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
