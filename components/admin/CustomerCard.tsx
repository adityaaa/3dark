"use client";

import { useRouter } from "next/navigation";

type CustomerCardProps = {
  readonly customer: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    city: string | null;
    state: string | null;
    totalSpent: number;
    _count: {
      orders: number;
      reviews: number;
    };
    createdAt: string;
  };
};

export default function CustomerCard({ customer }: CustomerCardProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/admin/customers/${customer.id}`)}
      className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-neon/50 transition-colors cursor-pointer space-y-3 w-full text-left focus:outline-none focus:ring-2 focus:ring-neon"
      aria-label={`View details for ${customer.name}`}
    >
      {/* Header */}
      <div>
        <p className="font-medium">{customer.name}</p>
        <p className="text-sm text-gray-400">{customer.email}</p>
        {customer.phone && (
          <p className="text-sm text-gray-400">{customer.phone}</p>
        )}
      </div>
      {/* Location */}
      {customer.city && customer.state && (
        <div className="border-t border-gray-800 pt-3">
          <p className="text-xs text-gray-400">Location</p>
          <p className="text-sm">{customer.city}, {customer.state}</p>
        </div>
      )}
      {/* Stats */}
      <div className="border-t border-gray-800 pt-3 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-gray-400">Orders</p>
          <p className="text-lg font-semibold text-blue-400">{customer._count.orders}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Reviews</p>
          <p className="text-lg font-semibold text-purple-400">{customer._count.reviews}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Spent</p>
          <p className="text-lg font-semibold text-green-400">₹{customer.totalSpent}</p>
        </div>
      </div>
      {/* Date */}
      <div className="border-t border-gray-800 pt-3">
        <p className="text-xs text-gray-400">
          Joined {new Date(customer.createdAt).toLocaleDateString()}
        </p>
      </div>
    </button>
  );
}
