import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.printify.com/v1/shops/22091288/products/${productId}/publish.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'EternalSoulApp',
      },
      body: JSON.stringify({
        title: true,
        description: true,
        images: true,
        variants: true,
        tags: true,
        keyFeatures: true,
        shipping_template: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Printify publish error:', errorData);
      throw new Error('Failed to publish product');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error publishing product:', error);
    return NextResponse.json(
      { error: 'Failed to publish product' },
      { status: 500 }
    );
  }
} 