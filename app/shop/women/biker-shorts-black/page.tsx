'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

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
  }[];
}

export default function BikerShortsBlackPage() {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products from Printify');
        }
        const products = await response.json();
        
        // Find the black biker shorts product
        const foundProduct = products.find((p: any) => 
          p.title.toLowerCase().includes('biker shorts') && 
          p.title.toLowerCase().includes('black')
        );
        
        if (!foundProduct) {
          throw new Error('Black biker shorts product not found');
        }

        // Transform the product data
        const transformedProduct: Product = {
          id: foundProduct.id,
          title: foundProduct.title,
          images: foundProduct.images.map((img: any) => ({ 
            src: img.src
          })),
          variants: foundProduct.variants.map((variant: any) => {
            // Parse the variant title to extract size
            const size = variant.title.split(' / ')[0];
            return {
              id: variant.id,
              title: variant.title,
              price: (variant.price / 100).toFixed(2),
              size: size || variant.title,
              color: 'Black'
            };
          })
        };

        setProduct(transformedProduct);
        // Set initial selections
        const uniqueSizes = Array.from(new Set(transformedProduct.variants.map(v => v.size)));
        setSelectedSize(uniqueSizes[0]);
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

    setIsAddingToCart(true);
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
        color: 'Black',
        size: selectedSize,
        price: parseFloat(selectedVariant.price),
        quantity: 1,
        image: product.images[0].src,
        variantId: parseInt(selectedVariant.id),
        logo: 'default'
      });

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

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
            <p className="text-2xl">${selectedVariant?.price}</p>
            
            {/* Size Selection */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Size</h3>
              <div className="grid grid-cols-6 gap-2">
                {uniqueSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedSize === size
                        ? 'border-white bg-white text-[#2C2F36]'
                        : 'border-gray-600 hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || isAddingToCart}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden
                ${!selectedSize || isAddingToCart
                  ? 'bg-gray-500 cursor-not-allowed'
                  : addedToCart
                    ? 'bg-green-600 text-white scale-105'
                    : 'bg-white text-[#2C2F36] hover:bg-gray-200'
                }`}
            >
              <span className={`transition-opacity duration-300 ${addedToCart ? 'opacity-0' : 'opacity-100'}`}>
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </span>
              <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                addedToCart ? 'opacity-100' : 'opacity-0'
              }`}>
                <span className="flex items-center gap-2">
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                  Added to Cart!
                </span>
              </span>
            </button>

            {/* Product Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-300">
                The Eternal Motion Biker Shorts in Black offer a sleek, versatile design for your active lifestyle. 
                These high-waisted shorts feature a modern, minimalist aesthetic with a comfortable, stretchy fit. 
                The moisture-wicking fabric keeps you dry during workouts, while the built-in liner provides 
                extra support and coverage. Perfect for running, cycling, or any high-intensity workout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
