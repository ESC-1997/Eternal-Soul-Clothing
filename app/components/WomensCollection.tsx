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

export default function WomensCollection() {
  const [womenProducts, setWomenProducts] = useState<Product[]>([]);
  const [unisexProducts, setUnisexProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from Printify API
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products from Printify');
        }
        const printifyProducts = await response.json();

        // Filter for women's products
        const womenItems = printifyProducts.filter((product: any) => 
          (product.title.toLowerCase().includes('women') || 
          product.title.toLowerCase().includes('womens') ||
          product.title.toLowerCase().includes('biker shorts') ||
          product.title.toLowerCase().includes('sports bra') ||
          product.id === '6829030f8de41e64de032e9b')  // Eternal Ascension Women's Cropped Hoodie
        );

        // Filter for unisex products
        const unisexItems = printifyProducts.filter((product: any) => 
          product.title.toLowerCase().includes('eternally woven') ||
          product.id === '682803161b86b39978039d62'  // Eternal Ascension T-shirt
        );

        console.log('Product filtering:', {
          womenItems: womenItems.map((p: { id: string; title: string }) => ({ id: p.id, title: p.title })),
          unisexItems: unisexItems.map((p: { id: string; title: string }) => ({ id: p.id, title: p.title }))
        });

        // Transform the product data
        const transformedWomenProducts = womenItems.map((product: any) => ({
          id: product.id,
          title: product.title,
          images: product.images.map((img: any) => ({ src: img.src })),
          variants: product.variants
            .filter((variant: any) => variant.is_enabled)
            .map((variant: any) => ({
              id: variant.id,
              title: variant.title,
              price: Number((variant.price / 100).toFixed(2))
            }))
        }));

        const transformedUnisexProducts = unisexItems.map((product: any) => ({
          id: product.id,
          title: product.title,
          images: product.images.map((img: any) => ({ src: img.src })),
          variants: product.variants
            .filter((variant: any) => variant.is_enabled)
            .map((variant: any) => ({
              id: variant.id,
              title: variant.title,
              price: Number((variant.price / 100).toFixed(2))
            }))
        }));

        console.log('Eternally Woven product variants after filtering:', 
          transformedUnisexProducts.map((product: any) => ({
            title: product.title,
            variants: product.variants
          }))
        );

        setWomenProducts(transformedWomenProducts);
        setUnisexProducts(transformedUnisexProducts);
      } catch (err) {
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

  return (
    <div className="w-full">
      <div className="flex justify-center py-8">
        <Image
          src="/images/Phoenix_ES_DADBE4.png"
          alt="Eternal Soul Women's Collection"
          width={200}
          height={200}
          className="object-contain"
        />
      </div>

      {/* First Banner Section */}
      <div className="bg-white py-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-['Bebas_Neue'] text-[#1B1F3B] tracking-wider text-center">
            TAILORED FOR HER
          </h2>
        </div>
      </div>
      
      {/* Women's Products Scroll Container */}
      <div className="relative px-4">
        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <div className="flex space-x-6 min-w-min">
            {womenProducts.map((product) => (
              <div key={product.id} className="flex-none w-[300px] group">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 h-[450px]">
                  <Link 
                    href={
                      product.title.toLowerCase().includes('sports bra')
                        ? '/shop/women/sports-bra'
                        : product.title.toLowerCase().includes('biker shorts') && product.title.toLowerCase().includes('violet')
                        ? '/shop/women/biker-shorts-violet'
                        : product.title.toLowerCase().includes('biker shorts') && product.title.toLowerCase().includes('black')
                        ? '/shop/women/biker-shorts-black'
                        : product.title.toLowerCase().includes('eternal vibe') && product.title.toLowerCase().includes('leggings')
                        ? '/shop/women/eternal-vibe-leggings'
                        : product.id === '6829030f8de41e64de032e9b'  // Eternal Ascension Hoodie
                        ? '/shop/women/eternal-ascension-hoodie'
                        : `/shop/women/${product.id}`
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
                      <p className="text-base text-gray-600">${product.variants[0].price}</p>
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

      {/* Second Banner Section */}
      <div className="bg-white py-4 mt-12 mb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-['Bebas_Neue'] text-[#1B1F3B] tracking-wider text-center">
            UNIFIED FIT (UNISEX)
          </h2>
        </div>
      </div>

      {/* Unified Fit Products */}
      <div className="relative px-4">
        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <div className="flex space-x-6 min-w-min">
            {unisexProducts.map((product) => (
              <div key={product.id} className="flex-none w-[300px] group">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 h-[450px]">
                  <Link
                    href={product.title.toLowerCase().includes('eternally woven') 
                      ? '/shop/unisex/eternally-woven'
                      : product.id === '682803161b86b39978039d62'  // Eternal Ascension T-shirt
                      ? '/shop/unisex/eternal-ascension'
                      : `/shop/product/${product.id}`}
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
                      <p className="text-base text-gray-600">${product.variants[0].price}</p>
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
