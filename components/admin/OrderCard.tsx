"use client";

import Link from "next/link";
import { formatDistance } from "date-fns";

type OrderCardProps = {
  order: {
    id: number;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string | Date;
    items: any[];
  };
};

export default function OrderCard({ order }: Readonly<OrderCardProps>) {
  const statusColors = {
    delivered: "bg-green-900/30 text-green-400 border-green-600/30",
    shipped: "bg-purple-900/30 text-purple-400 border-purple-600/30",
    processing: "bg-blue-900/30 text-blue-400 border-blue-600/30",
    cancelled: "bg-red-900/30 text-red-400 border-red-600/30",
    pending: "bg-yellow-900/30 text-yellow-400 border-yellow-600/30",
  };

  const paymentColors = {
    paid: "bg-green-900/30 text-green-400 border-green-600/30",
    pending: "bg-yellow-900/30 text-yellow-400 border-yellow-600/30",
    failed: "bg-red-900/30 text-red-400 border-red-600/30",
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatDistance(new Date(order.createdAt), new Date(), { addSuffix: true })}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
            statusColors[order.orderStatus as keyof typeof statusColors] || statusColors.pending
          }`}
        >
          {order.orderStatus}
        </span>
      </div>

      {/* Customer Info */}
      <div className="border-t border-gray-800 pt-3">
        <p className="text-sm font-medium">{order.customerName}</p>
        <p className="text-xs text-gray-400">{order.customerEmail}</p>
        <p className="text-xs text-gray-400">{order.customerPhone}</p>
      </div>

      {/* Order Details */}
      <div className="border-t border-gray-800 pt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-400">Items</p>
          <p className="text-sm font-medium">{order.items.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-sm font-semibold">₹{order.total}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Payment</p>
          <p className="text-sm capitalize">{order.paymentMethod}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Status</p>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
              paymentColors[order.paymentStatus as keyof typeof paymentColors] || paymentColors.pending
            }`}
          >
            {order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="border-t border-gray-800 pt-3">
        <Link
          href={`/admin/orders/${order.id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
