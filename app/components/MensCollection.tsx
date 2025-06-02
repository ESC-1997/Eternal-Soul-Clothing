'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LoadingScreen from '@/app/components/LoadingScreen';

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
  source: 'printify';
}

export default function MensCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eternalCollapse, setEternalCollapse] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        
        // Fetch products from Printify API
        const printifyResponse = await fetch('/api/printify/products');

        if (!printifyResponse.ok) {
          throw new Error('Failed to fetch products from Printify');
        }

        const printifyProducts = await printifyResponse.json();

        // Filter for specific products by name
        const allowedProducts = [
          'Eternally Cozy Legacy Sweatpants',
          'Eternally Cozy New-Gen Sweatpants',
          'Eternal Rebirth',
          'Eternal Awakening',
          'Eternally Untainted',
          'Eternal Shadow'
        ];

        const radarProducts = [
          'Eternal Collapse',
          'Eternal Swords',
          'Baseball Tee',
          'Vow of The Eternal',
          'Eternal Cut',
          'Eternally Bold'
        ];

        // Filter Printify products
        const filteredPrintifyProducts = printifyProducts.filter((product: any) => {
          const isAllowed = allowedProducts.some(name => 
            product.title.toLowerCase().includes(name.toLowerCase())
          );
          console.log('Product:', product.title, 'Is Allowed:', isAllowed); // Debug log
          return isAllowed;
        });

        // Transform Printify products
        const transformedPrintifyProducts = filteredPrintifyProducts.map((product: any) => ({
          id: product.id,
          title: product.title,
          images: product.images.map((img: any) => ({ src: img.src })),
          variants: product.variants.map((variant: any) => ({
            id: variant.id,
            title: variant.title,
            price: (variant.price / 100).toFixed(2)
          })),
          source: 'printify' as const
        }));

        // Sort products
        const allProducts = transformedPrintifyProducts
          .sort((a: Product, b: Product) => {
            // Define the desired order
            const order = [
              'Eternal Rebirth',
              'Eternally Untainted',
              'Eternally Cozy Legacy Sweatpants',
              'Eternally Cozy New-Gen Sweatpants',
              'Eternal Shadow',
              'Eternal Awakening'
            ];
            
            const indexA = order.findIndex(name => a.title.toLowerCase().includes(name.toLowerCase()));
            const indexB = order.findIndex(name => b.title.toLowerCase().includes(name.toLowerCase()));
            
            // If both products are in the order array, sort by their position
            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }
            
            // If only one product is in the order array, prioritize it
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            
            // If neither product is in the order array, sort alphabetically
            return a.title.localeCompare(b.title);
          });

        setProducts(allProducts);

        // Handle radar products
        const radarPrintifyItems = printifyProducts.filter((product: any) => {
          return radarProducts.some(name => 
            product.title.toLowerCase().includes(name.toLowerCase())
          );
        });

        const transformedRadarPrintifyItems = radarPrintifyItems.map((product: any) => {
          // Determine the correct price based on the product title
          let price = '0.00';
          if (product.title.toLowerCase().includes('eternal collapse')) {
            price = '30.00';
          } else if (product.title.toLowerCase().includes('eternal swords')) {
            price = '25.00';
          } else if (product.title.toLowerCase().includes('eternally untainted')) {
            price = '35.00';
          } else if (product.title.toLowerCase().includes('baseball tee')) {
            price = '40.00';
          } else if (product.title.toLowerCase().includes('eternal shadow')) {
            price = '40.00';
          }

          return {
            id: product.id,
            title: product.title,
            images: product.images.map((img: any) => ({ src: img.src })),
            variants: product.variants.map((variant: any) => ({
              id: variant.id,
              title: variant.title,
              price: price
            })),
            source: 'printify' as const
          };
        });

        const allRadarItems = transformedRadarPrintifyItems
          .sort((a: Product, b: Product) => a.title.localeCompare(b.title));

        setEternalCollapse(allRadarItems);
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
    return <LoadingScreen />;
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
        <div className="flex justify-center py-8 pb-12">
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
    <div className="w-full mb-16">
      <div className="flex justify-center py-8 pb-12">
        <Image
          src="/images/Phoenix_ES_DADBE4.png"
          alt="Eternal Soul Men's Collection"
          width={200}
          height={200}
          className="object-contain"
        />
      </div>

      {/* Banner Section */}
      <div className="bg-[#DADBE4] py-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-['Bebas_Neue'] text-[#1B1F3B] tracking-wider text-center">
            ESSENTIALS
          </h2>
        </div>
      </div>
      
      {/* Product Grid */}
      <div className="relative px-4 mb-16">
        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <div className="flex space-x-6 min-w-min">
            {products.map((product) => (
              <div key={product.id} className="flex-none w-[300px] group">
                <div className="bg-white overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 h-[450px]">
                  <Link 
                    href={
                      product.title.toLowerCase().includes('eternally cozy legacy sweatpants')
                        ? '/shop/mens/eternally-cozy-sweatpants'
                        : product.title.toLowerCase().includes('eternally cozy new-gen sweatpants')
                        ? '/shop/mens/eternally-cozy-new-gen-sweatpants'
                        : product.title.toLowerCase().includes('eternal rebirth')
                        ? '/shop/mens/eternal-rebirth'
                        : product.title.toLowerCase().includes('eternal awakening')
                        ? '/shop/mens/eternal-awakening'
                        : product.title.toLowerCase().includes('eternally untainted')
                        ? '/shop/mens/eternally-untainted'
                        : product.title.toLowerCase().includes('eternal shadow')
                        ? '/shop/mens/eternal-shadow'
                        : product.title.toLowerCase().includes('eternal cut')
                        ? '/shop/mens/eternal-cut'
                        : product.title.toLowerCase().includes('vow of the eternal')
                        ? '/shop/mens/vow-of-the-eternal'
                        : product.title.toLowerCase().includes('eternally bold')
                        ? '/shop/mens/eternally-bold'
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
                          : product.title.toLowerCase().includes('eternal cut')
                          ? '$25.00'
                          : product.title.toLowerCase().includes('eternally untainted')
                          ? '$35.00'
                          : product.title.toLowerCase().includes('eternally bold')
                          ? '$25.00'
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

      {/* ON THE RADAR Banner Section */}
      <div className="bg-[#DADBE4] py-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-['Bebas_Neue'] text-[#1B1F3B] tracking-wider text-center">
            ON THE RADAR
          </h2>
        </div>
      </div>

      {/* Second Product Grid */}
      <div className="relative px-4">
        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <div className="flex space-x-6 min-w-min">
            {eternalCollapse && eternalCollapse.map((product) => (
              <div key={product.id} className="flex-none w-[300px] group">
                <div className="bg-white overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 h-[450px]">
                  <Link 
                    href={
                      product.title.toLowerCase().includes('eternal collapse')
                        ? '/shop/mens/eternal-collapse'
                        : product.title.toLowerCase().includes('eternal swords')
                        ? '/shop/mens/eternal-swords'
                        : product.title.toLowerCase().includes('baseball tee')
                        ? '/shop/mens/baseball-tee'
                        : product.title.toLowerCase().includes('eternally untainted')
                        ? '/shop/mens/eternally-untainted'
                        : product.title.toLowerCase().includes('eternal shadow')
                        ? '/shop/mens/eternal-shadow'
                        : product.title.toLowerCase().includes('eternal cut')
                        ? '/shop/mens/eternal-cut'
                        : product.title.toLowerCase().includes('vow of the eternal')
                        ? '/shop/mens/vow-of-the-eternal'
                        : product.title.toLowerCase().includes('eternally bold')
                        ? '/shop/mens/eternally-bold'
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
                          : product.title.toLowerCase().includes('eternal cut')
                          ? '$25.00'
                          : product.title.toLowerCase().includes('eternally untainted')
                          ? '$35.00'
                          : product.title.toLowerCase().includes('eternally bold')
                          ? '$25.00'
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

      {/* Bottom Banner */}
      <div className="w-full h-[250px] relative mt-16">
        <Image
          src="/images/banner.png"
          alt="Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 via-black/30 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
          <h2 className="text-4xl font-['Bebas_Neue'] text-white tracking-wider mb-12">
            DON'T STOP HERE.
          </h2>
          <Link href="/shop/mens/all-products">
            <button className="px-8 py-3 bg-white text-[#1B1F3B] font-['Bebas_Neue'] text-xl tracking-wider hover:bg-gray-100 transition-colors">
              SHOP ALL MEN'S
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}