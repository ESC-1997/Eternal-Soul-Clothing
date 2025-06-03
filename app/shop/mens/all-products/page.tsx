'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LoadingScreen from '@/app/components/LoadingScreen';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  title: string;
  tags: string[];
  category: string;
  gender: string;
  images?: {
    src: string;
    alt: string;
  }[];
  variants?: {
    price: number;
    title: string;
  }[];
  referencePrice?: number;
}

// Filter products for men's collection
const mensProducts = [
  {
    id: "683520806bcc8fd0d80d4a0f",
    title: "Eternal Ascension T-Shirt",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "6831fb16049a5caa620a004e",
    title: "Eternally Untainted",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "68310185f5d9c1a985100823",
    title: "Eternal Shadow",
    tags: ["mens", "tshirt"],
    category: "T-Shirt",
    gender: "Men / Women / Unisex",
    referencePrice: 35.00
  },
  {
    id: "68308fb0091bd77e0309587f",
    title: "Eternal Swords Graphic Tee",
    tags: ["mens", "tshirt"],
    category: "T-Shirt",
    gender: "Men / Women / Unisex",
    referencePrice: 25.00
  },
  {
    id: "682ffd05b28c6bba12087a44",
    title: "Soulful Baseball Tee",
    tags: ["mens", "long sleeve", "shirt"],
    category: "Long Sleeve",
    gender: "Men / Women / Unisex",
    referencePrice: 30.00
  },
  {
    id: "682b9829cb01057ec30ee8fc",
    title: "Eternal Rebirth (Mineral Wash)",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 45.00
  },
  {
    id: "6829066cc8782d21a1039cda",
    title: "Eternally Cozy Legacy Sweatpants",
    tags: ["mens", "sweats", "bottoms"],
    category: "Sweats",
    gender: "Mens",
    referencePrice: 45.00
  },
  {
    id: "6828ede2465b246fe50cc776",
    title: "The Eternal Snap - Black",
    tags: ["accessory", "hat", "headwear"],
    category: "Hat",
    gender: "Men",
    referencePrice: 40.00
  },
  {
    id: "6828e9aa1b86b3997803cc3d",
    title: "Eternal Cut",
    tags: ["mens", "tank top"],
    category: "Tank Top",
    gender: "Men",
    referencePrice: 30.00
  },
  {
    id: "682803161b86b39978039d62",
    title: "Eternal Ascension T-Shirt",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Men",
    referencePrice: 35.00
  },
  {
    id: "68268cde04479021a204cf52",
    title: "Eternally Woven",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Men",
    referencePrice: 40.00
  },
  {
    id: "682265138de41e64de019528",
    title: "Eternal Awakening",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 40.00
  },
  {
    id: "6820b02093284a99660b189d",
    title: "Eternal Divide - Midnight Indigo",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "6820aed333803c3c4502120d",
    title: "Eternal Divide - Red",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "6820ad40471efa6af008268a",
    title: "Eternal Divide - White",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "6820abb0471efa6af0082632",
    title: "Eternal Divide - Grey",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "681fe48893284a99660af2f9",
    title: "Eternal Divide - Black",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "681fe068ebfdaacb650ca1d7",
    title: "Eternal Divide - Violet",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "681acbd3c9285dd17e0dd618",
    title: "Eternal Collapse",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 30.00
  },
  {
    id: "681ac79a1207456e76092f23",
    title: "Vow of the Eternal",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 30.00
  },
  {
    id: "68163f2a42fcdb2640010975",
    title: "Eternal Elegance - Red",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "6816397864bdd1b0c608ecf7",
    title: "Eternal Elegance - Light Blue",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "681637d444c4abfbc303ec25",
    title: "Eternal Elegance - Black Tee",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "6816351f960c7decc0099524",
    title: "Eternal Elegance - Violet",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "68163317960c7decc0099499",
    title: "Eternal Elegance Grey",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "6814c6d00ed813d9e5087aea",
    title: "Eternal Elegance",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "681449c6b03bb3ed0c01a685",
    title: "Phoenix ES Logo",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "6814491964bdd1b0c60875d0",
    title: "ES Phoenix Logo",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "681446b7b03bb3ed0c01a5c7",
    title: "ES Phoenix Logo",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "6814469c5057e72cc20d67c7",
    title: "ES Phoenix Logo",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "681445f7b03bb3ed0c01a591",
    title: "ES Phoenix Logo",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "6837ae4cfc22921d390fac92",
    title: "Eternally Cozy New-Gen Sweatpants",
    tags: ["mens", "sweats", "bottoms"],
    category: "Sweats",
    gender: "Mens",
    referencePrice: 45.00
  },
  {
    id: "6837a77ffd8bf79ea50c2e6f",
    title: "Eternally Bold",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Unisex",
    referencePrice: 25.00
  },
  {
    id: "682cb629b4133fe21803df44",
    title: "The Eternal Snap (Vol. 2) - White",
    tags: ["accessory", "hat", "headwear"],
    category: "Hat",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "682b9cf4a908726ca70b8a8d",
    title: "The Eternal Snap (Vol. 2)",
    tags: ["accessory", "hat", "headwear"],
    category: "Hat",
    gender: "Unisex",
    referencePrice: 35.00
  },
  {
    id: "6828ef61ecd9db648306e954",
    title: "The Eternal Snap - White",
    tags: ["accessory", "hat", "headwear"],
    category: "Hat",
    gender: "Men",
    referencePrice: 40.00
  }
];

export default function AllMensProducts() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    }>
      <AllMensProductsContent />
    </Suspense>
  );
}

function AllMensProductsContent() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        
        // Filter and transform the data
        const filteredProducts = data
          .filter((product: any) => {
            const productId = product.id;
            const isIncluded = mensProducts.some(p => p.id === productId);
            if (!isIncluded) {
              console.log('Product not found in mensProducts:', product.id, product.title);
            }
            return isIncluded;
          })
          .map((product: any) => ({
            id: product.id,
            title: product.title,
            tags: product.tags,
            category: product.category,
            gender: product.gender,
            images: product.images,
            variants: product.variants
          }));

        setProducts(filteredProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle scroll position when returning to the page
  useEffect(() => {
    if (source && !loading) {
      const targetId = `product-${source}-1`;
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [source, loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#DADBE4] flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="min-h-screen bg-[#DADBE4] p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-['Bebas_Neue'] text-[#1B1F3B] tracking-wider mb-8">
            ALL MEN'S PRODUCTS
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product, index) => {
              const row = Math.floor(index / 3) + 1;
              const col = (index % 3) + 1;
              
              return (
                <Link 
                  href={
                    product.title.toLowerCase().includes('eternal divide') || 
                    product.title.toLowerCase().includes('eternal elegance') ||
                    product.title.toLowerCase().includes('phoenix es logo') ||
                    product.title.toLowerCase().includes('es phoenix logo')
                      ? '/shop#customizable-collection'
                      : product.id === "682cb629b4133fe21803df44"
                      ? '/shop/accessories/eternal-snap-vol2w?source=/shop/mens/all-products&row=' + row
                      : product.id === "682b9cf4a908726ca70b8a8d"
                      ? '/shop/accessories/eternal-snap-vol2?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('eternally cozy new-gen sweatpants')
                      ? '/shop/mens/eternally-cozy-new-gen-sweatpants?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('eternally bold')
                      ? '/shop/mens/eternally-bold?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('eternal ascension')
                      ? '/shop/mens/eternal-ascension?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('eternally untainted')
                      ? '/shop/mens/eternally-untainted?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('eternal shadow')
                      ? '/shop/mens/eternal-shadow?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('eternal swords')
                      ? '/shop/mens/eternal-swords?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('soulful baseball')
                      ? '/shop/mens/baseball-tee?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('eternal rebirth')
                      ? '/shop/mens/eternal-rebirth?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('eternally cozy legacy')
                      ? '/shop/mens/eternally-cozy-sweatpants?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('eternal snap - white')
                      ? '/shop/accessories/eternal-snap-white?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('eternal snap - black')
                      ? '/shop/accessories/eternal-snap-black?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('eternally woven')
                      ? '/shop/unisex/eternally-woven?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('eternal awakening')
                      ? '/shop/mens/eternal-awakening?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('eternal collapse')
                      ? '/shop/mens/eternal-collapse?source=/shop/mens/all-products&row=' + row
                      : product.title.toLowerCase().includes('vow of the eternal')
                      ? '/shop/mens/vow-of-the-eternal?source=/shop/mens/all-products&row=' + row
                      : `/shop/mens/${product.id}?source=/shop/mens/all-products&row=` + row
                  }
                  key={product.id}
                  className="group"
                  id={`product-${row}-${col}`}
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {product.images && product.images[0] && (
                      <Image
                        src={product.images[0].src}
                        alt={product.images[0].alt || product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="mt-4 text-left">
                    <h3 className="text-[#1B1F3B] font-medium text-sm">{product.title}</h3>
                    <p className="text-[#1B1F3B] mt-1 text-sm">
                      ${mensProducts.find(p => p.id === product.id)?.referencePrice?.toFixed(2) || 
                        (product.variants && product.variants[0] ? (product.variants[0].price / 100).toFixed(2) : '-')}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
} 