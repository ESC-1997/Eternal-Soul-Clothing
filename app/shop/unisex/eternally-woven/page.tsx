'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

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

export default function EternallyWovenPage() {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  // Color to image index mapping
  const colorImageMap: { [key: string]: number } = {
    'Violet': 0,
    'Black': 2,
    'Sand': 4,
    'Dark Chocolate': 6,
    'Charcoal': 8
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        
        // Find the Eternally Woven product
        const eternallyWoven = products.find((p: any) => 
          p.title.toLowerCase().includes('eternally woven')
        );

        if (!eternallyWoven) {
          throw new Error('Product not found');
        }

        console.log('Raw Eternally Woven product:', {
          title: eternallyWoven.title,
          variants: eternallyWoven.variants.map((v: any) => ({
            title: v.title,
            is_enabled: v.is_enabled,
            price: v.price
          }))
        });

        // Transform the product data
        const transformedProduct: Product = {
          id: eternallyWoven.id,
          title: eternallyWoven.title,
          description: "The Eternally Woven collection represents the perfect fusion of comfort and style. These pieces are designed to be versatile, durable, and suitable for any occasion. Made with premium materials and featuring our signature design elements, each item in this collection is crafted to be a timeless addition to your wardrobe.",
          images: eternallyWoven.images.map((img: any) => ({ src: img.src })),
          variants: eternallyWoven.variants
            .filter((variant: any) => {
              console.log('Checking variant:', {
                title: variant.title,
                is_enabled: variant.is_enabled
              });
              return variant.is_enabled;
            })
            .map((variant: any) => {
              const [size, color] = variant.title.split(' / ');
              return {
                id: variant.id,
                title: variant.title,
                price: Number((variant.price / 100).toFixed(2)),
                size: size.trim(),
                color: color.trim()
              };
            })
        };

        console.log('Transformed product variants:', transformedProduct.variants);

        setProduct(transformedProduct);
      } catch (err) {
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
      logo: product.images[0].src
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Get unique colors and sizes
  const availableColors = product ? Array.from(new Set(product.variants.map(v => v.color))) : [];
  const availableSizes = product ? Array.from(new Set(product.variants.map(v => v.size))) : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
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

        {/* Product Content */}
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
          <div className="text-white space-y-6">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            
            {/* Color Selection */}
            <div className="space-y-4">
              <h2 className="text-2xl font-['Bebas_Neue'] tracking-wider">Select Color</h2>
              <div className="grid grid-cols-4 gap-4">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
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

            {/* Size Selection */}
            <div className="space-y-4">
              <h2 className="text-2xl font-['Bebas_Neue'] tracking-wider">Select Size</h2>
              <div className="grid grid-cols-4 gap-4">
                {availableSizes.map((size) => (
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

            <div className="pt-6">
              <p className="text-2xl font-['Bebas_Neue'] tracking-wider mb-4">
                ${product.variants[0].price.toFixed(2)}
              </p>
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className={`w-full py-4 rounded-lg font-semibold transition-colors ${
                  !selectedSize || !selectedColor
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-white text-[#2C2F36] hover:bg-gray-100'
                }`}
              >
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
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
