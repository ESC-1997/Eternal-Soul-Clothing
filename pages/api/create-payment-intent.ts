import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, shipping, receipt_email, coupon } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      shipping: {
        name: shipping.name,
        address: shipping.address,
        phone: shipping.phone,
      },
      receipt_email,
      metadata: {
        coupon_id: coupon || '',
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ error: err.message });
  }
} 