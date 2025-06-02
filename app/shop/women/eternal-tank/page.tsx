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
    is_enabled: boolean;
    is_available: boolean;
  }[];
}

export default function EternalTank() {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Color to image index mapping
  const colorImageMap: { [key: string]: number } = {
    'Solid White Blend': 0,
    'Solid Black Blend': 2,
    'Athletic Heather': 4,
    'Solid Pink Blend': 6
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products from Printify');
        }
        const products = await response.json();
        
        const foundProduct = products.find((p: any) => 
          p.title.toLowerCase().includes('eternal tank')
        );
        
        if (!foundProduct) {
          throw new Error('Product not found');
        }

        // Log the available colors from the API
        console.log('Available colors from API:', foundProduct.variants.map((v: any) => v.title));

        const transformedProduct: Product = {
          id: foundProduct.id,
          title: foundProduct.title,
          images: foundProduct.images.map((img: any) => ({ 
            src: img.src
          })),
          variants: foundProduct.variants
            .filter((variant: any) => variant.is_enabled) // Only include enabled variants
            .map((variant: any) => {
              const [color, size] = variant.title.split(' / ');
              return {
                id: variant.id,
                title: variant.title,
                price: (variant.price / 100).toFixed(2),
                size: size?.trim() || variant.title,
                color: color?.trim() || 'Black',
                is_enabled: variant.is_enabled,
                is_available: variant.is_available
              };
            })
        };

        setProduct(transformedProduct);
        
        // Get unique enabled colors and sizes
        const uniqueColors = Array.from(new Set(
          transformedProduct.variants
            .filter(v => v.is_enabled)
            .map(v => v.color)
        ));
        const uniqueSizes = Array.from(new Set(
          transformedProduct.variants
            .filter(v => v.is_enabled)
            .map(v => v.size)
        ));
        
        // Log the unique colors after transformation
        console.log('Unique colors after transformation:', uniqueColors);
        
        setSelectedSize(uniqueSizes[0]);
        setSelectedColor(uniqueColors[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleAddToCart = async () => {
    if (!product || !selectedSize || !selectedColor) return;

    setIsAddingToCart(true);
    try {
      const selectedVariant = product.variants.find(
        v => v.size === selectedSize && v.color === selectedColor
      );

      if (!selectedVariant) {
        throw new Error('Selected variant not found');
      }

      if (!selectedVariant.is_available) {
        throw new Error('Selected variant is out of stock');
      }

      addItem({
        id: product.id,
        name: product.title,
        color: selectedColor,
        size: selectedSize,
        price: parseFloat(selectedVariant.price),
        quantity: 1,
        image: product.images[selectedImage].src,
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

  // Get unique enabled colors and sizes
  const uniqueColors = Array.from(new Set(
    product.variants
      .filter(v => v.is_enabled)
      .map(v => v.color)
  ));
  const uniqueSizes = Array.from(new Set(
    product.variants
      .filter(v => v.is_enabled)
      .map(v => v.size)
  ));

  const selectedVariant = product.variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  );

  const isVariantAvailable = selectedVariant?.is_available ?? false;

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
            <h1 className="text-4xl font-['Bebas_Neue'] tracking-wider">{product.title}</h1>
            
            {/* Size Selection */}
            <div className="space-y-4">
              <h2 className="text-2xl font-['Bebas_Neue'] tracking-wider">Select Size</h2>
              <div className="grid grid-cols-4 gap-4">
                {uniqueSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-4 border rounded-lg transition-colors ${
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

            {/* Color Selection */}
            <div className="space-y-4">
              <h2 className="text-2xl font-['Bebas_Neue'] tracking-wider">Select Color</h2>
              <div className="grid grid-cols-4 gap-4">
                {uniqueColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      // Update the selected image based on the color
                      const imageIndex = colorImageMap[color];
                      if (imageIndex !== undefined) {
                        setSelectedImage(imageIndex);
                      }
                    }}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedColor === color
                        ? 'border-white bg-white text-[#2C2F36]'
                        : 'border-gray-600 hover:border-white'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <p className="text-2xl font-['Bebas_Neue'] tracking-wider mb-4">
                ${selectedVariant?.price}
              </p>
              {!isVariantAvailable && (
                <p className="text-red-500 mb-4">Out of Stock</p>
              )}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !selectedSize || !selectedColor || !isVariantAvailable}
                className={`w-full py-4 rounded-lg font-semibold transition-colors ${
                  isAddingToCart || !selectedSize || !selectedColor || !isVariantAvailable
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-white text-[#2C2F36] hover:bg-gray-100'
                }`}
              >
                {isAddingToCart ? 'Adding...' : addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 