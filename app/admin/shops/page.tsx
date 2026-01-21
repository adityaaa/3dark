"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Shop {
  id: number;
  name: string;
  location: string;
  address?: string;
  contact: string;
  whatsapp?: string;
  email?: string;
  ownerName?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

export default function ShopsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    contact: "",
    whatsapp: "",
    email: "",
    ownerName: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== "admin") {
      router.push("/admin/login?callbackUrl=/admin/shops");
    }
  }, [session, status, router]);

  // Fetch shops
  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/shops");
      const data = await res.json();
      if (data.success) {
        setShops(data.shops);
      }
    } catch (err) {
      console.error("Failed to fetch shops:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Shop added successfully!");
        setFormData({
          name: "",
          location: "",
          address: "",
          contact: "",
          whatsapp: "",
          email: "",
          ownerName: "",
          notes: "",
        });
        setShowAddForm(false);
        fetchShops(); // Refresh list
      } else {
        setError(data.error || "Failed to add shop");
      }
    } catch (err) {
      console.error("Error adding shop:", err);
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (shop: Shop) => {
    setSelectedShop(shop);
    setFormData({
      name: shop.name,
      location: shop.location,
      address: shop.address || "",
      contact: shop.contact,
      whatsapp: shop.whatsapp || "",
      email: shop.email || "",
      ownerName: shop.ownerName || "",
      notes: shop.notes || "",
    });
    setShowEditModal(true);
  };

  const handleViewDetails = (shop: Shop) => {
    setSelectedShop(shop);
    setShowDetailsModal(true);
  };

  const handleUpdateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShop) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/shops/${selectedShop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Shop updated successfully!");
        setShowEditModal(false);
        setSelectedShop(null);
        setFormData({
          name: "",
          location: "",
          address: "",
          contact: "",
          whatsapp: "",
          email: "",
          ownerName: "",
          notes: "",
        });
        fetchShops(); // Refresh list
      } else {
        setError(data.error || "Failed to update shop");
      }
    } catch (err) {
      console.error("Error updating shop:", err);
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (shop: Shop) => {
    try {
      const res = await fetch(`/api/admin/shops/${shop.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !shop.isActive }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(`Shop ${!shop.isActive ? "activated" : "deactivated"} successfully!`);
        fetchShops(); // Refresh list
      } else {
        setError(data.error || "Failed to update shop status");
      }
    } catch (err) {
      console.error("Error updating shop status:", err);
      setError("Network error. Please try again.");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shop Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage sourcing partners for on-demand fulfillment
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              {showAddForm ? "Cancel" : "+ Add Shop"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Shop Form */}
        {showAddForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Shop</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="shop-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="shop-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                  placeholder="e.g., Delhi Fashion Hub"
                />
              </div>

              <div>
                <label htmlFor="shop-location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="shop-location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                  placeholder="e.g., Lajpat Nagar, Delhi"
                />
              </div>

              <div>
                <label htmlFor="shop-contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="shop-contact"
                  type="tel"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                  placeholder="e.g., +91 9999999999"
                />
              </div>

              <div>
                <label htmlFor="shop-whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Number
                </label>
                <input
                  id="shop-whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                  placeholder="e.g., +91 9999999999"
                />
              </div>

              <div>
                <label htmlFor="shop-owner" className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name
                </label>
                <input
                  id="shop-owner"
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                  placeholder="e.g., Rajesh Kumar"
                />
              </div>

              <div>
                <label htmlFor="shop-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="shop-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                  placeholder="e.g., shop@example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="shop-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address
                </label>
                <textarea
                  id="shop-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                  placeholder="Full street address..."
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="shop-notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="shop-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                  placeholder="Any special notes about this shop..."
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Adding Shop..." : "Add Shop"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Shops List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Shops ({shops.length})
            </h2>
          </div>

          {shops.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No shops yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first sourcing partner.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                + Add Your First Shop
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shop Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                        {shop.ownerName && (
                          <div className="text-sm text-gray-500">Owner: {shop.ownerName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{shop.contact}</div>
                        {shop.whatsapp && (
                          <div className="text-sm text-gray-500">
                            <a
                              href={`https://wa.me/${shop.whatsapp.replaceAll(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700"
                            >
                              WhatsApp →
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{shop.location}</div>
                        {shop.address && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {shop.address}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            shop.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {shop.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleEdit(shop)}
                          className="text-orange-600 hover:text-orange-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleViewDetails(shop)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && selectedShop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Edit Shop</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedShop(null);
                    setFormData({
                      name: "",
                      location: "",
                      address: "",
                      contact: "",
                      whatsapp: "",
                      email: "",
                      ownerName: "",
                      notes: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdateShop} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shop Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Updating..." : "Update Shop"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(selectedShop)}
                    className={`px-4 py-2 rounded-lg transition ${
                      selectedShop.isActive
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {selectedShop.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showDetailsModal && selectedShop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Shop Details</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedShop(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedShop.name}</h3>
                      <p className="text-sm text-gray-500">{selectedShop.location}</p>
                    </div>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        selectedShop.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedShop.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Number</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedShop.contact}</p>
                    </div>

                    {selectedShop.whatsapp && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">WhatsApp</label>
                        <p className="mt-1 text-sm">
                          <a
                            href={`https://wa.me/${selectedShop.whatsapp.replaceAll(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700"
                          >
                            {selectedShop.whatsapp} →
                          </a>
                        </p>
                      </div>
                    )}

                    {selectedShop.ownerName && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Owner Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedShop.ownerName}</p>
                      </div>
                    )}

                    {selectedShop.email && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedShop.email}</p>
                      </div>
                    )}

                    {selectedShop.address && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500">Full Address</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedShop.address}</p>
                      </div>
                    )}

                    {selectedShop.notes && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500">Notes</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedShop.notes}</p>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Created At</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedShop.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex gap-3">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleEdit(selectedShop);
                      }}
                      className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
                    >
                      Edit Shop
                    </button>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
