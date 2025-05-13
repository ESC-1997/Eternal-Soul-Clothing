import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { productId, shirtColor, logoColor, size } = await request.json();

    // Here we'll implement the logic to create a custom variant in Printify
    // This is a placeholder for the actual Printify API call
    const response = await fetch(`https://api.printify.com/v1/shops/22091288/products/${productId}/variants.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'EternalSoulApp',
      },
      body: JSON.stringify({
        variant_id: size,
        options: {
          shirt_color: shirtColor.value,
          logo_color: logoColor.value,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create custom variant');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating custom product:', error);
    return NextResponse.json(
      { error: 'Failed to create custom product' },
      { status: 500 }
    );
  }
} 