import { NextResponse } from 'next/server';

// Cache duration in seconds (1 hour)
const CACHE_DURATION = 3600;

// In-memory cache
let cache = {
  data: null,
  timestamp: 0
};

export async function GET() {
  try {
    // Check if we have valid cached data
    const now = Date.now();
    if (cache.data && (now - cache.timestamp) < CACHE_DURATION * 1000) {
      console.log('Returning cached products data');
      return NextResponse.json(cache.data, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      });
    }

    console.log('Fetching fresh products data from Printify');
    const response = await fetch('https://api.printify.com/v1/shops/22091288/products.json', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'EternalSoulApp',
      },
      next: { revalidate: 3600 }, // Enable Next.js cache
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products from Printify');
    }

    const data = await response.json();
    
    // Debug: Log the raw data for Eternal Awakening
    const eternalAwakening = data.data.find((p: any) => p.title === "Eternal Awakening");
    if (eternalAwakening) {
      console.log('Eternal Awakening raw data:', {
        title: eternalAwakening.title,
        id: eternalAwakening.id,
        variants: eternalAwakening.variants.map((v: any) => ({
          id: v.id,
          title: v.title,
          price: v.price,
          is_available: v.is_available,
          options: v.options
        }))
      });
    }
    
    // Add customizable flag to products and filter out unavailable variants
    const products = data.data.map((product: any) => {
      const filteredVariants = product.variants.filter((variant: any) => variant.is_available);
      
      // Debug: Log product data for Eternal Motion
      if (product.title === "Eternal Motion (Biker Shorts) - Violet") {
        console.log('Eternal Motion product data:', {
          title: product.title,
          id: product.id,
          variants: filteredVariants.map((v: any) => ({
            id: v.id,
            title: v.title,
            price: v.price,
            is_available: v.is_available,
            options: v.options
          }))
        });
      }
      
      return {
        ...product,
        customizable: product.title && product.title.includes('ES Phoenix Logo'),
        variants: filteredVariants
      };
    });

    // Update cache
    cache = {
      data: products,
      timestamp: now
    };

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching Printify products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 
