"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: number;
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
};

export default function OrderDetailClient({ order }: { order: Order }) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [updating, setUpdating] = useState(false);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });

      if (res.ok) {
        router.refresh();
        alert("Order updated successfully!");
      } else {
        alert("Failed to update order");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-900/30 text-green-400 border-green-600/30";
      case "shipped":
        return "bg-purple-900/30 text-purple-400 border-purple-600/30";
      case "processing":
        return "bg-blue-900/30 text-blue-400 border-blue-600/30";
      case "cancelled":
        return "bg-red-900/30 text-red-400 border-red-600/30";
      default:
        return "bg-yellow-900/30 text-yellow-400 border-yellow-600/30";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-900/30 text-green-400 border-green-600/30";
      case "failed":
        return "bg-red-900/30 text-red-400 border-red-600/30";
      default:
        return "bg-yellow-900/30 text-yellow-400 border-yellow-600/30";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin/orders")}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Orders
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Order #{order.orderNumber}</h1>
              <p className="text-gray-400">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Print Order
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.price}</p>
                      <p className="text-sm text-gray-400">
                        Total: ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-500">
                    {order.shipping === 0 ? "FREE" : `₹${order.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-800">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="text-gray-300">
                <p>{order.shippingAddress}</p>
                <p>
                  {order.city}, {order.state} - {order.pincode}
                </p>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
                <p className="text-gray-300">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Update */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Update Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Order Status
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors font-semibold"
                >
                  {updating ? "Updating..." : "Update Order"}
                </button>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Current Status</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Order Status</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Payment Status</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">Method</p>
                  <p className="font-medium capitalize">{order.paymentMethod}</p>
                </div>
                {order.razorpayOrderId && (
                  <div>
                    <p className="text-gray-400">Razorpay Order ID</p>
                    <p className="font-mono text-xs break-all">
                      {order.razorpayOrderId}
                    </p>
                  </div>
                )}
                {order.razorpayPaymentId && (
                  <div>
                    <p className="text-gray-400">Razorpay Payment ID</p>
                    <p className="font-mono text-xs break-all">
                      {order.razorpayPaymentId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
