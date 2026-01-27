// app/account/AccountClient.tsx
"use client";

import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type OrderItem = {
  id: number;
  productId: number;
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
  reviews: Review[];
};

type TabType = "orders" | "profile" | "addresses";
type Review = {
  id: number;
  orderId: number | null;
  productId: number;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: Date;
};
type ReviewDraft = {
  rating: number;
  title: string;
  comment: string;
  open: boolean;
  submitting: boolean;
  submitted: boolean;
  error: string | null;
  success: string | null;
};

export default function AccountClient({ customer }: { customer: Customer }) {
  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, ReviewDraft>>(
    {}
  );

  const reviewIndex = useMemo(() => {
    const map = new Map<string, Review>();
    customer.reviews.forEach((review) => {
      if (review.orderId) {
        map.set(`${review.orderId}:${review.productId}`, review);
      }
    });
    return map;
  }, [customer.reviews]);

  const defaultDraft: ReviewDraft = {
    rating: 5,
    title: "",
    comment: "",
    open: false,
    submitting: false,
    submitted: false,
    error: null,
    success: null,
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

  const getReviewKey = (orderId: number, productId: number) =>
    `${orderId}:${productId}`;

  const getDraft = (key: string, existingReview?: Review) => {
    if (reviewDrafts[key]) {
      return reviewDrafts[key];
    }
    if (existingReview) {
      return {
        ...defaultDraft,
        rating: existingReview.rating,
        title: existingReview.title || "",
        comment: existingReview.comment,
        submitted: true,
      };
    }
    return defaultDraft;
  };

  const updateDraft = (key: string, next: Partial<ReviewDraft>) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [key]: {
        ...defaultDraft,
        ...prev[key],
        ...next,
      },
    }));
  };

  const submitReview = async (
    orderId: number,
    productId: number,
    key: string
  ) => {
    const draft = getDraft(key);
    const comment = draft.comment.trim();

    if (!comment) {
      updateDraft(key, { error: "Please add your review text." });
      return;
    }

    updateDraft(key, { submitting: true, error: null, success: null });

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          productId,
          rating: draft.rating,
          title: draft.title.trim() || null,
          comment,
          customerId: customer.id,
          customerName: customer.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          updateDraft(key, {
            submitting: false,
            submitted: true,
            open: false,
            success: "Review already submitted for this item.",
          });
          return;
        }
        updateDraft(key, {
          submitting: false,
          error: data.error || "Failed to submit review.",
        });
        return;
      }

      updateDraft(key, {
        submitting: false,
        submitted: true,
        open: false,
        rating: 5,
        title: "",
        comment: "",
        success: "Thanks! Your review was submitted.",
      });
    } catch (error) {
      console.error("Review submit error:", error);
      updateDraft(key, {
        submitting: false,
        error: "Failed to submit review.",
      });
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
                  className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition"
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
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedOrder(selectedOrder?.id === order.id ? null : order)
                        }
                        className="mt-3 inline-flex items-center rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 hover:border-[#C3FF3C] hover:text-[#C3FF3C] transition"
                      >
                        {selectedOrder?.id === order.id ? "Hide details" : "View details"}
                      </button>
                    </div>
                  </div>

                  {/* Order Details (expand on click) */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="font-semibold mb-4">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="rounded-lg border border-white/10 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-white/70">
                                  Size: {item.size} | Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold">₹{item.price * item.quantity}</p>
                            </div>

                            {order.orderStatus.toLowerCase() === "delivered" ? (
                              <div className="mt-4 border-t border-white/10 pt-4">
                                {(() => {
                                  const key = getReviewKey(order.id, item.productId);
                                  const existingReview = reviewIndex.get(key);
                                  const draft = getDraft(key, existingReview);

                                  return (
                                    <div>
                                      <div className="flex flex-wrap items-center justify-between gap-3">
                                        <p className="text-sm text-white/70">
                                          Share your review for this item.
                                        </p>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            updateDraft(key, {
                                              open: !draft.open,
                                              error: null,
                                              success: null,
                                              rating: draft.rating,
                                              title: draft.title,
                                              comment: draft.comment,
                                            })
                                          }
                                          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-white/10 hover:bg-white/20 transition disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                          {draft.open
                                            ? "Close"
                                            : existingReview
                                            ? "Edit review"
                                            : "Write review"}
                                        </button>
                                      </div>

                                      {existingReview && !draft.open && !draft.success && !draft.error && (
                                        <p className="mt-2 text-xs text-white/60">
                                          Your review: {existingReview.title || existingReview.comment}
                                        </p>
                                      )}
                                      {draft.success && (
                                        <p className="mt-2 text-xs text-green-400">
                                          {draft.success}
                                        </p>
                                      )}
                                      {draft.error && (
                                        <p className="mt-2 text-xs text-red-400">
                                          {draft.error}
                                        </p>
                                      )}

                                      {draft.open && (
                                        <div className="mt-4 grid gap-3">
                                          <div className="grid gap-2 sm:grid-cols-3">
                                            <label className="text-sm text-white/70">
                                              Rating
                                              <select
                                                value={draft.rating}
                                                onChange={(e) =>
                                                  updateDraft(key, {
                                                    rating: Number(e.target.value),
                                                  })
                                                }
                                                className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#C3FF3C]/60"
                                              >
                                                {[5, 4, 3, 2, 1].map((value) => (
                                                  <option key={value} value={value}>
                                                    {value} Star{value > 1 ? "s" : ""}
                                                  </option>
                                                ))}
                                              </select>
                                            </label>
                                            <label className="text-sm text-white/70 sm:col-span-2">
                                              Title (optional)
                                              <input
                                                value={draft.title}
                                                onChange={(e) =>
                                                  updateDraft(key, { title: e.target.value })
                                                }
                                                className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C3FF3C]/60"
                                                placeholder="Great quality!"
                                              />
                                            </label>
                                          </div>
                                          <label className="text-sm text-white/70">
                                            Review
                                            <textarea
                                              value={draft.comment}
                                              onChange={(e) =>
                                                updateDraft(key, { comment: e.target.value })
                                              }
                                              className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C3FF3C]/60"
                                              rows={3}
                                              placeholder="Tell us what you loved..."
                                            />
                                          </label>
                                          <div>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                submitReview(order.id, item.productId, key)
                                              }
                                              disabled={draft.submitting}
                                              className="px-4 py-2 bg-[#C3FF3C] text-black font-medium rounded-lg hover:bg-[#b3ef2c] transition disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                              {draft.submitting
                                                ? "Submitting..."
                                                : existingReview
                                                ? "Update review"
                                                : "Submit review"}
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>
                            ) : (
                              <p className="mt-3 text-xs text-white/50">
                                Reviews unlock after delivery.
                              </p>
                            )}
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
