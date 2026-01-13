import Stripe from "stripe";
import { Request, Response } from "express";
import { ENV } from "./_core/env";
import { createBooking, createOrder, createReviewRequest, getAffiliateByCode, updateAffiliateEarnings, createAffiliateSale } from "./db";

const stripe = new Stripe(ENV.stripeSecretKey || "", { apiVersion: "2025-12-15.clover" });

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }
  
  // Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }
  
  console.log(`[Stripe Webhook] Received event: ${event.type}`);
  
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};
        
        if (metadata.type === 'tour_booking') {
          // Create booking record
          await createBooking({
            tourId: parseInt(metadata.tourId || '0'),
            userId: metadata.user_id ? parseInt(metadata.user_id) : undefined,
            customerName: metadata.customerName || '',
            customerEmail: session.customer_email || '',
            customerPhone: metadata.customerPhone,
            bookingDate: new Date(metadata.tourDate || ''),
            bookingTime: metadata.tourTime || '',
            guests: parseInt(metadata.guests || '1'),
            totalPrice: ((session.amount_total || 0) / 100).toFixed(2),
            specialRequests: metadata.specialRequests,
            affiliateCode: metadata.affiliateCode,
            stripePaymentId: session.payment_intent as string,
            status: 'confirmed'
          });
          
          // Create review request for after the tour
          await createReviewRequest({
            bookingId: 0, // Will be updated with actual booking ID
            customerEmail: session.customer_email || '',
            customerName: metadata.customerName || ''
          });
          
          // Handle affiliate commission
          if (metadata.affiliateCode) {
            const affiliate = await getAffiliateByCode(metadata.affiliateCode);
            if (affiliate) {
              const saleAmount = (session.amount_total || 0) / 100;
              const commission = saleAmount * 0.10; // 10% commission
              await createAffiliateSale({
                affiliateId: affiliate.id,
                type: 'booking',
                referenceId: 0,
                amount: saleAmount.toFixed(2),
                commission: commission.toFixed(2)
              });
              await updateAffiliateEarnings(affiliate.id, commission);
            }
          }
          
          console.log(`[Stripe Webhook] Tour booking created for ${session.customer_email}`);
        } else if (metadata.type === 'product_order') {
          // Create order record
          await createOrder({
            userId: metadata.user_id ? parseInt(metadata.user_id) : undefined,
            customerName: metadata.customerName || '',
            customerEmail: session.customer_email || '',
            customerPhone: metadata.customerPhone,
            shippingAddress: metadata.shippingAddress,
            items: [], // Items would be stored in line_items
            subtotal: ((session.amount_total || 0) / 100).toFixed(2),
            total: ((session.amount_total || 0) / 100).toFixed(2),
            couponCode: metadata.couponCode,
            affiliateCode: metadata.affiliateCode,
            stripePaymentId: session.payment_intent as string,
            status: 'paid'
          });
          
          // Handle affiliate commission
          if (metadata.affiliateCode) {
            const affiliate = await getAffiliateByCode(metadata.affiliateCode);
            if (affiliate) {
              const saleAmount = (session.amount_total || 0) / 100;
              const commission = saleAmount * 0.10;
              await createAffiliateSale({
                affiliateId: affiliate.id,
                type: 'order',
                referenceId: 0,
                amount: saleAmount.toFixed(2),
                commission: commission.toFixed(2)
              });
              await updateAffiliateEarnings(affiliate.id, commission);
            }
          }
          
          console.log(`[Stripe Webhook] Product order created for ${session.customer_email}`);
        }
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] Payment succeeded: ${paymentIntent.id}`);
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] Payment failed: ${paymentIntent.id}`);
        break;
      }
      
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Error processing event:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}
