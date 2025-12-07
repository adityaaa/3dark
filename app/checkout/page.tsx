// app/checkout/page.tsx

import Script from "next/script";
import CheckoutClient from "./CheckoutClient";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <CheckoutClient />
    </>
  );
}
