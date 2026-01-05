import { prisma } from "@/lib/db";
import CustomersClient from "./CustomersClient";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      orders: {
        select: {
          id: true,
          total: true,
          orderStatus: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          orders: true,
          reviews: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate total spent for each customer
  const customersWithStats = customers.map((customer) => {
    const totalSpent = customer.orders.reduce((sum, order) => {
      // Only count delivered orders
      if (order.orderStatus === "delivered") {
        return sum + order.total;
      }
      return sum;
    }, 0);

    return {
      ...customer,
      totalSpent,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
      orders: customer.orders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
      })),
    };
  });

  return <CustomersClient customers={customersWithStats} />;
}
