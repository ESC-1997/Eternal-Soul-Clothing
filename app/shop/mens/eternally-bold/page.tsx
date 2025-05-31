'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import ShopNavigation from '@/app/components/ShopNavigation';
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
    size: string;
    color: string;
    is_enabled: boolean;
    is_available: boolean;
  }[];
}

export default function EternallyBoldPage() {
  const { addItem } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/printify/products');
        const products = await response.json();
        
        const eternallyBold = products.find((p: any) => 
          p.title.toLowerCase().includes('eternally bold')
        );

        if (!eternallyBold) {
          throw new Error('Eternally Bold product not found');
        }

        // Transform the product data to include size and color information
        const transformedProduct: Product = {
          id: eternallyBold.id,
          title: eternallyBold.title,
          images: eternallyBold.images.map((img: any) => ({ src: img.src })),
          variants: eternallyBold.variants
            .filter((variant: any) => variant.is_enabled)
            .map((variant: any) => ({
              id: variant.id,
              title: variant.title,
              price: (variant.price / 100).toFixed(2),
              size: variant.title.split(' / ')[0],
              color: variant.title.split(' / ')[1],
              is_enabled: variant.is_enabled,
              is_available: variant.is_available
            }))
        };

        setProduct(transformedProduct);

        // Set initial selections
        if (transformedProduct.variants.length > 0) {
          const firstVariant = transformedProduct.variants[0];
          setSelectedSize(firstVariant.size);
          setSelectedColor(firstVariant.color);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;

    const selectedVariant = product.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );

    if (!selectedVariant) return;

    addItem({
      id: selectedVariant.id,
      name: product.title,
      price: 25.00,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      image: product.images[0].src,
      logo: 'default'
    });

    // Show confirmation or redirect
    router.push('/cart');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#2C2F36]">
        <div className="max-w-7xl mx-auto relative">
          <ShopNavigation />
          <div className="flex justify-center items-center h-screen">
            <div className="animate-pulse">
              <Image
                src="/images/Phoenix_ES_DADBE4.png"
                alt="Loading..."
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#2C2F36]">
        <div className="max-w-7xl mx-auto relative">
          <ShopNavigation />
          <div className="flex justify-center items-center h-screen">
            <div className="text-white text-center">
              <h1 className="text-2xl mb-4">Error: {error || 'Product not found'}</h1>
              <button
                onClick={() => router.back()}
                className="bg-[#9F2FFF] text-white px-6 py-2 rounded hover:bg-[#8A2BE2] transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Get unique sizes and colors
  const availableSizes = Array.from(new Set(product.variants.map(v => v.size)));
  const availableColors = Array.from(new Set(product.variants.map(v => v.color)));

  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href={source === '/shop/mens/all-products' ? '/shop/mens/all-products' : '/shop/mens'}
            className="inline-flex items-center text-white hover:text-gray-300 transition-colors duration-200"
          >
            <svg 
              className="w-5 h-5 mr-2" 
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

        <div className="max-w-7xl mx-auto relative">
          <ShopNavigation />
          <div className="pt-8">
            <button
              onClick={() => router.back()}
              className="mb-8 text-white hover:text-[#9F2FFF] transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Collection
            </button>

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
                <h1 className="text-4xl font-['Bebas_Neue'] mb-4">{product.title}</h1>
                <p className="text-2xl font-['Bebas_Neue'] mb-6">$25.00</p>

                {/* Size Selection */}
                <div className="mb-6">
                  <h2 className="text-lg font-['Bebas_Neue'] mb-3">Size</h2>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded ${
                          selectedSize === size
                            ? 'border-[#9F2FFF] bg-[#9F2FFF] text-white'
                            : 'border-white text-white hover:border-[#9F2FFF]'
                        } transition-colors`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <h2 className="text-lg font-['Bebas_Neue'] mb-3">Color</h2>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded ${
                          selectedColor === color
                            ? 'border-[#9F2FFF] bg-[#9F2FFF] text-white'
                            : 'border-white text-white hover:border-[#9F2FFF]'
                        } transition-colors`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="mb-6">
                  <h2 className="text-lg font-['Bebas_Neue'] mb-3">Quantity</h2>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 border border-white text-white hover:border-[#9F2FFF] transition-colors"
                    >
                      -
                    </button>
                    <span className="text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 border border-white text-white hover:border-[#9F2FFF] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor}
                  className={`w-full py-3 px-6 rounded text-white font-['Bebas_Neue'] text-xl transition-colors ${
                    selectedSize && selectedColor
                      ? 'bg-[#9F2FFF] hover:bg-[#8A2BE2]'
                      : 'bg-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add to Cart
                </button>

                {/* Product Description */}
                <div className="mt-8">
                  <h2 className="text-lg font-['Bebas_Neue'] mb-3">Description</h2>
                  <p className="text-gray-300">
                    The Eternally Bold collection represents strength and confidence. Each piece is crafted with premium materials and features our signature design elements, making a bold statement wherever you go.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
