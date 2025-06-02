'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useCart } from '../../../context/CartContext';
import ShopNavigation from '../../../components/ShopNavigation';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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

export default function EternalSnapPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    }>
      <EternalSnapContent />
    </Suspense>
  );
}

function EternalSnapContent() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        const snap = products.find((p: any) => {
          const normalizedTitle = p.title.toLowerCase().replace(/\s+/g, '');
          return normalizedTitle === 'theeternalsnap(vol.2)'.toLowerCase() || 
                 normalizedTitle === 'theeternalsnap(vol.2)-white'.toLowerCase();
        });

        if (snap) {
          setProduct({
            id: snap.id,
            title: snap.title,
            images: snap.images.map((img: any) => ({ src: img.src })),
            variants: snap.variants.map((variant: any) => ({
              id: variant.id,
              title: variant.title,
              price: (variant.price / 100).toFixed(2)
            }))
          });
          if (snap.variants.length > 0) {
            setSelectedVariant(snap.variants[0].id);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error || 'Product not found'}
      </div>
    );
  }

  const handleAddToCart = () => {
    const variant = product.variants.find(v => v.id === selectedVariant);
    if (variant) {
      addItem({
        id: product.id,
        name: product.title,
        price: Number(variant.price),
        quantity,
        image: product.images[0].src,
        variantId: Number(variant.id),
        color: 'White',
        logo: 'Standard',
        size: variant.title
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="max-w-7xl mx-auto relative">
        <ShopNavigation />
        <div className="pt-24 px-4">
          {/* Back to Products Button */}
          <div className="mb-8">
            <Link 
              href={source || "/shop/accessories"}
              className="inline-flex items-center text-white hover:text-[#9F2FFF] transition-colors text-lg font-medium"
            >
              <svg 
                className="w-6 h-6 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              Back to Products
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-[500px] bg-white rounded-lg overflow-hidden">
                <Image
                  src={product.images[selectedImage].src}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Thumbnail Gallery */}
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex-none w-20 h-20 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-white' : ''
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            {/* Product Details */}
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p className="text-2xl mb-6">$24.99</p>
              
              {/* Variant Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Size</label>
                <select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="w-full bg-white text-black rounded-md p-2"
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-white text-black px-3 py-1 rounded-md"
                  >
                    -
                  </button>
                  <span className="text-xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-white text-black px-3 py-1 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#9F2FFF] text-white py-3 rounded-md hover:bg-[#8A2BE2] transition-colors"
              >
                Add to Cart
              </button>

              {/* Product Description */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                <p className="text-gray-300">
                  The Eternal Snap (Vol.2) - White is a premium snapback hat that embodies the essence of Eternal Soul's design philosophy. 
                  This iconic piece features:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                  <li>Premium quality construction with structured crown</li>
                  <li>Classic snapback closure for adjustable fit</li>
                  <li>Embroidered Eternal Soul logo and design elements</li>
                  <li>Contrasting black details on white base</li>
                  <li>Perfect for everyday wear or special occasions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 