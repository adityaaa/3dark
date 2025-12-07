// app/api/customer/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any).role || (session.user as any).role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email! },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any).role || (session.user as any).role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, address, city, state, pincode } = body;

    // Build update object with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (pincode !== undefined) updateData.pincode = pincode;

    const customer = await prisma.customer.update({
      where: { email: session.user.email! },
      data: updateData,
    });

    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
