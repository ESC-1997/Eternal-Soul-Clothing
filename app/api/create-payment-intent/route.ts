import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PromoCodeService } from '@/app/services/promoCodeService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(req: Request) {
  try {
    const { amount, shipping, receipt_email, coupon, shippingMethod } = await req.json();

    // Calculate total amount including shipping
    const totalAmount = amount + (shippingMethod?.price || 0);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      shipping: shipping ? {
        address: {
          line1: shipping.address.line1,
          line2: shipping.address.line2,
          city: shipping.address.city,
          state: shipping.address.state,
          postal_code: shipping.address.postal_code,
          country: shipping.address.country,
        },
        name: shipping.name,
        phone: shipping.phone,
      } : undefined,
      receipt_email,
      metadata: {
        coupon: coupon || undefined,
        shipping_method: shippingMethod?.id || undefined,
        shipping_cost: shippingMethod?.price?.toString() || '0',
      },
    });

    // If there's a coupon, mark it as used only after successful payment
    if (coupon) {
      // Store the coupon ID in the payment intent metadata
      await stripe.paymentIntents.update(paymentIntent.id, {
        metadata: {
          couponId: coupon,
        },
      });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
} 