'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import LoadingScreen from '@/app/components/LoadingScreen';
import { useSearchParams } from 'next/navigation';

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
  }[];
}

export default function EternalUntaintedPage() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        const untainted = products.find((p: any) => p.title.toLowerCase().includes('eternally untainted'));
        
        if (!untainted) {
          throw new Error('Product not found');
        }

        const transformedProduct = {
          id: untainted.id,
          title: untainted.title,
          description: untainted.description || 'The Eternal Untainted collection embodies purity and resilience, crafted for those who stand unshaken in their convictions.',
          images: untainted.images.map((img: any) => ({ src: img.src })),
          variants: untainted.variants
            .filter((variant: any) => variant.is_enabled)
            .map((variant: any) => {
              const [color, size] = variant.title.split(' / ');
              return {
                id: variant.id,
                title: variant.title,
                price: Number((variant.price / 100).toFixed(2)),
                size: size.trim(),
                color: color.trim()
              };
            })
        };

        setProduct(transformedProduct);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  // Helper function to check if a variant is in stock
  const isVariantInStock = (color: string, size: string) => {
    if (!product) return false;
    const variant = product.variants.find(v => v.color === color && v.size === size);
    return !!variant;
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;
    const selectedVariant = product.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );
    if (!selectedVariant) return;
    addItem({
      id: product.id,
      variantId: Number(selectedVariant.id),
      name: product.title,
      size: selectedSize,
      color: selectedColor,
      price: Number(selectedVariant.price),
      quantity: 1,
      image: product.images[selectedImage].src,
      logo: 'Standard'
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const availableColors = product ? Array.from(new Set(product.variants.map(v => v.color))) : [];
  const availableSizes = product ? Array.from(new Set(product.variants.map(v => v.size))) : [];

  // Reset selections if they become invalid
  useEffect(() => {
    if (product && selectedColor && selectedSize) {
      if (!isVariantInStock(selectedColor, selectedSize)) {
        setSelectedColor('');
        setSelectedSize('');
      }
    }
  }, [product, selectedColor, selectedSize]);

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

  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href={source === '/shop/mens/all-products' ? '/shop/mens/all-products' : '/shop/mens'}
            className="inline-flex items-center text-white hover:text-[#9F2FFF] transition-colors duration-200"
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
                    selectedImage === index ? 'ring-2 ring-[#9F2FFF]' : ''
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
          <div className="text-white space-y-6">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            {/* Color Selection */}
            <div className="space-y-4">
              <h2 className="text-2xl font-['Bebas_Neue'] tracking-wider">Select Color</h2>
              <div className="grid grid-cols-4 gap-4">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedColor === color
                        ? 'border-[#9F2FFF] bg-[#9F2FFF] text-white'
                        : 'border-gray-600 hover:border-[#9F2FFF]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            {/* Size Selection */}
            <div className="space-y-4">
              <h2 className="text-2xl font-['Bebas_Neue'] tracking-wider">Select Size</h2>
              <div className="grid grid-cols-4 gap-4">
                {availableSizes.map((size) => {
                  const isInStock = selectedColor ? isVariantInStock(selectedColor, size) : true;
                  return (
                    <button
                      key={size}
                      onClick={() => isInStock && setSelectedSize(size)}
                      className={`p-4 border rounded-lg transition-colors ${
                        selectedSize === size
                          ? 'border-[#9F2FFF] bg-[#9F2FFF] text-white'
                          : isInStock
                            ? 'border-gray-600 hover:border-[#9F2FFF]'
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
            <div className="pt-6">
              <p className="text-2xl font-['Bebas_Neue'] tracking-wider mb-4">
                {selectedSize && selectedColor && isVariantInStock(selectedColor, selectedSize)
                  ? `$${product.variants.find(v => v.size === selectedSize && v.color === selectedColor)?.price.toFixed(2)}`
                  : 'Select a color and size'}
              </p>
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || !isVariantInStock(selectedColor, selectedSize)}
                className={`w-full py-4 rounded-lg font-semibold transition-colors ${
                  !selectedSize || !selectedColor || !isVariantInStock(selectedColor, selectedSize)
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-[#9F2FFF] text-white hover:bg-[#8A2BE2]'
                }`}
              >
                {!selectedSize || !selectedColor
                  ? 'Select options'
                  : addedToCart
                    ? 'Added to Cart!'
                    : 'Add to Cart'}
              </button>
            </div>
            {/* Description */}
            <div className="space-y-2">
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
