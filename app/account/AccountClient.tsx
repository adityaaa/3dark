// app/account/AccountClient.tsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type OrderItem = {
  id: number;
  name: string;
  size: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  orderNumber: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: Date;
  items: OrderItem[];
};

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  orders: Order[];
};

type TabType = "orders" | "profile" | "addresses";

export default function AccountClient({ customer }: { customer: Customer }) {
  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-white/70 mt-1">Welcome back, {customer.name}!</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "orders"
              ? "border-b-2 border-[#C3FF3C] text-[#C3FF3C]"
              : "text-white/70 hover:text-white"
          }`}
        >
          Orders ({customer.orders.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "profile"
              ? "border-b-2 border-[#C3FF3C] text-[#C3FF3C]"
              : "text-white/70 hover:text-white"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("addresses")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "addresses"
              ? "border-b-2 border-[#C3FF3C] text-[#C3FF3C]"
              : "text-white/70 hover:text-white"
          }`}
        >
          Addresses
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          {customer.orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/70 mb-4">You haven&apos;t placed any orders yet.</p>
              <Link
                href="/shop"
                className="inline-block px-6 py-3 bg-[#C3FF3C] text-black font-medium rounded-lg hover:bg-[#b3ef2c] transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {customer.orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition cursor-pointer"
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                        <span className={`text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                        <span className={`text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-white/70">
                        {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">₹{order.total}</p>
                      <p className="text-sm text-white/70">{order.items.length} items</p>
                    </div>
                  </div>

                  {/* Order Details (expand on click) */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="font-semibold mb-4">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center">
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
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white/5 rounded-lg p-6 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Name</label>
              <p className="text-lg font-medium">{customer.name}</p>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Email</label>
              <p className="text-lg font-medium">{customer.email}</p>
            </div>
            {customer.phone && (
              <div>
                <label className="block text-sm text-white/70 mb-1">Phone</label>
                <p className="text-lg font-medium">{customer.phone}</p>
              </div>
            )}
            <div className="pt-4">
              <Link
                href="/account/edit-profile"
                className="inline-block px-6 py-3 bg-[#C3FF3C] text-black font-medium rounded-lg hover:bg-[#b3ef2c] transition"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === "addresses" && (
        <div className="bg-white/5 rounded-lg p-6 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-6">Saved Addresses</h2>
          {customer.address ? (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Default Shipping Address</h3>
                <p>{customer.address}</p>
                <p>
                  {customer.city}, {customer.state} - {customer.pincode}
                </p>
              </div>
              <Link
                href="/account/edit-address"
                className="inline-block px-6 py-3 bg-[#C3FF3C] text-black font-medium rounded-lg hover:bg-[#b3ef2c] transition"
              >
                Edit Address
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-white/70 mb-4">No saved addresses yet.</p>
              <Link
                href="/account/edit-address"
                className="inline-block px-6 py-3 bg-[#C3FF3C] text-black font-medium rounded-lg hover:bg-[#b3ef2c] transition"
              >
                Add Address
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
