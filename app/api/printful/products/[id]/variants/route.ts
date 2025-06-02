import { NextResponse } from 'next/server';
import { getPrintfulVariants } from '@/lib/printful';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const accessToken = process.env.PRINTFUL_ACCESS_TOKEN;
    const storeId = process.env.PRINTFUL_STORE_ID;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Printful access token not configured' },
        { status: 500 }
      );
    }

    if (!storeId) {
      return NextResponse.json(
        { error: 'Printful store ID not configured' },
        { status: 500 }
      );
    }

    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const variants = await getPrintfulVariants(accessToken, productId);
    
    return NextResponse.json(variants);
  } catch (error) {
    console.error('Error fetching Printful variants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Printful variants' },
      { status: 500 }
    );
  }
} 