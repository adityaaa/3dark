// app/api/orders/track/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
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

    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        customerEmail: email.toLowerCase(),
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found. Please check your order number and email." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
