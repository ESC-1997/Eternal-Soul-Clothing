'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import LoadingScreen from '@/app/components/LoadingScreen';

interface Product {
  id: string;
  title: string;
  description: string;
  images: {
    src: string;
  }[];
  variants: {
    id: string;
    title: string;
    price: number;
    size: string;
    color: string;
    isAvailable: boolean;
  }[];
}

export default function BikerShortsMidnightWavesPage() {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products from Printify');
        }
        const products = await response.json();
        
        // Find the midnight waves biker shorts product
        const foundProduct = products.find((p: any) => 
          p.title.toLowerCase().includes('biker shorts') && 
          p.title.toLowerCase().includes('midnight waves')
        );
        
        if (!foundProduct) {
          throw new Error('Midnight waves biker shorts product not found');
        }

        // Transform the product data
        const transformedProduct: Product = {
          id: foundProduct.id,
          title: foundProduct.title,
          description: foundProduct.description || 'The Eternal Motion Biker Shorts in Midnight Waves combine style and performance for your active lifestyle. These high-waisted shorts feature a sleek, modern design with a comfortable, stretchy fit. The moisture-wicking fabric keeps you dry during workouts, while the built-in liner provides extra support and coverage. Perfect for running, cycling, or any high-intensity workout.',
          images: foundProduct.images.map((img: any) => ({ 
            src: img.src
          })),
          variants: foundProduct.variants
            .filter((variant: any) => variant.is_enabled)
            .map((variant: any) => {
              // Parse the variant title to extract size
              const size = variant.title.split(' / ')[0];
              return {
                id: variant.id,
                title: variant.title,
                price: Number((variant.price / 100).toFixed(2)),
                size: size || variant.title,
                color: 'Midnight Waves',
                isAvailable: variant.is_available
              };
            })
        };

        setProduct(transformedProduct);
        // Set initial selections
        const availableSizes = transformedProduct.variants
          .filter(v => v.isAvailable)
          .map(v => v.size);
        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return;

    try {
      const selectedVariant = product.variants.find(
        v => v.size === selectedSize
      );

      if (!selectedVariant) {
        throw new Error('Selected variant not found');
      }

      addItem({
        id: product.id,
        name: product.title,
        color: 'Midnight Waves',
        size: selectedSize,
        price: selectedVariant.price,
        quantity: 1,
        image: product.images[0].src,
        variantId: parseInt(selectedVariant.id),
        logo: 'default'
      });

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  // Helper function to check if a variant is in stock
  const isVariantInStock = (size: string) => {
    if (!product) return false;
    const variant = product.variants.find(v => v.size === size);
    return variant?.isAvailable ?? false;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !product) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error || 'Product not found'}
      </div>
    );
  }

  const uniqueSizes = Array.from(new Set(product.variants.map(v => v.size)));
  const selectedVariant = product.variants.find(
    v => v.size === selectedSize
  );

  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/shop/women"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage].src}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Thumbnail gallery */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-20 aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-white' : ''
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={`${product.title} - View ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="text-white space-y-6">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-2xl font-['Bebas_Neue'] tracking-wider">
              {selectedSize && isVariantInStock(selectedSize)
                ? `$${selectedVariant?.price.toFixed(2)}`
                : 'Select a size'}
            </p>
            
            {/* Size Selection */}
            <div className="space-y-4">
              <h2 className="text-2xl font-['Bebas_Neue'] tracking-wider">Select Size</h2>
              <div className="grid grid-cols-4 gap-4">
                {uniqueSizes.map((size) => {
                  const isInStock = isVariantInStock(size);
                  return (
                    <button
                      key={size}
                      onClick={() => isInStock && setSelectedSize(size)}
                      className={`p-4 border rounded-lg transition-colors ${
                        selectedSize === size
                          ? 'border-white bg-white text-[#2C2F36]'
                          : isInStock
                            ? 'border-gray-600 hover:border-white'
                            : 'border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {size}
                      {!isInStock && <span className="block text-xs mt-1">Out of Stock</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !isVariantInStock(selectedSize)}
              className={`w-full py-4 rounded-lg font-semibold transition-colors ${
                !selectedSize || !isVariantInStock(selectedSize)
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-white text-[#2C2F36] hover:bg-gray-100'
              }`}
            >
              {!selectedSize
                ? 'Select a size'
                : !isVariantInStock(selectedSize)
                  ? 'Out of Stock'
                  : addedToCart
                    ? 'Added to Cart!'
                    : 'Add to Cart'}
            </button>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-300">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 