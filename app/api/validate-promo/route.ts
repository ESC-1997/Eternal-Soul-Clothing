import { NextResponse } from 'next/server';
import { PromoCodeService } from '@/app/services/promoCodeService';
import { PromoAnalyticsService } from '@/app/services/promoAnalyticsService';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    const customerId = headersList.get('x-customer-id'); // You'll need to set this in your auth middleware

    const result = await PromoCodeService.validateCode(code, subtotal, ip, customerId || undefined);

    // Track the promo code usage
    const analyticsId = await PromoAnalyticsService.trackPromoUse(
      result.couponId,
      subtotal,
      result.discount,
      ip,
      userAgent,
      customerId || undefined
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