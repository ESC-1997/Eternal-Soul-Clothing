'use client';
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { productVariants } from './productVariants';
import { supabase } from "../supabaseClient"; // adjust path if needed

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

// Manual color mapping for Eternal Collapse
const ETERNAL_COLLAPSE_COLORS = [
  {
    name: 'White',
    value: 'white',
    hex: '#FFFFFF',
    images: [
      '/images/eternal_collapse/white.jpg',
      '/images/eternal_collapse/white1.jpg',
    ],
  },
  {
    name: 'Black',
    value: 'black',
    hex: '#000000',
    images: [
      '/images/eternal_collapse/black.jpg',
      '/images/eternal_collapse/black1.jpg',
    ],
  },
  {
    name: 'Sand',
    value: 'sand',
    hex: '#C2B280',
    images: [
      '/images/eternal_collapse/sand.jpg',
      '/images/eternal_collapse/sand1.jpg',
    ],
  },
  {
    name: 'Dark Chocolate',
    value: 'dchocolate',
    hex: '#3E2723',
    images: [
      '/images/eternal_collapse/dchocolate.jpg',
      '/images/eternal_collapse/dchocolate1.jpg',
    ],
  },
  {
    name: 'Charcoal',
    value: 'charcoal',
    hex: '#444444',
    images: [
      '/images/eternal_collapse/charcoal.jpg',
      '/images/eternal_collapse/charcoal1.jpg',
    ],
  },
  {
    name: 'Navy',
    value: 'navy',
    hex: '#001F54',
    images: [
      '/images/eternal_collapse/navy.jpg',
      '/images/eternal_collapse/navy1.jpg',
    ],
  },
];

// Manual color mapping for Vow of the Eternal
const VOW_OF_THE_ETERNAL_COLORS = [
  {
    name: 'Black',
    value: 'black',
    hex: '#000000',
    images: [
      '/images/vow_of_the_eternal/black.jpg',
      '/images/vow_of_the_eternal/black1.jpg',
    ],
  },
  {
    name: 'Sand',
    value: 'sand',
    hex: '#C2B280',
    images: [
      '/images/vow_of_the_eternal/sand.jpg',
      '/images/vow_of_the_eternal/sand.jpg',
    ],
  },
  {
    name: 'Dark Chocolate',
    value: 'dchocolate',
    hex: '#3E2723',
    images: [
      '/images/vow_of_the_eternal/dchocolate.jpg',
      '/images/vow_of_the_eternal/dchocolate1.jpg',
    ],
  },
  {
    name: 'Stone Blue',
    value: 'sblue',
    hex: '#5A7CA5',
    images: [
      '/images/vow_of_the_eternal/sblue.jpg',
      '/images/vow_of_the_eternal/sblue1.jpg',
    ],
  },
  {
    name: 'Charcoal',
    value: 'charcoal',
    hex: '#444444',
    images: [
      '/images/vow_of_the_eternal/charcoal.jpg',
      '/images/vow_of_the_eternal/charcoal1.jpg',
    ],
  },
];

export default function ProductViewer({ product }: ProductViewerProps) {
  const [selectedSize, setSelectedSize] = useState<string>('M');
  // Use custom color options for Eternal Collapse and Vow of the Eternal
  const isEternalCollapse = product.title === 'Eternal Collapse';
  const isVowOfTheEternal = product.title === 'Vow of the Eternal';
  const colorOptions = isEternalCollapse
    ? ETERNAL_COLLAPSE_COLORS
    : isVowOfTheEternal
      ? VOW_OF_THE_ETERNAL_COLORS
      : COLOR_OPTIONS;
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0].value);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { addItem, setIsCartOpen } = useCart();

  // Auto-restore user session on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (data?.user) {
        // Assuming you want to set the user in the profile drawer context
        // You might want to handle this differently depending on your app's architecture
        // For now, we'll just log the user
        console.log('User restored:', data.user);
      }
    });
    // Optionally, listen for auth state changes:
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

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
        price: getCurrentPrice(),
        quantity: 1,
        image: getImagePath(),
      });
      setIsCartOpen(true);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleImageClick = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? 1 : 0);
  };

  // Custom image logic for Eternal Collapse and Vow of the Eternal
  const getImagePath = () => {
    if (isEternalCollapse) {
      const colorObj = ETERNAL_COLLAPSE_COLORS.find(c => c.value === selectedColor);
      return colorObj ? colorObj.images[currentImageIndex] : ETERNAL_COLLAPSE_COLORS[0].images[0];
    }
    if (isVowOfTheEternal) {
      const colorObj = VOW_OF_THE_ETERNAL_COLORS.find(c => c.value === selectedColor);
      return colorObj ? colorObj.images[currentImageIndex] : VOW_OF_THE_ETERNAL_COLORS[0].images[0];
    }
    const suffix = product.title.includes('Purple') ? 'P' : 'BG';
    return `/images/eternal_lotus/eternal_lotus_${selectedColor}_${currentImageIndex === 0 ? 'front' : 'back'}${suffix}.jpg`;
  };

  // Determine available sizes for the current product and color
  const getAvailableSizes = () => {
    if (isEternalCollapse || isVowOfTheEternal) {
      const productId = isEternalCollapse ? '681acbd3c9285dd17e0dd618' : '681ac79a1207456e76092f23';
      const colorName = colorOptions.find(c => c.value === selectedColor)?.name;
      if (productVariants[productId] && colorName && productVariants[productId][colorName]) {
        return Object.keys(productVariants[productId][colorName]);
      }
    }
    // Default sizes
    return ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', 'XS'];
  };
  const availableSizes = getAvailableSizes();

  // Get stock status for the selected color and size
  const getStockStatus = (size: string) => {
    if (isEternalCollapse || isVowOfTheEternal) {
      const productId = isEternalCollapse ? '681acbd3c9285dd17e0dd618' : '681ac79a1207456e76092f23';
      const colorName = colorOptions.find(c => c.value === selectedColor)?.name;
      if (!colorName) return 'In Stock';
      return productVariants[productId]?.[colorName]?.[size]?.stock_status || 'In Stock';
    }
    return 'In Stock';
  };
  const selectedStockStatus = getStockStatus(selectedSize);

  // Get the price for the selected color and size for Eternal Collapse and Vow of the Eternal
  const getCurrentPrice = () => {
    if (isEternalCollapse || isVowOfTheEternal) {
      const productId = isEternalCollapse ? '681acbd3c9285dd17e0dd618' : '681ac79a1207456e76092f23';
      const colorName = colorOptions.find(c => c.value === selectedColor)?.name;
      if (
        productVariants[productId] &&
        colorName &&
        productVariants[productId][colorName] &&
        productVariants[productId][colorName][selectedSize]
      ) {
        return productVariants[productId][colorName][selectedSize].price / 100;
      }
    }
    // Default price logic
    return parseInt(product.variants[0].price) / 100;
  };
  const currentPrice = getCurrentPrice();

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
                Price: ${currentPrice.toFixed(2)}
              </span>
            </div>
            <div className="text-green-700 font-medium">
              {selectedStockStatus}
            </div>
          </div>
        )}

        {/* Color Selection */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Color</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {colorOptions.map((color) => (
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
            {availableSizes.map((size) => (
              <option
                key={size}
                value={size}
                disabled={getStockStatus(size) === 'Out of Stock'}
              >
                {size} {getStockStatus(size) === 'Out of Stock' ? '(Out of Stock)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={isAddingToCart || selectedStockStatus === 'Out of Stock'}
          onClick={handleAddToCart}
          className="w-full py-3 rounded text-white text-lg font-semibold transition-colors duration-200"
          style={{ background: '#15803D' }}
        >
          {selectedStockStatus === 'Out of Stock'
            ? 'Out of Stock'
            : isAddingToCart
              ? 'Adding...'
              : 'Add to Cart'}
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
                    Price: ${currentPrice.toFixed(2)}
                  </span>
                </div>
                <div className="text-green-700 font-medium">
                  {selectedStockStatus}
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
                {colorOptions.map((color) => (
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
                {availableSizes.map((size) => (
                  <option
                    key={size}
                    value={size}
                    disabled={getStockStatus(size) === 'Out of Stock'}
                  >
                    {size} {getStockStatus(size) === 'Out of Stock' ? '(Out of Stock)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Add to Cart Button */}
            <button
              disabled={isAddingToCart || selectedStockStatus === 'Out of Stock'}
              onClick={handleAddToCart}
              className="w-full py-4 rounded text-white text-xl font-semibold transition-colors duration-200"
              style={{ background: '#15803D' }}
            >
              {selectedStockStatus === 'Out of Stock'
                ? 'Out of Stock'
                : isAddingToCart
                  ? 'Adding...'
                  : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 