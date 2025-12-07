"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${orderNumber}&email=${email}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Order not found");
      } else {
        setOrder(data.order);
      }
    } catch (err) {
      setError("Failed to fetch order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-500";
      case "shipped":
        return "text-blue-500";
      case "processing":
        return "text-yellow-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
        <p className="text-white/70">Enter your order details to check status</p>
      </div>

      <div className="bg-white/5 rounded-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium text-white/70 mb-2">
              Order Number *
            </label>
            <input
              id="orderNumber"
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
              placeholder="e.g., 3D-1234567890"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C3FF3C]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C3FF3C]"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C3FF3C] hover:bg-[#b3ef2c] text-black font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>
      </div>

      {order && (
        <div className="bg-white/5 rounded-lg p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Order #{order.orderNumber}</h2>
              <span className={`text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
            </div>
            <p className="text-white/70 text-sm">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 rounded">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-white/70">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Shipping</span>
              <span className="text-green-500">{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Shipping Address</h3>
            <div className="bg-white/5 p-4 rounded">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-white/70 mt-1">{order.shippingAddress}</p>
              <p className="text-sm text-white/70">
                {order.city}, {order.state} - {order.pincode}
              </p>
              <p className="text-sm text-white/70 mt-2">
                Phone: {order.customerPhone}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Payment</h3>
            <div className="bg-white/5 p-4 rounded">
              <p className="text-sm">
                Method: <span className="font-medium capitalize">{order.paymentMethod}</span>
              </p>
              <p className="text-sm mt-1">
                Status:{" "}
                <span className={`font-medium ${order.paymentStatus === "paid" ? "text-green-500" : "text-yellow-500"}`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
