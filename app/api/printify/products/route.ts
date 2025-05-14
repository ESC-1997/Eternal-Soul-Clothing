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
      
      // Debug: Log filtered variants for Eternal Awakening
      if (product.title === "Eternal Awakening") {
        console.log('Eternal Awakening filtered variants:', filteredVariants.map((v: any) => ({
          id: v.id,
          title: v.title,
          price: v.price,
          is_available: v.is_available,
          options: v.options
        })));
        
        // Log the first variant's price that will be used for display
        if (filteredVariants.length > 0) {
          console.log('First available variant price:', filteredVariants[0].price);
        } else {
          console.log('No available variants found for Eternal Awakening');
        }
      }
      
      return {
        ...product,
        customizable: product.title && product.title.includes('ES Phoenix Logo'),
        variants: filteredVariants
      };
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching Printify products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 
