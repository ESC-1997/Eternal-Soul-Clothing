// pages/api/printify/create-order.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY;
  const SHOP_ID = process.env.PRINTIFY_SHOP_ID;

  try {
    const { recipient, line_items } = req.body;

    const response = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/orders.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PRINTIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_id: `order-${Date.now()}`,
        label: 'Eternal Soul Order',
        line_items,
        recipient,
        send_shipping_notification: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: 'Failed to create order', details: data });
    }

    res.status(200).json({ success: true, order: data });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Unexpected error' });
  }
}
