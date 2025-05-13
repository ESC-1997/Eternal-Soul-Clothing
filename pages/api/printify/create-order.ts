import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const orderData = req.body;
    
    // Get Printify access token
    const tokenResponse = await fetch('https://api.printify.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.PRINTIFY_CLIENT_ID,
        client_secret: process.env.PRINTIFY_CLIENT_SECRET,
      }),
    });

    const { access_token } = await tokenResponse.json();

    // Create order in Printify
    const orderResponse = await fetch('https://api.printify.com/v1/shops/1/orders.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.json();
      throw new Error(error.message || 'Failed to create Printify order');
    }

    const order = await orderResponse.json();
    res.status(200).json(order);
  } catch (err: any) {
    console.error('Error creating Printify order:', err);
    res.status(500).json({ error: err.message });
  }
} 