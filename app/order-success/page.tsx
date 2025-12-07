// app/order-success/page.tsx
import OrderSuccessClient from "./OrderSuccessClient";

export const metadata = {
  title: "Order Success - 3Dark",
  description: "Your order has been placed successfully",
};

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { orderNumber?: string };
}) {
  return <OrderSuccessClient orderNumber={searchParams.orderNumber} />;
}
