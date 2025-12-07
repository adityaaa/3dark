// app/api/auth/create-from-order/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { orderNumber, password } = await req.json();

    if (!orderNumber || !password) {
      return NextResponse.json(
        { success: false, error: "Order number and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if customer already exists with this email
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: order.customerEmail },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please login instead." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer account
    const customer = await prisma.customer.create({
      data: {
        email: order.customerEmail,
        name: order.customerName,
        phone: order.customerPhone,
        address: order.shippingAddress,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        password: hashedPassword,
      },
    });

    // Link the order to the customer account
    await prisma.order.update({
      where: { id: order.id },
      data: { customerId: customer.id },
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Error creating account from order:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
