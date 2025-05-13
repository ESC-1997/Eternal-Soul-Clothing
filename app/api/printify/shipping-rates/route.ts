import { NextResponse } from 'next/server';

const PRINTIFY_API_URL = 'https://api.printify.com/v1';

export async function POST(req: Request) {
  try {
    const { address, items } = await req.json();

    // Log the incoming request data
    console.log('[Shipping Rates] Incoming request data:', { address, items });

    // Validate required fields
    if (!address || !items) {
      console.error('[Shipping Rates] Missing required fields:', { address, items });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!address.country || !address.state || !address.city || !address.zip) {
      console.error('[Shipping Rates] Missing required address fields:', address);
      return NextResponse.json(
        { error: 'Missing required address fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      console.error('[Shipping Rates] Invalid or empty items array:', items);
      return NextResponse.json(
        { error: 'Invalid or empty items array' },
        { status: 400 }
      );
    }

    // Calculate shipping rates based on Printify's built-in shipping costs
    // First item: $4.75, Additional items: $1.00 each (including multiple quantities of same item)
    const firstItemShipping = 4.75;
    const additionalItemShipping = 1.00;
    
    // Calculate total quantity of all items
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const shippingRates = [
      {
        id: 'standard',
        name: 'Standard Shipping',
        price: firstItemShipping + (Math.max(0, totalQuantity - 1) * additionalItemShipping),
        currency: 'USD',
        delivery_time: '3-5 business days',
        is_express: false
      }
    ];

    console.log('[Shipping Rates] Calculated shipping rates:', {
      shippingRates,
      totalQuantity,
      items
    });

    return NextResponse.json({ shippingRates });
  } catch (error: any) {
    console.error('[Shipping Rates] Error in shipping rates endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate shipping rates' },
      { status: 400 }
    );
  }
} 