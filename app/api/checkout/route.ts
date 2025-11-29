import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("Checkout request", body);

  // TODO: replace with real Razorpay integration.
  return NextResponse.json({ ok: true, orderId: "demo-order-123" });
}
