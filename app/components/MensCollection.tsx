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
          'Eternally Cozy Sweatpants',
          'Eternal Rebirth',
          'Eternal Cut',
          'Vow of The Eternal',
          'Eternal Awakening'
        ];

        console.log('Filtering products...');
        const filteredProducts = printifyProducts.filter((product: any) => {
          const isAllowed = allowedProducts.some(name => {
            const matches = product.title.toLowerCase().includes(name.toLowerCase());
            console.log(`Checking "${product.title}" against "${name}": ${matches}`);
            return matches;
          });
          return isAllowed;
        });

        console.log('Filtered products:', filteredProducts.map((p: { title: string }) => p.title));

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

      {/* Banner Section */}
      <div className="bg-[#DADBE4] py-4 mb-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-['Bebas_Neue'] text-[#1B1F3B] tracking-wider text-center">
            ESSENTIALS
          </h2>
        </div>
      </div>
      
      {/* Product Grid */}
      <div className="relative px-4">
        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <div className="flex space-x-6 min-w-min">
            {products.map((product) => (
              <div key={product.id} className="flex-none w-[300px] group">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 h-[450px]">
                  <Link 
                    href={
                      product.title.toLowerCase().includes('eternally cozy sweatpants')
                        ? '/shop/mens/eternally-cozy-sweatpants'
                        : product.title.toLowerCase().includes('eternal rebirth')
                        ? '/shop/mens/eternal-rebirth'
                        : product.title.toLowerCase().includes('eternal cut')
                        ? '/shop/mens/eternal-cut'
                        : product.title.toLowerCase().includes('vow of the eternal')
                        ? '/shop/mens/vow-of-the-eternal'
                        : product.title.toLowerCase().includes('eternal awakening')
                        ? '/shop/mens/eternal-awakening'
                        : `/shop/mens/${product.id}`
                    }
                    className="group"
                  >
                    <div className="relative h-[350px]">
                      <Image
                        src={product.images[0].src}
                        alt={product.title}
                        fill
                        className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                      />
                      {product.images[1] && (
                        <Image
                          src={product.images[1].src}
                          alt={`${product.title} - alternate view`}
                          fill
                          className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
                      <p className="text-base text-gray-600">
                        {product.title.toLowerCase().includes('vow of the eternal')
                          ? '$40.00'
                          : product.title.toLowerCase().includes('eternal awakening')
                          ? '$45.00'
                          : `$${product.variants[0].price}`}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gradient Overlays for Scroll Indication */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#2C2F36] to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#2C2F36] to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
} 
