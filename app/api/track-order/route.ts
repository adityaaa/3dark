// app/api/track-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface TimelineItem {
  status: string;
  label: string;
  description: string;
  completed: boolean;
  timestamp: Date | null | undefined;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber");
    const email = searchParams.get("email");

    if (!orderNumber || !email) {
      return NextResponse.json(
        { success: false, error: "Order number and email are required" },
        { status: 400 }
      );
    }

    // Find the order with matching order number and customer email
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber,
        customerEmail: email.toLowerCase().trim(),
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                image: true,
                gallery: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Order not found. Please check your order number and email address." 
        },
        { status: 404 }
      );
    }

    // Format the order data for the response
    const orderData = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.orderStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      shippingAddress: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        address: order.shippingAddress,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
      },
      items: order.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        size: item.size,
        qty: item.quantity,
        price: item.price,
        product: item.product,
      })),
      notes: order.notes,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
    };

    // Generate estimated delivery date (5-7 business days from order date)
    const orderDate = new Date(order.createdAt);
    const estimatedDeliveryStart = new Date(orderDate);
    const estimatedDeliveryEnd = new Date(orderDate);
    estimatedDeliveryStart.setDate(orderDate.getDate() + 5);
    estimatedDeliveryEnd.setDate(orderDate.getDate() + 7);

    // Generate status timeline based on order status
    const getStatusTimeline = (status: string, createdAt: Date): TimelineItem[] => {
      const timeline: TimelineItem[] = [
        {
          status: "confirmed",
          label: "Order Confirmed",
          description: "Your order has been received and confirmed",
          completed: true,
          timestamp: createdAt,
        },
      ];

      const processingDate = new Date(createdAt);
      processingDate.setDate(createdAt.getDate() + 1);

      if (["processing", "shipped", "delivered"].includes(status)) {
        timeline.push({
          status: "processing",
          label: "Processing",
          description: "Your order is being prepared for shipment",
          completed: true,
          timestamp: processingDate,
        });
      } else {
        timeline.push({
          status: "processing",
          label: "Processing",
          description: "Your order is being prepared for shipment",
          completed: false,
          timestamp: processingDate,
        });
      }

      const shippedDate = new Date(createdAt);
      shippedDate.setDate(createdAt.getDate() + 3);

      if (["shipped", "delivered"].includes(status)) {
        timeline.push({
          status: "shipped",
          label: "Shipped",
          description: "Your order has been dispatched",
          completed: true,
          timestamp: shippedDate,
        });
      } else {
        timeline.push({
          status: "shipped",
          label: "Shipped",
          description: "Your order will be dispatched soon",
          completed: false,
          timestamp: undefined,
        });
      }

      const deliveredDate = new Date(createdAt);
      deliveredDate.setDate(createdAt.getDate() + 6);

      if (status === "delivered") {
        timeline.push({
          status: "delivered",
          label: "Delivered",
          description: "Your order has been successfully delivered",
          completed: true,
          timestamp: deliveredDate,
        });
      } else {
        timeline.push({
          status: "delivered",
          label: "Out for Delivery",
          description: "Your order will be delivered soon",
          completed: false,
          timestamp: undefined,
        });
      }

      return timeline;
    };

    return NextResponse.json({
      success: true,
      order: orderData,
      estimatedDelivery: {
        start: estimatedDeliveryStart,
        end: estimatedDeliveryEnd,
      },
      timeline: getStatusTimeline(order.orderStatus, order.createdAt),
    });
  } catch (error: any) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
