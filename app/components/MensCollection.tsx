'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  images: {
    src: string;
  }[];
  variants: {
    id: string;
    title: string;
    price: string;
  }[];
}

export default function MensCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        // Fetch products from Printify API
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products from Printify');
        }
        const printifyProducts = await response.json();
        
        console.log('=== ALL PRODUCT TITLES ===');
        printifyProducts.forEach((product: any) => {
          console.log('Product Title:', product.title);
        });
        console.log('========================');

        // Filter for specific products by name
        const allowedProducts = [
          'Eternally Cozy Sweatpants'
        ];

        console.log('Filtering products...');
        const filteredProducts = printifyProducts.filter((product: any) => {
          const isAllowed = allowedProducts.some(name => {
            const matches = product.title.includes(name);
            console.log(`Checking "${product.title}" against "${name}": ${matches}`);
            return matches;
          });
          return isAllowed;
        });

        console.log('Filtered products count:', filteredProducts.length);

        // Transform Printify products to match our Product interface
        const transformedProducts = filteredProducts.map((product: any) => ({
          id: product.id,
          title: product.title,
          images: product.images.map((img: any) => ({ src: img.src })),
          variants: product.variants.map((variant: any) => ({
            id: variant.id,
            title: variant.title,
            price: (variant.price / 100).toFixed(2) // Convert cents to dollars
          }))
        }));

        console.log('Setting products:', transformedProducts);
        setProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  // If no products are found, show a message
  if (products.length === 0) {
    return (
      <div className="w-full">
        <div className="flex justify-center py-8">
          <Image
            src="/images/Phoenix_ES_DADBE4.png"
            alt="Eternal Soul Men's Collection"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No products available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-center py-8">
        <Image
          src="/images/Phoenix_ES_DADBE4.png"
          alt="Eternal Soul Men's Collection"
          width={200}
          height={200}
          className="object-contain"
        />
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 px-4 py-8">
        {products.map((product) => (
          <div key={product.id} className="group">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 h-[400px] md:h-[450px]">
              <Link 
                href={
                  product.title.toLowerCase().includes('eternally cozy sweatpants')
                    ? '/shop/mens/eternally-cozy-sweatpants'
                    : `/shop/mens/${product.id}`
                }
                className="group"
              >
                <div className="relative h-[280px] md:h-[350px]">
                  <Image
                    src={product.images[0].src}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-sm md:text-base text-gray-600">${product.variants[0].price}</p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
