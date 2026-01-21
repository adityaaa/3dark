"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ResponsiveTable from "@/components/admin/ResponsiveTable";
import CustomerCard from "@/components/admin/CustomerCard";

type Order = {
  id: number;
  total: number;
  orderStatus: string;
  createdAt: string;
};

type Customer = {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  createdAt: string;
  totalSpent: number;
  orders: Order[];
  _count: {
    orders: number;
    reviews: number;
  };
};

export default function CustomersClient({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "spending" | "orders">("recent");

  // Filter customers by search term
  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search)
    );
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case "spending":
        return b.totalSpent - a.totalSpent;
      case "orders":
        return b._count.orders - a._count.orders;
      case "recent":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c._count.orders, 0) || 0;

  // Desktop table
  const desktopTable = (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                Customer
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                Contact
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                Location
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">
                Orders
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">
                Reviews
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">
                Total Spent
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  {searchTerm ? "No customers found matching your search" : "No customers yet"}
                </td>
              </tr>
            ) : (
              sortedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/customers/${customer.id}`)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-400">{customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{customer.phone || "-"}</p>
                  </td>
                  <td className="px-6 py-4">
                    {customer.city && customer.state ? (
                      <div className="text-sm">
                        <p>{customer.city}</p>
                        <p className="text-gray-400">{customer.state}</p>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded text-sm bg-blue-900/30 text-blue-400 border border-blue-600/30">
                      {customer._count.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded text-sm bg-yellow-900/30 text-yellow-400 border border-yellow-600/30">
                      {customer._count.reviews}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-semibold text-green-400">
                      ₹{customer.totalSpent.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-400">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Mobile cards
  const mobileCards = (
    <>
      {sortedCustomers.length === 0 ? (
        <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400">
          {searchTerm ? "No customers found matching your search" : "No customers yet"}
        </div>
      ) : (
        sortedCustomers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Customers</h1>
          <p className="text-gray-400">Manage your customer database</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Customers</p>
                <p className="text-3xl font-bold mt-1">{totalCustomers}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-1">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Order Value</p>
                <p className="text-3xl font-bold mt-1">₹{Math.round(avgOrderValue)}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Search Customers</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
              >
                <option value="recent">Most Recent</option>
                <option value="spending">Highest Spending</option>
                <option value="orders">Most Orders</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <ResponsiveTable desktopTable={desktopTable} mobileCards={mobileCards} />

        {/* Summary */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          Showing {sortedCustomers.length} of {totalCustomers} customers
        </div>
      </div>
    </div>
  );
}
