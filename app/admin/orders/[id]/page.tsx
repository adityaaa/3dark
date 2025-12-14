import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import OrderDetailClient from "./OrderDetailClient-new";

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
    confirmedAt: order.confirmedAt?.toISOString() || null,
    sourcedAt: order.sourcedAt?.toISOString() || null,
    packedAt: order.packedAt?.toISOString() || null,
    shippedAt: order.shippedAt?.toISOString() || null,
    deliveredAt: order.deliveredAt?.toISOString() || null,
    refundedAt: order.refundedAt?.toISOString() || null,
  };

  return <OrderDetailClient order={orderData} />;
}
