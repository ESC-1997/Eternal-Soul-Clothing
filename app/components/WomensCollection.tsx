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
}

export default function WomensCollection() {
  const [womenProducts, setWomenProducts] = useState<Product[]>([]);
  const [unisexProducts, setUnisexProducts] = useState<Product[]>([]);
  const [eternalMotionProducts, setEternalMotionProducts] = useState<Product[]>([]);
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

        // Filter for Eternal Motion products
        const eternalMotionItems = printifyProducts.filter((product: any) => 
          product.title.toLowerCase().includes('eternal motion') ||
          product.title.toLowerCase().includes('eternal tank') ||
          product.title.toLowerCase().includes('sports bra')
        );

        // Transform Eternal Motion products
        const transformedEternalMotionProducts = eternalMotionItems.map((product: any) => ({
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
        }))
        .sort((a: Product, b: Product) => {
          // Define the desired order
          const order = [
            'Eternal Motion (Biker Shorts) - Black',
            'Eternal Motion (Biker Shorts) - Violet',
            'Eternal Motion (Biker Shorts) - Dark Grey',
            'Eternal Motion (Biker Shorts) - Charm Pink',
            'Eternal Motion (Biker Shorts) - Midnight Waves',
            'Eternal Tank - Women\'s Summer Top',
            'Eternal Soul Sports Bra'
          ];
          
          const indexA = order.findIndex(title => a.title.includes(title));
          const indexB = order.findIndex(title => b.title.includes(title));
          
          // If both products are in the order list, sort by their position
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          
          // If only one product is in the order list, prioritize it
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          
          // If neither product is in the order list, sort alphabetically
          return a.title.localeCompare(b.title);
        });

        setEternalMotionProducts(transformedEternalMotionProducts);

        // Debug: Log initial API response for Eternal Lotus products
        console.log('=== INITIAL API RESPONSE ===');
        const eternalLotusProducts = printifyProducts.filter((p: any) => 
          p.id === '6813de3b9fb67dd986004dc8' || 
          p.id === '6813ea12a7ab600a950c4b5a'
        );
        console.log('Eternal Lotus products in API response:', eternalLotusProducts.map((p: any) => ({
          id: p.id,
          title: p.title,
          variants: p.variants.map((v: any) => ({
            id: v.id,
            title: v.title,
            is_enabled: v.is_enabled,
            is_available: v.is_available
          }))
        })));

        // Filter for women's products
        const womenItems = printifyProducts.filter((product: any) => 
          (product.title.toLowerCase().includes('women') || 
          product.title.toLowerCase().includes('womens') ||
          product.id === '6829030f8de41e64de032e9b' ||  // Eternal Ascension Women's Cropped Hoodie
          product.id === '682dbe84049a5caa6208ed11' ||  // Eternal Vibe Women's Casual Leggings - Black
          product.id === '683763a0ced8bcc1e60d3a62' ||  // Eternal Vibe Women's Casual Leggings - Grey
          product.id === '683763a0ced8bcc1e60d3a63' ||  // Eternal Vibe Women's Casual Leggings - Midnight Indigo
          product.title.toLowerCase().includes('eternal love')) &&  // Add Eternal Love
          !product.title.toLowerCase().includes('eternal lotus') &&  // Exclude Eternal Lotus products
          !product.title.toLowerCase().includes('eternal motion') &&  // Exclude Eternal Motion products
          !product.title.toLowerCase().includes('eternal tank') &&  // Exclude Eternal Tank
          !product.title.toLowerCase().includes('sports bra')  // Exclude Sports Bra
        );

        // Filter for unisex products
        const unisexItems = printifyProducts.filter((product: any) => {
          const title = product.title.toLowerCase();
          const isUnisex = (
            title.includes('eternally woven') ||
            title.includes('eternally untainted') ||
            product.id === '683520806bcc8fd0d80d4a0f' ||  // New Eternal Ascension T-shirt
            product.id === '6813de3b9fb67dd986004dc8' ||  // Eternal Lotus - Purple Floral Graphic Tee
            product.id === '6813ea12a7ab600a950c4b5a' ||  // Eternal Lotus (Black & Grey)
            product.title === 'Eternal Glow' ||  // Add Eternal Glow
            product.id === '68326c3269e742166100b813'  // Eternal Glow ID
          );
          
          // Debug: Log each product being checked
          if (product.id === '6813de3b9fb67dd986004dc8' || product.id === '6813ea12a7ab600a950c4b5a') {
            console.log('Checking Eternal Lotus product:', {
              id: product.id,
              title: product.title,
              isUnisex: isUnisex,
              matches: {
                eternallyWoven: title.includes('eternally woven'),
                eternallyUntainted: title.includes('eternally untainted'),
                isAscension: product.id === '683520806bcc8fd0d80d4a0f',
                isPurpleTee: product.id === '6813de3b9fb67dd986004dc8',
                isBlackGrey: product.id === '6813ea12a7ab600a950c4b5a'
              }
            });
          }
          
          return isUnisex;
        });

        // Debug: Log filtered unisex items
        console.log('=== FILTERED UNISEX ITEMS ===');
        console.log('Unisex items after filtering:', unisexItems.map((p: any) => ({
          id: p.id,
          title: p.title
        })));

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
        }))
        .sort((a: Product, b: Product) => {
          // Define the desired order for women's products
          const order = [
            'Eternal Vibe Women\'s Casual Leggings - Black',
            'Eternal Vibe Women\'s Casual Leggings - Grey',
            'Eternal Vibe Women\'s Casual Leggings - Midnight Indigo',
            'Eternal Vibe Women\'s Casual Leggings - Light Pink',
            'Eternal Ascension Women\'s Cropped Hoodie',
            'Eternal Love'  // Add Eternal Love to the order
          ];
          
          const indexA = order.findIndex(title => a.title.includes(title));
          const indexB = order.findIndex(title => b.title.includes(title));
          
          // If both products are in the order list, sort by their position
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          
          // If only one product is in the order list, prioritize it
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          
          // If neither product is in the order list, sort alphabetically
          return a.title.localeCompare(b.title);
        });

        const transformedUnisexProducts = unisexItems.map((product: any) => {
          const filteredVariants = product.variants.filter((variant: any) => variant.is_enabled);
          
          // Debug: Log Eternal Lotus products after variant filtering
          if (product.id === '6813de3b9fb67dd986004dc8' || product.id === '6813ea12a7ab600a950c4b5a') {
            console.log('Eternal Lotus product after variant filtering:', {
              id: product.id,
              title: product.title,
              variants: filteredVariants.map((v: any) => ({
                id: v.id,
                title: v.title,
                is_enabled: v.is_enabled,
                is_available: v.is_available
              }))
            });
          }
          
          return {
            ...product,
            customizable: product.title && product.title.includes('ES Phoenix Logo'),
            variants: filteredVariants
          };
        });

        // Debug: Final transformed products
        console.log('=== FINAL TRANSFORMED PRODUCTS ===');
        console.log('Transformed unisex products:', transformedUnisexProducts.map((p: any) => ({
          id: p.id,
          title: p.title,
          variantCount: p.variants.length
        })));

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
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full pt-8">
      <div className="flex justify-center py-8">
        <Image
          src="/images/Phoenix_ES_DADBE4.png"
          alt="Eternal Soul Women's Collection"
          width={200}
          height={200}
          className="object-contain"
        />
      </div>

      {/* Luminous Days Section */}
      <div className="bg-[#DADBE4] py-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-['Bebas_Neue'] text-[#1B1F3B] tracking-wider text-center">
            LUMINOUS DAYS
          </h2>
        </div>
      </div>
      
      {/* Eternal Motion Products Scroll Container */}
      <div className="relative px-4 mb-16">
        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <div className="flex space-x-6 min-w-min">
            {eternalMotionProducts.map((product) => (
              <div key={product.id} className="flex-none w-[300px] group">
                <div className="bg-white overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 h-[450px]">
                  <Link 
                    href={
                      product.title.toLowerCase().includes('biker shorts') && product.title.toLowerCase().includes('black')
                        ? '/shop/women/biker-shorts-black'
                        : product.title.toLowerCase().includes('biker shorts') && product.title.toLowerCase().includes('violet')
                        ? '/shop/women/biker-shorts-violet'
                        : product.title.toLowerCase().includes('biker shorts') && product.title.toLowerCase().includes('dark grey')
                        ? '/shop/women/biker-shorts-dark-grey'
                        : product.title.toLowerCase().includes('biker shorts') && product.title.toLowerCase().includes('charm pink')
                        ? '/shop/women/biker-shorts-charm-pink'
                        : product.title.toLowerCase().includes('biker shorts') && product.title.toLowerCase().includes('midnight waves')
                        ? '/shop/women/biker-shorts-midnight-waves'
                        : product.title.toLowerCase().includes('eternal tank')
                        ? '/shop/women/eternal-tank'
                        : product.title.toLowerCase().includes('sports bra') && product.title.toLowerCase().includes('grey')
                        ? '/shop/women/sports-bra-grey'
                        : product.title.toLowerCase().includes('sports bra')
                        ? '/shop/women/sports-bra'
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

      {/* First Banner Section */}
      <div className="bg-[#DADBE4] py-4 mb-8">
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
                <div className="bg-white overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 h-[450px]">
                  <Link 
                    href={
                      product.title.toLowerCase().includes('sports bra')
                        ? '/shop/women/sports-bra'
                        : product.title.toLowerCase().includes('biker shorts') && product.title.toLowerCase().includes('violet')
                        ? '/shop/women/biker-shorts-violet'
                        : product.title.toLowerCase().includes('biker shorts') && product.title.toLowerCase().includes('black')
                        ? '/shop/women/biker-shorts-black'
                        : product.id === '682dbe84049a5caa6208ed11'  // Black Leggings
                        ? '/shop/women/eternal-vibe-leggings'
                        : product.id === '683763a0ced8bcc1e60d3a62'  // Grey Leggings
                        ? '/shop/women/eternal-vibe-leggings-grey'
                        : product.id === '683763a0ced8bcc1e60d3a63'  // Midnight Indigo Leggings
                        ? '/shop/women/eternal-vibe-leggings-midnight-indigo'
                        : product.title.toLowerCase().includes('eternal tank')
                        ? '/shop/women/eternal-tank'
                        : product.id === '6829030f8de41e64de032e9b'  // Eternal Ascension Hoodie
                        ? '/shop/women/eternal-ascension-hoodie'
                        : product.title === 'Eternal Glow'  // Eternal Glow
                        ? '/shop/women/eternal-glow'
                        : product.title.toLowerCase().includes('eternal love')  // Eternal Love
                        ? '/shop/women/eternal-love'
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
      <div className="bg-[#DADBE4] py-4 mt-12 mb-8">
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
                <div className="bg-white overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 h-[450px]">
                  <Link
                    href={product.title.toLowerCase().includes('eternally woven') 
                      ? '/shop/unisex/eternally-woven?source=women'
                      : product.title.toLowerCase().includes('eternally untainted')
                      ? '/shop/mens/eternally-untainted?source=women'
                      : product.title.toLowerCase().includes('eternal lotus') && product.title.toLowerCase().includes('black & grey')
                      ? '/shop/unisex/eternal-lotus-B&G?source=women'
                      : product.id === '6813de3b9fb67dd986004dc8'  // Eternal Lotus Purple Graphic Tee
                      ? '/shop/unisex/eternal-lotus-purple?source=women'
                      : product.id === '683520806bcc8fd0d80d4a0f'  // New Eternal Ascension T-shirt
                      ? '/shop/unisex/eternal-ascension?source=women'
                      : product.title === 'Eternal Glow'  // Eternal Glow
                      ? '/shop/women/eternal-glow'
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
