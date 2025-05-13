import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PromoCodeService } from '@/app/services/promoCodeService';
import { PromoAnalyticsService } from '@/app/services/promoAnalyticsService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Check if this payment used a promo code
        const couponId = paymentIntent.metadata.couponId;
        if (couponId) {
          try {
            // Mark the promo code as used
            await PromoCodeService.markPromoCodeAsUsed(couponId);
            
            // Update the analytics record
            await PromoAnalyticsService.updateConversionStatus(couponId, 'completed');
          } catch (error) {
            console.error('Error marking promo code as used:', error);
            // Don't fail the webhook - we can retry this later
          }
        }
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // If payment failed, mark the analytics record as abandoned
        const couponId = paymentIntent.metadata.couponId;
        if (couponId) {
          try {
            await PromoAnalyticsService.updateConversionStatus(couponId, 'abandoned');
          } catch (error) {
            console.error('Error marking promo code as abandoned:', error);
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 