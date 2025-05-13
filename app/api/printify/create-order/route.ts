import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.PRINTIFY_API_KEY;
    const shopId = process.env.PRINTIFY_SHOP_ID;
    if (!apiKey || !shopId) {
      return NextResponse.json({ error: 'Missing Printify API credentials' }, { status: 500 });
    }

    // Build the Printify order payload from the request body
    const orderPayload = {
      external_id: body.external_id || undefined, // Optional: your own order ID
      label: body.label || undefined, // Optional: e.g. 'Test Order'
      line_items: body.line_items, // Array of { product_id, variant_id, quantity, print_provider_id, ... }
      shipping_method: body.shipping_method, // e.g. 1 (standard)
      send_shipping_notification: true,
      address_to: body.address_to, // { first_name, last_name, email, phone, country, region, city, address1, address2, zip }
    };

    const printifyRes = await fetch(`https://api.printify.com/v1/shops/${shopId}/orders.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    const printifyData = await printifyRes.json();
    if (!printifyRes.ok) {
      return NextResponse.json({ error: printifyData }, { status: printifyRes.status });
    }

    return NextResponse.json({ order: printifyData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 