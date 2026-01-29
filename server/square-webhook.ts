// Square Webhook Handler
import { Request, Response } from "express";
import crypto from "crypto";
import { getDb } from "./db";
import { orders, bookings } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { ENV } from "./_core/env";

// Verify Square webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string,
  webhookSignatureKey: string
): boolean {
  if (!webhookSignatureKey) {
    console.log("[Square Webhook] No signature key configured, skipping verification");
    return true; // Allow in development if no key configured
  }

  try {
    const hmac = crypto.createHmac("sha256", webhookSignatureKey);
    hmac.update(body);
    const expectedSignature = hmac.digest("base64");
    return signature === expectedSignature;
  } catch (error) {
    console.error("[Square Webhook] Signature verification error:", error);
    return false;
  }
}

// Handle Square webhook events
export async function handleSquareWebhook(req: Request, res: Response) {
  const signature = req.headers["x-square-hmacsha256-signature"] as string;
  const body = req.body.toString();

  console.log("[Square Webhook] Received event");

  // Get webhook signature key from environment (optional for sandbox)
  const webhookSignatureKey = ENV.squareWebhookSignatureKey || "";

  // Verify signature if key is configured
  if (webhookSignatureKey && !verifyWebhookSignature(body, signature, webhookSignatureKey)) {
    console.error("[Square Webhook] Invalid signature");
    return res.status(401).json({ error: "Invalid signature" });
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch (error) {
    console.error("[Square Webhook] Failed to parse body:", error);
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const eventType = event.type;
  const eventId = event.event_id;

  console.log(`[Square Webhook] Event type: ${eventType}, ID: ${eventId}`);

  // Handle test events from Square
  if (eventId && eventId.startsWith("test_")) {
    console.log("[Square Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  try {
    switch (eventType) {
      case "payment.completed":
        await handlePaymentCompleted(event.data?.object?.payment);
        break;

      case "payment.updated":
        await handlePaymentUpdated(event.data?.object?.payment);
        break;

      case "refund.created":
        await handleRefundCreated(event.data?.object?.refund);
        break;

      case "order.created":
        await handleOrderCreated(event.data?.object?.order);
        break;

      case "order.updated":
        await handleOrderUpdated(event.data?.object?.order);
        break;

      default:
        console.log(`[Square Webhook] Unhandled event type: ${eventType}`);
    }

    res.json({ received: true, eventType });
  } catch (error) {
    console.error(`[Square Webhook] Error processing ${eventType}:`, error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

// Handle payment.completed event
async function handlePaymentCompleted(payment: any) {
  if (!payment) {
    console.log("[Square Webhook] No payment data in event");
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[Square Webhook] Database not available");
    return;
  }
  const paymentId = payment.id;
  const orderId = payment.order_id;
  const status = payment.status;

  console.log(`[Square Webhook] Payment completed: ${paymentId}, Order: ${orderId}, Status: ${status}`);

  // Update order status if we have a reference
  if (orderId) {
    try {
      // Try to find and update order by Square order ID
      const existingOrders = await db.select().from(orders).where(eq(orders.stripePaymentId, orderId));
      
      if (existingOrders.length > 0) {
        await db.update(orders)
          .set({ 
            status: "paid",
            updatedAt: new Date()
          })
          .where(eq(orders.stripePaymentId, orderId));
        
        console.log(`[Square Webhook] Updated order status to paid for order: ${orderId}`);
      }

      // Also check bookings
      const existingBookings = await db.select().from(bookings).where(eq(bookings.stripePaymentId, orderId));
      
      if (existingBookings.length > 0) {
        await db.update(bookings)
          .set({ 
            status: "confirmed",
            updatedAt: new Date()
          })
          .where(eq(bookings.stripePaymentId, orderId));
        
        console.log(`[Square Webhook] Updated booking status to confirmed for order: ${orderId}`);
      }
    } catch (error) {
      console.error("[Square Webhook] Error updating order/booking:", error);
    }
  }
}

// Handle payment.updated event
async function handlePaymentUpdated(payment: any) {
  if (!payment) return;

  const db = await getDb();
  if (!db) {
    console.error("[Square Webhook] Database not available");
    return;
  }
  const paymentId = payment.id;
  const status = payment.status;
  const orderId = payment.order_id;

  console.log(`[Square Webhook] Payment updated: ${paymentId}, Status: ${status}`);

  // Map Square payment status to our status
  let newStatus: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | null = null;
  switch (status) {
    case "COMPLETED":
      newStatus = "paid";
      break;
    case "CANCELED":
      newStatus = "cancelled";
      break;
  }

  if (newStatus && orderId) {
    try {
      await db.update(orders)
        .set({ status: newStatus, updatedAt: new Date() })
        .where(eq(orders.stripePaymentId, orderId));
      
      console.log(`[Square Webhook] Updated order status to ${newStatus}`);
    } catch (error) {
      console.error("[Square Webhook] Error updating order status:", error);
    }
  }
}

// Handle refund.created event
async function handleRefundCreated(refund: any) {
  if (!refund) return;

  const refundId = refund.id;
  const paymentId = refund.payment_id;
  const amountMoney = refund.amount_money;
  const status = refund.status;

  console.log(`[Square Webhook] Refund created: ${refundId}, Payment: ${paymentId}, Status: ${status}`);

  // Find the order associated with this payment and update status
  if (paymentId) {
    try {
      // Note: We'd need to track payment_id separately to properly link refunds
      // For now, log the refund for manual review
      console.log(`[Square Webhook] Refund of ${amountMoney?.amount} cents processed for payment ${paymentId}`);
    } catch (error) {
      console.error("[Square Webhook] Error processing refund:", error);
    }
  }
}

// Handle order.created event
async function handleOrderCreated(order: any) {
  if (!order) return;

  const orderId = order.id;
  const referenceId = order.reference_id;

  console.log(`[Square Webhook] Order created: ${orderId}, Reference: ${referenceId}`);
}

// Handle order.updated event
async function handleOrderUpdated(order: any) {
  if (!order) return;

  const db = await getDb();
  if (!db) {
    console.error("[Square Webhook] Database not available");
    return;
  }
  const orderId = order.id;
  const state = order.state;

  console.log(`[Square Webhook] Order updated: ${orderId}, State: ${state}`);

  // Update local order status based on Square order state
  if (state === "COMPLETED") {
    try {
      await db.update(orders)
        .set({ status: "delivered", updatedAt: new Date() })
        .where(eq(orders.stripePaymentId, orderId));
      
      console.log(`[Square Webhook] Marked order as completed: ${orderId}`);
    } catch (error) {
      console.error("[Square Webhook] Error updating order:", error);
    }
  }
}
