import { NextResponse } from 'next/server';
import { getPrintfulProducts } from '@/lib/printful';

export async function GET() {
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

    const products = await getPrintfulProducts(accessToken);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching Printful products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Printful products' },
      { status: 500 }
    );
  }
} 