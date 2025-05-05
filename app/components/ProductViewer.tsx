'use client';
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { productVariants } from './productVariants';
import { useProfileDrawer } from '../context/ProfileDrawerContext';

interface ProductViewerProps {
  product: {
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
  };
}

// Mapping from our color codes to Printify's color names
const COLOR_CODE_TO_NAME: Record<string, string> = {
  fgreen: 'Forest Green',
  sand: 'Sand',
  white: 'White',
  black: 'Black',
  lblue: 'Light Blue',
};

const COLOR_OPTIONS = [
  { name: 'Forest Green', value: 'fgreen', hex: '#228B22' },
  { name: 'Sand', value: 'sand', hex: '#C2B280' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Light Blue', value: 'lblue', hex: '#ADD8E6' },
];

export default function ProductViewer({ product }: ProductViewerProps) {
  const { profile } = useProfileDrawer();
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_OPTIONS[0].value);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { addItem } = useCart();

  // Update selectedSize when profile?.shirt_size changes
  useEffect(() => {
    if (profile?.shirt_size) {
      setSelectedSize(profile.shirt_size);
    }
  }, [profile?.shirt_size]);

  const getVariantId = () => {
    const printifyColorName = COLOR_CODE_TO_NAME[selectedColor];
    const productId = product.id;
    const size = selectedSize;
    
    // Find the variant ID in the productVariants mapping
    const variant = productVariants[productId]?.[printifyColorName]?.[size];
    return variant?.variant_id || parseInt(product.variants[0].id);
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      const variantId = getVariantId();
      addItem({
        id: product.id,
        variantId: variantId,
        name: product.title,
        color: selectedColor,
        logo: 'default',
        size: selectedSize,
        price: parseInt(product.variants[0].price) / 100,
        quantity: 1,
        image: `/images/eternal_lotus/eternal_lotus_${selectedColor}_${currentImageIndex === 0 ? 'front' : 'back'}${product.title.includes('Purple') ? 'P' : 'BG'}.jpg`,
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleImageClick = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? 1 : 0);
  };

  const getImagePath = () => {
    const suffix = product.title.includes('Purple') ? 'P' : 'BG';
    return `/images/eternal_lotus/eternal_lotus_${selectedColor}_${currentImageIndex === 0 ? 'front' : 'back'}${suffix}.jpg`;
  };

  return (
    <div className="space-y-6">
      {/* Mobile Layout */}
      <div className="lg:hidden space-y-6">
        <div className="relative h-[350px] rounded-lg overflow-hidden">
          <Image
            src={getImagePath()}
            alt={product.title}
            fill
            className="object-contain"
            priority
          />
          {/* Front/Back View Toggle */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/80 rounded-full p-1">
            <button
              onClick={() => setCurrentImageIndex(0)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                currentImageIndex === 0 ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setCurrentImageIndex(1)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                currentImageIndex === 1 ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Back
            </button>
          </div>
        </div>
        {/* Price and Stock Status */}
        {product.variants[0] && (
          <div className="mb-4 flex items-center gap-4">
            <div className="inline-block px-4 py-2 rounded" style={{ background: '#15803D' }}>
              <span className="text-white font-semibold">
                Price: ${(parseInt(product.variants[0].price) / 100).toFixed(2)}
              </span>
            </div>
            <div className="text-green-700 font-medium">
              In Stock
            </div>
          </div>
        )}

        {/* Color Selection */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Color</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color.value}
                className={`w-10 h-10 rounded-full border-2 flex-shrink-0 ${
                  selectedColor === color.value
                    ? 'border-gray-900'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color.value)}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Size</h3>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full p-2 border rounded text-gray-900"
          >
            {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={isAddingToCart}
          onClick={handleAddToCart}
          className="w-full py-3 rounded text-white text-lg font-semibold transition-colors duration-200"
          style={{ background: '#15803D' }}
        >
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-[minmax(0,1.5fr),minmax(0,0.5fr)] gap-16 -ml-4">
          {/* Left Column - Product Image */}
          <div className="space-y-4">
            <div className="relative w-full h-[600px] bg-white rounded-lg p-4">
              <img
                src={getImagePath()}
                alt={product.title}
                className="w-full h-full object-contain"
              />
              {/* Front/Back View Toggle */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 bg-white/80 rounded-full p-1.5">
                <button
                  onClick={() => setCurrentImageIndex(0)}
                  className={`px-4 py-1.5 rounded-full text-base font-medium transition-colors ${
                    currentImageIndex === 0 ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Front View
                </button>
                <button
                  onClick={() => setCurrentImageIndex(1)}
                  className={`px-4 py-1.5 rounded-full text-base font-medium transition-colors ${
                    currentImageIndex === 1 ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Back View
                </button>
              </div>
            </div>
            {product.variants[0] && (
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded" style={{ background: '#15803D' }}>
                  <span className="text-white font-semibold">
                    Price: ${(parseInt(product.variants[0].price) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="text-green-700 font-medium">
                  In Stock
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Options */}
          <div className="space-y-6 mt-24">
            {/* Color Selection */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Color</h3>
              <div className="flex flex-wrap gap-3">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    className={`w-12 h-12 rounded-full border-2 ${
                      selectedColor === color.value
                        ? 'border-gray-900'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Size</h3>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-2 border rounded text-gray-900"
              >
                {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Add to Cart Button */}
            <button
              disabled={isAddingToCart}
              onClick={handleAddToCart}
              className="w-full py-4 rounded text-white text-xl font-semibold transition-colors duration-200"
              style={{ background: '#15803D' }}
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 