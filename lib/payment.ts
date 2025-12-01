// lib/payment.ts - Payment gateway utilities

/**
 * Generate unique order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `3D${timestamp}${random}`;
}

/**
 * Calculate shipping cost based on order total
 * Currently: Free shipping on all orders
 */
export function calculateShipping(subtotal: number): number {
  return 0; // Free shipping for all orders
}

/**
 * Razorpay configuration
 */
export function getRazorpayConfig() {
  return {
    keyId: process.env.RAZORPAY_KEY_ID!,
    keySecret: process.env.RAZORPAY_KEY_SECRET!,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  };
}

/**
 * Verify Razorpay payment signature
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require('node:crypto');
  const { keySecret } = getRazorpayConfig();
  
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");
    
  return expectedSignature === signature;
}
