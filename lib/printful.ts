import { headers } from 'next/headers';

const PRINTFUL_API_URL = 'https://api.printful.com';

export interface PrintfulProduct {
  id: number;
  name: string;
  thumbnail_url: string;
  variants: {
    id: number;
    name: string;
    size: string;
    color: string;
    price: string;
    is_enabled: boolean;
    is_available: boolean;
  }[];
}

export interface PrintfulVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  retail_price: string;
  sku: string;
  currency: string;
  product: {
    variant_id: number;
    product_id: number;
    image: string;
    name: string;
  };
  files: {
    id: number;
    type: string;
    title: string;
    url: string;
  }[];
  options: {
    id: string;
    value: string;
  }[];
}

export async function getPrintfulProducts(accessToken: string): Promise<PrintfulProduct[]> {
  const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID || '',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`Printful API error: ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
  }

  const data = await response.json();
  return data.result;
}

export async function getPrintfulVariants(accessToken: string, productId: number): Promise<PrintfulVariant[]> {
  const response = await fetch(`${PRINTFUL_API_URL}/store/products/${productId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID || '',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`Printful API error: ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
  }

  const data = await response.json();
  console.log('Printful API Response:', data); // Debug log
  return data.result.sync_variants;
} 