import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.printify.com/v1/shops/22091288/products.json', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'EternalSoulApp',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products from Printify');
    }

    const data = await response.json();
    
    // Add customizable flag to products
    const products = data.data.map((product: any) => ({
      ...product,
      customizable: product.title && product.title.includes('ES Phoenix Logo'),
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching Printify products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 