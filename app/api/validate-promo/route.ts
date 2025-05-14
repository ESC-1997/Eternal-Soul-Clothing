import { NextResponse } from 'next/server';
import { PromoCodeService } from '@/app/services/promoCodeService';
import { PromoAnalyticsService } from '@/app/services/promoAnalyticsService';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { code, subtotal, customerId } = await req.json();
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    const result = await PromoCodeService.validateCode(code, subtotal, ip, customerId || undefined);

    // Track the promo code usage - only track customerId if it's a valid UUID
    const analyticsId = await PromoAnalyticsService.trackPromoUsage(
      result.couponId,
      'pending', // orderId will be updated when payment is completed
      customerId || null, // Send null instead of 'anonymous' for non-logged in users
      result.discount,
      subtotal,
      subtotal - result.discount,
      ip,
      userAgent
    );

    return NextResponse.json({
      ...result,
      analyticsId
    });
  } catch (error: any) {
    console.error('Error validating promo code:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
} 