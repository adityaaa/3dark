import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOrderNumber, calculateShipping } from "@/lib/payment";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items, paymentMethod } = body;

    // Validate input
    if (!customer || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.qty,
      0
    );
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingAddress: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        subtotal,
        shipping,
        total,
        paymentMethod: paymentMethod || "razorpay",
        paymentStatus: "pending",
        orderStatus: "pending",
        notes: customer.notes || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            name: item.name,
            size: item.size,
            quantity: item.qty,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // If COD, return success immediately
    if (paymentMethod === "cod") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        method: "cod",
      });
    }

    // For Razorpay, create payment order
    if (paymentMethod === "razorpay" && process.env.RAZORPAY_KEY_ID) {
      const Razorpay = require("razorpay");
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const razorpayOrder = await razorpay.orders.create({
        amount: total * 100, // Amount in paise
        currency: "INR",
        receipt: orderNumber,
        notes: {
          orderId: order.id.toString(),
          orderNumber,
        },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        method: "razorpay",
        razorpayOrderId: razorpayOrder.id,
        amount: total,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    // Fallback if no payment gateway configured
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      method: "pending",
      message: "Payment gateway not configured. Order created as pending.",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
