import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatDistance } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus === "pending").length,
    processing: orders.filter((o) => o.orderStatus === "processing").length,
    shipped: orders.filter((o) => o.orderStatus === "shipped").length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    cancelled: orders.filter((o) => o.orderStatus === "cancelled").length,
  };

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Orders Management</h1>
          <p className="text-gray-400">Manage and track all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Orders</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <p className="text-yellow-400 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
          </div>
          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <p className="text-blue-400 text-sm mb-1">Processing</p>
            <p className="text-2xl font-bold text-blue-400">{stats.processing}</p>
          </div>
          <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
            <p className="text-purple-400 text-sm mb-1">Shipped</p>
            <p className="text-2xl font-bold text-purple-400">{stats.shipped}</p>
          </div>
          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
            <p className="text-green-400 text-sm mb-1">Delivered</p>
            <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
          </div>
          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
            <p className="text-red-400 text-sm mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Revenue</p>
            <p className="text-2xl font-bold">₹{totalRevenue}</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Order #</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Items</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Payment</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm">{order.orderNumber}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-400">{order.customerEmail}</p>
                          <p className="text-sm text-gray-400">{order.customerPhone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">{order.items.length} item(s)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">₹{order.total}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm capitalize">{order.paymentMethod}</span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-fit ${
                              order.paymentStatus === "paid"
                                ? "bg-green-900/30 text-green-400 border border-green-600/30"
                                : order.paymentStatus === "pending"
                                ? "bg-yellow-900/30 text-yellow-400 border border-yellow-600/30"
                                : "bg-red-900/30 text-red-400 border border-red-600/30"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            order.orderStatus === "delivered"
                              ? "bg-green-900/30 text-green-400 border border-green-600/30"
                              : order.orderStatus === "shipped"
                              ? "bg-purple-900/30 text-purple-400 border border-purple-600/30"
                              : order.orderStatus === "processing"
                              ? "bg-blue-900/30 text-blue-400 border border-blue-600/30"
                              : order.orderStatus === "cancelled"
                              ? "bg-red-900/30 text-red-400 border border-red-600/30"
                              : "bg-yellow-900/30 text-yellow-400 border border-yellow-600/30"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {formatDistance(new Date(order.createdAt), new Date(), {
                          addSuffix: true,
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
