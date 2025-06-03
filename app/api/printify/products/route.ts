import { NextResponse } from 'next/server';

interface PrintifyProduct {
  id: string;
  title: string;
  is_published: boolean;
  is_enabled: boolean;
  variants: {
    id: string;
    title: string;
    is_available: boolean;
    is_enabled: boolean;
  }[];
}

interface PrintifyResponse {
  data: PrintifyProduct[];
}

// Cache duration in seconds (24 hours)
const CACHE_DURATION = 86400;

// In-memory cache
let cache = {
  data: null as PrintifyProduct[] | null,
  timestamp: 0,
  isInitialized: false
};

// Function to fetch fresh data
async function fetchFreshData() {
  try {
    let allProducts: PrintifyProduct[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response = await fetch(`https://api.printify.com/v1/shops/22091288/products.json?limit=50&page=${page}`, {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'EternalSoulApp',
        },
        next: { revalidate: 86400 }, // 24 hours
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch products from Printify: ${response.status} ${response.statusText}`);
      }

      const data: PrintifyResponse = await response.json();
      allProducts = [...allProducts, ...data.data];
      
      // Check if we have more pages
      hasMore = data.data.length === 50;
      page++;
    }
    
    // Add customizable flag to products and include all variants
    const products = allProducts.map((product: any) => ({
      ...product,
      customizable: product.title && product.title.includes('ES Phoenix Logo'),
      variants: product.variants // Include all variants, even unavailable ones
    }));

    // Update cache
    cache = {
      data: products,
      timestamp: Date.now(),
      isInitialized: true
    };

    return products;
  } catch (error) {
    console.error('Error fetching Printify products:', error);
    throw error;
  }
}

// Set up interval to fetch data every 24 hours
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
setInterval(fetchFreshData, TWENTY_FOUR_HOURS);

export async function GET() {
  try {
    // Check if we have valid cached data
    const now = Date.now();
    if (cache.data && (now - cache.timestamp) < CACHE_DURATION * 1000) {
      return NextResponse.json(cache.data, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      });
    }

    // If cache is invalid or not initialized, fetch fresh data
    if (!cache.isInitialized) {
      const products = await fetchFreshData();
      return NextResponse.json(products, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      });
    }

    // If cache is initialized but expired, try to use stale data while fetching fresh
    const staleData = cache.data;
    
    // Fetch fresh data in the background
    fetchFreshData().catch(error => {
      console.error('Background refresh failed:', error);
    });

    return NextResponse.json(staleData, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error in GET handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch products', details: errorMessage },
      { status: 500 }
    );
  }
} 