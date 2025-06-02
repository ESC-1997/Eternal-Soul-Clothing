'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useSearchParams } from 'next/navigation';
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
    size: string;
    color: string;
    is_enabled: boolean;
    is_available: boolean;
  }[];
}

export default function EternalAscensionPage() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const products = await response.json();
        const eternalAscension = products.find((p: any) => 
          p.title.toLowerCase().includes('eternal ascension')
        );
        
        if (eternalAscension) {
          const transformedProduct: Product = {
            id: eternalAscension.id,
            title: eternalAscension.title,
            images: eternalAscension.images.map((img: any) => ({ src: img.src })),
            variants: eternalAscension.variants
              .filter((variant: any) => variant.is_enabled)
              .map((variant: any) => {
                const [color, size] = variant.title.split(' / ');
                return {
                  id: variant.id,
                  title: variant.title,
                  price: (variant.price / 100).toFixed(2),
                  size: size.trim(),
                  color: color.trim(),
                  is_enabled: variant.is_enabled,
                  is_available: variant.is_available
                };
              })
          };

          setProduct(transformedProduct);
          const uniqueSizes = Array.from(new Set(
            transformedProduct.variants
              .filter(v => v.is_enabled)
              .map(v => v.size)
          ));
          
          if (uniqueSizes.length > 0) {
            setSelectedSize(uniqueSizes[0]);
          }
        } else {
          throw new Error('Product not found');
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

  const uniqueColors = Array.from(new Set(
    product.variants
      .filter(v => v.is_enabled)
      .map(v => v.color)
  )).sort();

  const uniqueSizes = Array.from(new Set(
    product.variants
      .filter(v => v.is_enabled)
      .map(v => v.size)
  )).sort((a, b) => {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
    return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
  });

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
                    selectedImage === index ? 'ring-2 ring-[#9F2FFF]' : ''
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
            
            {/* Color Selection */}
            <div className="space-y-4">
              <h2 className="text-2xl font-['Bebas_Neue'] tracking-wider">Select Color</h2>
              <div className="grid grid-cols-4 gap-4">
                {uniqueColors.map((color) => (
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
                {uniqueSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedSize === size
                        ? 'border-[#9F2FFF] bg-[#9F2FFF] text-white'
                        : 'border-gray-600 hover:border-[#9F2FFF]'
                    }`}
                  >
                    {size}
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
                disabled={!selectedSize || !selectedColor || !isVariantAvailable}
                className={`w-full py-4 rounded-lg font-semibold transition-colors ${
                  !selectedSize || !selectedColor || !isVariantAvailable
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

            <div className="mt-8">
              <h3 className="text-2xl font-['Bebas_Neue'] tracking-wider mb-4">Description</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  The Eternal Ascension collection represents the pinnacle of style and comfort. 
                  Each piece is crafted with premium materials and features our signature design elements, 
                  making a bold statement wherever you go.
                </p>
                <p>
                  Features:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Premium quality fabric blend for maximum comfort</li>
                  <li>Modern fit with adjustable waistband</li>
                  <li>Durable construction for long-lasting wear</li>
                  <li>Perfect for any occasion</li>
                  <li>Available in multiple sizes for the perfect fit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 