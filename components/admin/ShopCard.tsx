"use client";

type ShopCardProps = {
  readonly shop: {
    id: number;
    name: string;
    brand: string;
    location: string;
    contactPerson: string;
    contactPhone: string;
    contactEmail: string;
    status: string;
    createdAt: string;
  };
  onEdit: (shop: any) => void;
  onView: (shop: any) => void;
  onToggleStatus: (shopId: number, currentStatus: string) => void;
};

export default function ShopCard({ shop, onEdit, onView, onToggleStatus }: ShopCardProps) {
  const statusColors = {
    active: "bg-green-900/30 text-green-400 border-green-600/30",
    inactive: "bg-gray-700 text-gray-400 border-gray-600",
    pending: "bg-yellow-900/30 text-yellow-400 border-yellow-600/30",
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">{shop.name}</p>
          <p className="text-sm text-gray-400">{shop.brand}</p>
        </div>
        <span
          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
            statusColors[shop.status as keyof typeof statusColors] || statusColors.pending
          }`}
        >
          {shop.status}
        </span>
      </div>
      {/* Location */}
      <div className="border-t border-gray-800 pt-3">
        <p className="text-xs text-gray-400">Location</p>
        <p className="text-sm">{shop.location}</p>
      </div>
      {/* Contact */}
      <div className="border-t border-gray-800 pt-3">
        <p className="text-xs text-gray-400">Contact Person</p>
        <p className="text-sm font-medium">{shop.contactPerson}</p>
        <p className="text-xs text-gray-400 mt-1">{shop.contactPhone}</p>
        <p className="text-xs text-gray-400">{shop.contactEmail}</p>
      </div>
      {/* Actions */}
      <div className="border-t border-gray-800 pt-3 grid grid-cols-3 gap-2">
        <button
          onClick={() => onView(shop)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
        >
          View
        </button>
        <button
          onClick={() => onEdit(shop)}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onToggleStatus(shop.id, shop.status)}
          className={`rounded-lg py-2 text-sm font-medium transition-colors ${
            shop.status === 'active'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {shop.status === 'active' ? 'Disable' : 'Enable'}
        </button>
      </div>
      {/* Date */}
      <div className="border-t border-gray-800 pt-3">
        <p className="text-xs text-gray-400">
          Added {new Date(shop.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
