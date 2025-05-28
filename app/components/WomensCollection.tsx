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
          product.title.toLowerCase().includes('eternal motion')
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
        }));

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
          product.title.toLowerCase().includes('biker shorts') ||
          product.title.toLowerCase().includes('sports bra') ||
          product.id === '6829030f8de41e64de032e9b') &&  // Eternal Ascension Women's Cropped Hoodie
          !product.title.toLowerCase().includes('eternal lotus') &&  // Exclude Eternal Lotus products
          !product.title.toLowerCase().includes('eternal motion')  // Exclude Eternal Motion products
        );

        // Filter for unisex products
        const unisexItems = printifyProducts.filter((product: any) => {
          const title = product.title.toLowerCase();
          const isUnisex = (
            title.includes('eternally woven') ||
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
        }));

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
                  <Link href={`/shop/women/${product.id}`} className="group">
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
                        : product.title.toLowerCase().includes('eternal vibe') && product.title.toLowerCase().includes('leggings')
                        ? '/shop/women/eternal-vibe-leggings'
                        : product.title.toLowerCase().includes('eternal tank')
                        ? '/shop/women/eternal-tank'
                        : product.id === '6829030f8de41e64de032e9b'  // Eternal Ascension Hoodie
                        ? '/shop/women/eternal-ascension-hoodie'
                        : product.title === 'Eternal Glow'  // Eternal Glow
                        ? '/shop/women/eternal-glow'
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
                      ? '/shop/unisex/eternally-woven'
                      : product.title.toLowerCase().includes('eternal lotus') && product.title.toLowerCase().includes('black & grey')
                      ? '/shop/unisex/eternal-lotus-B&G'
                      : product.id === '6813de3b9fb67dd986004dc8'  // Eternal Lotus Purple Graphic Tee
                      ? '/shop/unisex/eternal-lotus-purple'
                      : product.id === '683520806bcc8fd0d80d4a0f'  // New Eternal Ascension T-shirt
                      ? '/shop/unisex/eternal-ascension'
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
