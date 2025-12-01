// app/order-success/page.tsx

import Link from "next/link";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { orderNumber?: string };
}) {
  const orderNumber = searchParams.orderNumber;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="rounded-full bg-neon/20 w-20 h-20 mx-auto flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-neon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-white mb-4">
        Order Placed Successfully!
      </h1>

      {orderNumber && (
        <p className="text-white/80 mb-2">
          Your order number is:{" "}
          <span className="font-mono text-neon">{orderNumber}</span>
        </p>
      )}

      <p className="text-white/60 text-sm mb-8">
        We've sent a confirmation email with your order details.
        <br />
        You can track your order status from your account.
      </p>

      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          href="/shop"
          className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white hover:border-neon hover:text-neon transition"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="rounded-full bg-neon px-6 py-2 text-sm font-semibold text-black shadow-glow hover:brightness-95 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
