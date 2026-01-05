// app/admin/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Get stats
  const [orderCount, productCount, customerCount, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.customer.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  const totalRevenue = await prisma.order.aggregate({
    where: { paymentStatus: "paid" },
    _sum: { total: true },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400">Total Orders</h3>
              <ShoppingCart className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-3xl font-bold">{orderCount}</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400">Products</h3>
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-3xl font-bold">{productCount}</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400">Revenue</h3>
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-3xl font-bold">
              ₹{totalRevenue._sum.total || 0}
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400">Customers</h3>
              <Users className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold">{customerCount}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/admin/orders"
            className="bg-gray-900 hover:bg-gray-800 rounded-lg p-6 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">📦 Manage Orders</h2>
            <p className="text-gray-400">
              View and manage all customer orders, update statuses, and track shipments
            </p>
          </Link>

          <Link
            href="/admin/products"
            className="bg-gray-900 hover:bg-gray-800 rounded-lg p-6 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">🛍️ Manage Products</h2>
            <p className="text-gray-400">
              Add, edit, or remove products from your store catalog
            </p>
          </Link>

          <Link
            href="/admin/customers"
            className="bg-gray-900 hover:bg-gray-800 rounded-lg p-6 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">👥 Customers</h2>
            <p className="text-gray-400">
              View customer list, order history, and analytics
            </p>
          </Link>

          <Link
            href="/admin/inventory"
            className="bg-gray-900 hover:bg-gray-800 rounded-lg p-6 transition-colors border-2 border-neon/30"
          >
            <h2 className="text-2xl font-bold mb-2">📊 Inventory</h2>
            <p className="text-gray-400">
              Track stock levels, update quantities, and manage product availability
            </p>
          </Link>
        </div>

        {/* Additional Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/admin/shops"
            className="bg-gray-900 hover:bg-gray-800 rounded-lg p-6 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">🏪 Partner Shops</h2>
            <p className="text-gray-400">
              Manage your network of partner shops for sourcing products
            </p>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-gray-900 hover:bg-gray-800 rounded-lg p-6 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">⚙️ Settings</h2>
            <p className="text-gray-400">
              Update your profile, change password, and manage account settings
            </p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block bg-gray-800 hover:bg-gray-750 rounded-lg p-4 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm text-gray-400">
                        #{order.orderNumber}
                      </p>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-400">
                        {order.items.length} item(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{order.total}</p>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          order.orderStatus === "delivered"
                            ? "bg-green-900/30 text-green-400"
                            : order.orderStatus === "shipped"
                            ? "bg-purple-900/30 text-purple-400"
                            : order.orderStatus === "processing"
                            ? "bg-blue-900/30 text-blue-400"
                            : "bg-yellow-900/30 text-yellow-400"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
