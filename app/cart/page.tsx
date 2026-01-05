"use client";

import { useCart } from "@/components/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clear, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-600" />
            <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-400 mb-8">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32 md:pb-12">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold">Shopping Cart</h1>
          <button
            onClick={clear}
            className="text-red-500 hover:text-red-400 transition-colors text-sm md:text-base min-h-[44px] px-3"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="bg-gray-900 rounded-lg p-3 md:p-4"
              >
                {/* Mobile Layout: Stack vertically */}
                <div className="flex gap-3 md:gap-4 mb-3 md:mb-0">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                    {item.product.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base md:text-lg mb-1 line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">Size: {item.size}</p>
                    <p className="text-lg md:text-xl font-bold">₹{item.product.price}</p>
                  </div>

                  {/* Delete button - Desktop */}
                  <button
                    onClick={() => removeItem(item.product.id, item.size)}
                    className="hidden md:block text-red-500 hover:text-red-400 transition-colors self-start"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Quantity Controls & Actions - Mobile optimized */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 bg-gray-800 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.qty - 1)
                      }
                      className="p-3 md:p-2 hover:bg-gray-700 rounded-l-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 md:w-12 text-center font-semibold">
                      {item.qty}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.qty + 1)
                      }
                      className="p-3 md:p-2 hover:bg-gray-700 rounded-r-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-sm md:text-base font-semibold">
                      ₹{item.product.price * item.qty}
                    </p>
                    
                    {/* Delete button - Mobile */}
                    <button
                      onClick={() => removeItem(item.product.id, item.size)}
                      className="md:hidden text-red-500 hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Desktop sticky, Mobile fixed bottom */}
          <div className="lg:col-span-1">
            {/* Desktop Summary */}
            <div className="hidden lg:block bg-gray-900 rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-500 font-semibold">FREE</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-white text-black text-center py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors mb-4"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/shop"
                className="block w-full text-center py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-40 safe-area-bottom">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-400">Total ({items.length} items)</p>
            <p className="text-2xl font-bold">₹{total}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-green-500 font-semibold">FREE Shipping</p>
          </div>
        </div>
        <Link
          href="/checkout"
          className="block w-full bg-white text-black text-center py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors min-h-[48px] flex items-center justify-center"
        >
          Proceed to Checkout
        </Link>
        <Link
          href="/shop"
          className="block w-full text-center py-2 text-sm text-gray-400 hover:text-white transition-colors mt-2"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
