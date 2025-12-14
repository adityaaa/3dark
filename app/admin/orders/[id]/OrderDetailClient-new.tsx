"use client";

import { useState, useEffect } from "react";
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
  shopNotes: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  confirmedAt: string | null;
  sourcedAt: string | null;
  packedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
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

type Shop = {
  id: number;
  name: string;
  location: string;
  contact: string;
};

export default function OrderDetailClient({ order }: { order: Order }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<number | null>(null);
  const [shopNotes, setShopNotes] = useState(order.shopNotes || "");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl || "");
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  // Fetch shops
  useEffect(() => {
    fetch("/api/admin/shops")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setShops(data.shops);
        }
      })
      .catch((err) => console.error("Failed to fetch shops:", err));
  }, []);

  const handleStatusUpdate = async (newStatus: string, additionalData: any = {}) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: newStatus,
          ...additionalData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.refresh();
        alert("Order updated successfully!");
      } else {
        alert(data.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedShop) {
      alert("Please select a shop");
      return;
    }
    await handleStatusUpdate("confirmed", {
      shopId: selectedShop,
      shopNotes,
    });
  };

  const handleCannotSource = async () => {
    if (!confirm("Are you sure you want to mark this order as unable to source? This will process a refund.")) {
      return;
    }
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/cannot-source`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        router.refresh();
        alert("Refund processed successfully!");
      } else {
        alert(data.error || "Failed to process refund");
      }
    } catch (error) {
      console.error("Refund error:", error);
      alert("Failed to process refund");
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAsShipped = async () => {
    if (!trackingNumber) {
      alert("Please enter a tracking number");
      return;
    }
    await handleStatusUpdate("shipped", {
      trackingNumber,
      trackingUrl,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-900/30 text-green-400 border-green-600/30";
      case "shipped":
        return "bg-purple-900/30 text-purple-400 border-purple-600/30";
      case "packing":
        return "bg-indigo-900/30 text-indigo-400 border-indigo-600/30";
      case "sourcing":
        return "bg-blue-900/30 text-blue-400 border-blue-600/30";
      case "confirmed":
        return "bg-cyan-900/30 text-cyan-400 border-cyan-600/30";
      case "pending_confirmation":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-600/30";
      case "cancelled":
      case "refunded":
        return "bg-red-900/30 text-red-400 border-red-600/30";
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-600/30";
    }
  };

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const canConfirm = order.orderStatus === "pending_confirmation";
  const canSource = order.orderStatus === "confirmed";
  const canPack = order.orderStatus === "sourcing";
  const canShip = order.orderStatus === "packing";
  const canDeliver = order.orderStatus === "shipped";

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
            {/* Workflow Actions */}
            {canConfirm && (
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">⏳</span>
                  Pending Confirmation - Check Shop Availability
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Select Shop *
                    </label>
                    <select
                      value={selectedShop || ""}
                      onChange={(e) => setSelectedShop(Number(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="">Choose a shop...</option>
                      {shops.map((shop) => (
                        <option key={shop.id} value={shop.id}>
                          {shop.name} - {shop.location} ({shop.contact})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Notes (Shop coordination details)
                    </label>
                    <textarea
                      value={shopNotes}
                      onChange={(e) => setShopNotes(e.target.value)}
                      rows={3}
                      placeholder="e.g., Called Shop A at 2pm, confirmed available..."
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleConfirmOrder}
                      disabled={updating || !selectedShop}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-3 rounded-lg transition-colors font-semibold"
                    >
                      ✅ Confirm Available - Start Sourcing
                    </button>
                    <button
                      onClick={handleCannotSource}
                      disabled={updating}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 px-4 py-3 rounded-lg transition-colors font-semibold"
                    >
                      ❌ Cannot Source - Refund
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sourcing Actions */}
            {canSource && (
              <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-600/30 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔍</span>
                  Ready to Source
                </h2>
                <p className="text-gray-300 mb-4">
                  Item confirmed available. Retrieve from shop and mark as received.
                </p>
                <button
                  onClick={() => handleStatusUpdate("sourcing", { shopNotes })}
                  disabled={updating}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                  🚗 Mark as Sourcing (Picking Up)
                </button>
              </div>
            )}

            {/* Packing Actions */}
            {canPack && (
              <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-600/30 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">📦</span>
                  Item Received - Ready to Pack
                </h2>
                <p className="text-gray-300 mb-4">
                  Item sourced from shop. Perform quality check and pack securely.
                </p>
                <button
                  onClick={() => handleStatusUpdate("packing")}
                  disabled={updating}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                  📦 Mark as Packing
                </button>
              </div>
            )}

            {/* Shipping Actions */}
            {canShip && (
              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-600/30 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🚚</span>
                  Packed - Ready to Ship
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Tracking Number *
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter courier tracking number"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Tracking URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={trackingUrl}
                      onChange={(e) => setTrackingUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <button
                    onClick={handleMarkAsShipped}
                    disabled={updating || !trackingNumber}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-colors font-semibold"
                  >
                    🚚 Mark as Shipped
                  </button>
                </div>
              </div>
            )}

            {/* Delivery Action */}
            {canDeliver && (
              <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-600/30 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  Out for Delivery
                </h2>
                <p className="text-gray-300 mb-4">
                  Tracking: <span className="font-mono text-sm">{order.trackingNumber}</span>
                </p>
                <button
                  onClick={() => handleStatusUpdate("delivered")}
                  disabled={updating}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 px-6 py-3 rounded-lg transition-colors font-semibold"
                >
                  ✅ Mark as Delivered
                </button>
              </div>
            )}

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
                        Size: {item.size} × {item.quantity}
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
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="font-medium text-sm">{order.customerEmail}</p>
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
            {(order.notes || order.shopNotes) && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Notes</h2>
                {order.notes && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">Customer Notes:</p>
                    <p className="text-gray-300">{order.notes}</p>
                  </div>
                )}
                {order.shopNotes && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Shop Coordination:</p>
                    <p className="text-gray-300">{order.shopNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Current Status</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Order Status</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {getStatusLabel(order.orderStatus)}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Payment Status</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${
                      order.paymentStatus === "paid"
                        ? "bg-green-900/30 text-green-400 border-green-600/30"
                        : "bg-yellow-900/30 text-yellow-400 border-yellow-600/30"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {order.confirmedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-medium">Confirmed</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(order.confirmedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {order.sourcedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-medium">Sourced</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(order.sourcedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {order.packedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-medium">Packed</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(order.packedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {order.shippedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-medium">Shipped</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(order.shippedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {order.deliveredAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-medium">Delivered</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(order.deliveredAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tracking Info */}
            {order.trackingNumber && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Tracking Info</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400">Tracking Number</p>
                    <p className="font-mono">{order.trackingNumber}</p>
                  </div>
                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Track Shipment →
                    </a>
                  )}
                </div>
              </div>
            )}

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
