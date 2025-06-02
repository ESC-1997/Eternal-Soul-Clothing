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

// Cache duration in seconds (1 hour)
const CACHE_DURATION = 3600;

// In-memory cache
let cache = {
  data: null as PrintifyProduct[] | null,
  timestamp: 0,
  isInitialized: false
};

// Function to fetch fresh data
async function fetchFreshData() {
  try {
    console.log('=== PRINTIFY API REQUEST ===');
    console.log('Fetching fresh products data from Printify');
    
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
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        console.error('Printify API Error:', {
          status: response.status,
          statusText: response.statusText,
          url: `https://api.printify.com/v1/shops/22091288/products.json?limit=50&page=${page}`
        });
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch products from Printify: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: PrintifyResponse = await response.json();
      allProducts = [...allProducts, ...data.data];
      
      // Check if we have more pages
      hasMore = data.data.length === 50;
      page++;
    }
    
    // Debug: Log the full API response structure
    console.log('=== PRINTIFY API RESPONSE STRUCTURE ===');
    console.log('Total products:', allProducts.length);
    console.log('All products:', allProducts.map((p: any) => ({
      id: p.id,
      title: p.title,
      is_published: p.is_published,
      is_enabled: p.is_enabled,
      variants: p.variants.map((v: any) => ({
        id: v.id,
        title: v.title,
        is_available: v.is_available,
        is_enabled: v.is_enabled
      }))
    })));
    
    // Debug: Log specific Eternal Lotus products
    const eternalLotusProducts = allProducts.filter((p: any) => 
      p.id === '6813de3b9fb67dd986004dc8' || 
      p.id === '6813ea12a7ab600a950c4b5a'
    );
    
    console.log('=== ETERNAL LOTUS PRODUCTS DEBUG ===');
    if (eternalLotusProducts.length === 0) {
      console.log('No Eternal Lotus products found in API response');
      // Search for any products with "eternal lotus" in the title
      const allEternalLotus = allProducts.filter((p: any) => 
        p.title.toLowerCase().includes('eternal lotus')
      );
      console.log('All products with "eternal lotus" in title:', allEternalLotus.map((p: any) => ({
        id: p.id,
        title: p.title,
        is_published: p.is_published,
        is_enabled: p.is_enabled
      })));
    } else {
      eternalLotusProducts.forEach((p: any) => {
        console.log(`Product: "${p.title}" (ID: ${p.id})`);
        console.log('Status:', {
          is_published: p.is_published,
          is_enabled: p.is_enabled
        });
        console.log('All variants:', p.variants.map((v: any) => ({
          id: v.id,
          title: v.title,
          is_available: v.is_available,
          is_enabled: v.is_enabled,
          options: v.options
        })));
      });
    }
    
    // Debug: Log all products and their variants
    console.log('=== ALL PRODUCTS FROM PRINTIFY ===');
    allProducts.forEach((p: any) => {
      console.log(`Product: "${p.title}" (ID: ${p.id})`);
      console.log('Variants:', p.variants.map((v: any) => ({
        id: v.id,
        title: v.title,
        is_available: v.is_available,
        is_enabled: v.is_enabled
      })));
    });
    
    // Debug: Log the raw data for Eternal Awakening
    const eternalAwakening = allProducts.find((p: any) => p.title === "Eternal Awakening");
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
    const products = allProducts.map((product: any) => {
      const filteredVariants = product.variants.filter((variant: any) => variant.is_available);
      
      // Debug: Log Eternal Lotus products after filtering
      if (product.id === '6813de3b9fb67dd986004dc8' || product.id === '6813ea12a7ab600a950c4b5a') {
        console.log(`Eternal Lotus product after filtering: "${product.title}"`);
        console.log('Available variants:', filteredVariants.map((v: any) => ({
          id: v.id,
          title: v.title,
          is_available: v.is_available,
          options: v.options
        })));
      }
      
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
      timestamp: Date.now(),
      isInitialized: true
    };

    return products;
  } catch (error) {
    console.error('Error fetching Printify products:', error);
    throw error;
  }
}

// Set up interval to fetch data every 12 hours
const TWELVE_HOURS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
setInterval(fetchFreshData, TWELVE_HOURS);

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

    // If cache is invalid or not initialized, fetch fresh data
    if (!cache.isInitialized) {
      console.log('Cache not initialized, fetching fresh data...');
      const products = await fetchFreshData();
      return NextResponse.json(products, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      });
    }

    // If cache is initialized but expired, try to use stale data while fetching fresh
    console.log('Cache expired, using stale data while fetching fresh...');
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