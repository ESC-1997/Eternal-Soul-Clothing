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

export default function EternalGlowPage() {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
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
        
        // Find the Eternal Glow product
        const foundProduct = products.find((p: any) => 
          p.title === 'Eternal Glow' || p.id === '68326c3269e742166100b813'
        );
        
        if (!foundProduct) {
          throw new Error('Product not found');
        }

        // Transform the product data
        const transformedProduct: Product = {
          id: foundProduct.id,
          title: foundProduct.title,
          images: foundProduct.images.map((img: any) => ({ 
            src: img.src
          })),
          variants: foundProduct.variants
            .filter((variant: any) => variant.is_enabled)  // Only include enabled variants
            .map((variant: any) => {
              // Parse the variant title to extract size and color
              const [size, color] = variant.title.split(' / ');
              return {
                id: variant.id,
                title: variant.title,
                price: (variant.price / 100).toFixed(2),
                size: size || variant.title,
                color: color || variant.title
              };
            })
        };

        setProduct(transformedProduct);
        // Set initial selections
        const uniqueSizes = Array.from(new Set(transformedProduct.variants.map(v => v.size)));
        const uniqueColors = Array.from(new Set(transformedProduct.variants.map(v => v.color)));
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

  // Get the selected variant based on size and color
  const selectedVariant = product?.variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;

    const selectedVariant = product.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );

    if (!selectedVariant) return;

    setIsAddingToCart(true);
    setAddedToCart(true);
    
    try {
      addItem({
        id: product.id,
        name: product.title,
        color: selectedColor,
        logo: 'default',
        size: selectedSize,
        price: parseFloat(selectedVariant.price),
        quantity: 1,
        image: product.images[selectedImage].src,
        variantId: parseInt(selectedVariant.id)
      });

      // Reset the success state after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2C2F36] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#2C2F36] flex items-center justify-center">
        <h1 className="text-white text-2xl">{error || 'Product not found'}</h1>
      </div>
    );
  }

  // Get unique sizes and colors
  const uniqueSizes = Array.from(new Set(product.variants.map(v => v.size)));
  const uniqueColors = Array.from(new Set(product.variants.map(v => v.color)));

  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link 
            href="/shop/women" 
            className="inline-flex items-center text-white hover:text-gray-300 text-sm sm:text-base"
          >
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2" 
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

        {/* Navigation */}
        <nav className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-8 text-sm sm:text-base">
          <Link href="/shop" className="text-white hover:text-gray-300">Shop All</Link>
          <Link href="/shop/mens" className="text-white hover:text-gray-300">Mens</Link>
          <Link href="/shop/women" className="text-white hover:text-gray-300">Women's</Link>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage].src}
                alt={`${product.title} - ${selectedColor}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            {/* Thumbnail gallery */}
            <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-16 sm:w-20 aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-white' : ''
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={`${product.title} - View ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 64px, 80px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{product.title}</h1>
            <p className="text-xl sm:text-2xl text-white">${selectedVariant?.price}</p>
            
            {/* Size Selection */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-semibold text-white">Size</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {uniqueSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-2 sm:px-4 py-2 text-sm sm:text-base border rounded-lg ${
                      selectedSize === size
                        ? 'border-white bg-white text-[#2C2F36]'
                        : 'border-gray-600 text-white hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-semibold text-white">Color</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {uniqueColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-2 sm:px-4 py-2 text-sm sm:text-base border rounded-lg ${
                      selectedColor === color
                        ? 'border-white bg-white text-[#2C2F36]'
                        : 'border-gray-600 text-white hover:border-white'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedSize || !selectedColor}
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200 ${
                isAddingToCart || !selectedSize || !selectedColor
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-white text-[#2C2F36] hover:bg-gray-100'
              }`}
            >
              {isAddingToCart ? 'Adding...' : addedToCart ? 'Added to Cart!' : 'Add to Cart'}
            </button>

            {/* Description */}
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Description</h3>
              <p className="text-sm sm:text-base text-gray-300">
                The Eternal Glow is a stunning piece that combines elegance with modern design. 
                Featuring premium materials and a comfortable fit, this piece is perfect for 
                those who want to make a statement while maintaining comfort and style.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 