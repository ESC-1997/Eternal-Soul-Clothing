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
    in_stock: boolean;
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

  // Color to image mapping
  const colorToImageMap: { [key: string]: number } = {
    'Vintage White': 0,
    'White': 3,
    'Natural': 5,
    'Storm': 7
  };

  // Update selected image when color changes
  useEffect(() => {
    if (selectedColor && colorToImageMap[selectedColor] !== undefined) {
      setSelectedImage(colorToImageMap[selectedColor]);
    }
  }, [selectedColor]);

  // Get available sizes for selected color
  const getAvailableSizes = (color: string) => {
    if (!product) return [];
    return product.variants
      .filter(v => v.color === color && v.is_enabled && v.in_stock)
      .map(v => v.size);
  };

  // Check if a size is available for the selected color
  const isSizeAvailable = (size: string) => {
    if (!product || !selectedColor) return false;
    return product.variants.some(
      v => v.size === size && v.color === selectedColor && v.is_enabled
    );
  };

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
              const parts = variant.title.split(' / ');
              const color = parts[0]?.trim();  // First part is color
              const size = parts[1]?.trim();   // Second part is size
              
              return {
                id: variant.id,
                title: variant.title,
                price: (variant.price / 100).toFixed(2),
                size: size || variant.title,
                color: color || variant.title,
                is_enabled: variant.is_enabled,
                in_stock: variant.in_stock === false ? false : true // Assume in stock unless explicitly marked as out of stock
              };
            })
        };

        setProduct(transformedProduct);
        // Set initial selections
        const uniqueSizes = Array.from(new Set(transformedProduct.variants.map(v => v.size)));
        const uniqueColors = Array.from(new Set(transformedProduct.variants.map(v => v.color)));
        const initialColor = uniqueColors[0];
        setSelectedSize(uniqueSizes[0]);
        setSelectedColor(initialColor);
        // Set initial image based on the first color
        if (initialColor && colorToImageMap[initialColor] !== undefined) {
          setSelectedImage(colorToImageMap[initialColor]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  // Update selected size when color changes if current size is not available
  useEffect(() => {
    if (selectedColor && selectedSize && !isSizeAvailable(selectedSize)) {
      const availableSizes = getAvailableSizes(selectedColor);
      if (availableSizes.length > 0) {
        setSelectedSize(availableSizes[0]);
      } else {
        setSelectedSize(null);
      }
    }
  }, [selectedColor]);

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/shop/women" 
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

          {/* Product Info */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl font-['Bebas_Neue'] tracking-wider">{product.title}</h1>
            <p className="text-2xl">${selectedVariant?.price}</p>
            
            {/* Color Selection */}
            <div className="space-y-4">
              <h2 className="text-2xl font-['Bebas_Neue'] tracking-wider">Select Color</h2>
              <div className="grid grid-cols-4 gap-4">
                {uniqueColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      if (colorToImageMap[color] !== undefined) {
                        setSelectedImage(colorToImageMap[color]);
                      }
                    }}
                    className={`px-4 py-2 rounded-md border-2 transition-colors ${
                      selectedColor === color
                        ? 'bg-[#9F2FFF] text-white border-[#9F2FFF]'
                        : 'border-white text-white hover:border-[#9F2FFF]'
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
                {uniqueSizes.map((size) => {
                  const isAvailable = isSizeAvailable(size);
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`px-4 py-2 rounded-md border-2 transition-colors ${
                        !isAvailable
                          ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                          : selectedSize === size
                          ? 'bg-[#9F2FFF] text-white border-[#9F2FFF]'
                          : 'border-white text-white hover:border-[#9F2FFF]'
                      }`}
                    >
                      {size}
                      {!isAvailable && <span className="block text-xs mt-1">Out of Stock</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedSize || !selectedColor}
              className={`w-full py-3 rounded-md transition-colors ${
                isAddingToCart || !selectedSize || !selectedColor
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-[#9F2FFF] hover:bg-[#8A2BE2]'
              }`}
            >
              {isAddingToCart ? 'Adding...' : addedToCart ? 'Added to Cart!' : 'Add to Cart'}
            </button>

            {/* Product Description */}
            <div className="mt-8">
              <h2 className="text-2xl font-['Bebas_Neue'] tracking-wider mb-4">Product Details</h2>
              <p className="text-gray-300">
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