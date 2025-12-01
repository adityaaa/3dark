import Script from "next/script";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <CheckoutClient />
    </>
  );
}
