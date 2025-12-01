import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import OrderDetailClient from "./OrderDetailClient";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(params.id) },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  // Convert dates to strings for client component
  const orderData = {
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };

  return <OrderDetailClient order={orderData} />;
}
