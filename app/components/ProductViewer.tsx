'use client';
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { productVariants } from './productVariants';
import { supabase } from "../supabaseClient"; // adjust path if needed
import ShareButton from './ShareButton';

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

// Eternal Awakening color options
const ETERNAL_AWAKENING_COLORS = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Dark Chocolate', value: 'dchocolate', hex: '#3E2723' },
  { name: 'Gravel', value: 'gravel', hex: '#4A4A4A' },
  { name: 'Light Blue', value: 'lblue', hex: '#ADD8E6' },
  { name: 'Navy', value: 'navy', hex: '#001F54' },
  { name: 'Sand', value: 'sand', hex: '#C2B280' },
  { name: 'Tweed', value: 'tweed', hex: '#8B7355' },
  { name: 'Violet', value: 'violet', hex: '#8A2BE2' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
];

// Eternal Awakening color-to-image mapping
const ETERNAL_AWAKENING_IMAGE_MAP: Record<string, { front: string; back: string }> = {
  black: {
    front: '/images/eternal_awakening/black_front.jpg',
    back: '/images/eternal_awakening/black_back.jpg',
  },
  dchocolate: {
    front: '/images/eternal_awakening/dchocolate_front.jpg',
    back: '/images/eternal_awakening/dchocolate_back.jpg',
  },
  gravel: {
    front: '/images/eternal_awakening/gravel_front.jpg',
    back: '/images/eternal_awakening/gravel_back.jpg',
  },
  lblue: {
    front: '/images/eternal_awakening/lblue_front.jpg',
    back: '/images/eternal_awakening/lblue_back.jpg',
  },
  navy: {
    front: '/images/eternal_awakening/navy_front.jpg',
    back: '/images/eternal_awakening/navy_back.jpg',
  },
  sand: {
    front: '/images/eternal_awakening/sand_front.jpg',
    back: '/images/eternal_awakening/sand_back.jpg',
  },
  tweed: {
    front: '/images/eternal_awakening/tweed_front.jpg',
    back: '/images/eternal_awakening/tweed_back.jpg',
  },
  violet: {
    front: '/images/eternal_awakening/violet_front.jpg',
    back: '/images/eternal_awakening/violet_back.jpg',
  },
  white: {
    front: '/images/eternal_awakening/white_front.jpg',
    back: '/images/eternal_awakening/white_back.jpg',
  },
};

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

// Eternal Ascension color options
const ETERNAL_ASCENSION_COLORS = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Charcoal', value: 'charcoal', hex: '#585559' },
  { name: 'Dark Chocolate', value: 'dark_chocolate', hex: '#31221D' },
  { name: 'Sand', value: 'sand', hex: '#DCD2BE' },
  { name: 'Violet', value: 'violet', hex: '#8381BA' },
];

// Eternal Ascension color-to-image mapping
const ETERNAL_ASCENSION_IMAGE_MAP: Record<string, string[]> = {
  black: ['/images/eternal_ascension/black.jpg', '/images/eternal_ascension/black1.jpg'],
  sand: ['/images/eternal_ascension/sand.jpg', '/images/eternal_ascension/sand1.jpg'],
  dark_chocolate: ['/images/eternal_ascension/dark_chocolate.jpg', '/images/eternal_ascension/dark_chocolate1.jpg'],
  violet: ['/images/eternal_ascension/violet.jpg', '/images/eternal_ascension/violet1.jpg'],
  charcoal: ['/images/eternal_ascension/charcoal.jpg', '/images/eternal_ascension/charcoal1.jpg'],
};

// Custom color options and image mapping for Eternally Woven
const ETERNALLY_WOVEN_COLORS = [
  { name: 'Cardinal Red', value: 'cardinal_red', hex: '#9f1931' },
  { name: 'Charcoal', value: 'charcoal', hex: '#585559' },
  { name: 'Indigo Blue', value: 'indigo_blue', hex: '#476579' },
  { name: 'Natural', value: 'natural', hex: '#FFF6E3' },
  { name: 'Sage', value: 'sage', hex: '#b1e0c0' },
  { name: 'Sand', value: 'sand', hex: '#DCD2BE' },
  { name: 'Stone Blue', value: 'stone_blue', hex: '#7BA4DB' },
  { name: 'White', value: 'white', hex: '#ffffff' },
];

const ETERNALLY_WOVEN_IMAGE_MAP: Record<string, { front: string; back: string }> = {
  cardinal_red: {
    front: '/images/Eternally Woven/red_front.jpg',
    back: '/images/Eternally Woven/red_back.jpg',
  },
  charcoal: {
    front: '/images/Eternally Woven/charcoal_front.jpg',
    back: '/images/Eternally Woven/charcoal_back.jpg',
  },
  indigo_blue: {
    front: '/images/Eternally Woven/iblue_front.jpg',
    back: '/images/Eternally Woven/iblue_back.jpg',
  },
  natural: {
    front: '/images/Eternally Woven/natural_front.jpg',
    back: '/images/Eternally Woven/natural_back.jpg',
  },
  sage: {
    front: '/images/Eternally Woven/sage_front.jpg',
    back: '/images/Eternally Woven/sage_back.jpg',
  },
  sand: {
    front: '/images/Eternally Woven/sand_front.jpg',
    back: '/images/Eternally Woven/sand_back.jpg',
  },
  stone_blue: {
    front: '/images/Eternally Woven/sblue_front.jpg',
    back: '/images/Eternally Woven/sblue_back.jpg',
  },
  white: {
    front: '/images/Eternally Woven/white_front.jpg',
    back: '/images/Eternally Woven/white_back.jpg',
  },
};

// Eternal Cut color options
const ETERNAL_CUT_COLORS = [
  { name: 'Army', value: 'army', hex: '#4B5320' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Coal', value: 'coal', hex: '#36454F' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
];

const ETERNAL_CUT_IMAGE_MAP: Record<string, string> = {
  army: '/images/eternal_cut/army.jpg',
  black: '/images/eternal_cut/black.jpg',
  coal: '/images/eternal_cut/coal.jpg',
  white: '/images/eternal_cut/white.jpg',
};

export default function ProductViewer({ product }: ProductViewerProps) {
  const [selectedSize, setSelectedSize] = useState<string>('M');
  // Use custom color options for specific products
  const isEternalCollapse = product.title === 'Eternal Collapse';
  const isVowOfTheEternal = product.title === 'Vow of the Eternal';
  const isEternalAwakening = product.title === 'Eternal Awakening';
  const isEternallyWoven = product.id === '68268cde04479021a204cf52';
  const isEternalAscension = product.id === '682803161b86b39978039d62';
  const isEternalCut = product.id === '6828e9aa1b86b3997803cc3d';
  const colorOptions = isEternalCut
    ? ETERNAL_CUT_COLORS
    : isEternalAscension
      ? ETERNAL_ASCENSION_COLORS
      : isEternallyWoven
        ? ETERNALLY_WOVEN_COLORS
        : isEternalCollapse
          ? ETERNAL_COLLAPSE_COLORS
          : isVowOfTheEternal
            ? VOW_OF_THE_ETERNAL_COLORS
            : isEternalAwakening
              ? ETERNAL_AWAKENING_COLORS
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
    const productId = product.id;
    const size = selectedSize;
    if (isEternalCut) {
      const colorObj = ETERNAL_CUT_COLORS.find(c => c.value === selectedColor);
      if (!colorObj) {
        alert('Selected color is not available for this product.');
        throw new Error('Color mapping failed');
      }
      const variant = productVariants[productId]?.[colorObj.name]?.[size];
      if (variant && typeof variant === 'object' && 'variant_id' in variant) {
        return variant.variant_id;
      }
      alert('Selected color/size is not available.');
      throw new Error('Variant mapping failed');
    }
    if (isEternallyWoven) {
      // Map selectedColor value to Printify color name
      const colorName = ETERNALLY_WOVEN_COLORS.find(c => c.value === selectedColor)?.name;
      const variant = colorName && productVariants[productId]?.[colorName]?.[size];
      if (variant && typeof variant === 'object' && 'variant_id' in variant) {
        return variant.variant_id;
      }
      return parseInt(product.variants[0].id);
    }
    if (isEternalAwakening) {
      const colorName = ETERNAL_AWAKENING_COLORS.find(c => c.value === selectedColor)?.name;
      const variant = colorName && productVariants[productId]?.[colorName]?.[size];
      if (variant && typeof variant === 'object' && 'variant_id' in variant) {
        return variant.variant_id;
      }
      return parseInt(product.variants[0].id);
    }
    if (isEternalAscension) {
      const colorObj = ETERNAL_ASCENSION_COLORS.find(c => c.value === selectedColor);
      if (!colorObj) {
        alert('Selected color is not available for this product.');
        throw new Error('Color mapping failed');
      }
      const variant = productVariants[productId]?.[colorObj.name]?.[size];
      if (variant && typeof variant === 'object' && 'variant_id' in variant) {
        return variant.variant_id;
      }
      alert('Selected color/size is not available.');
      throw new Error('Variant mapping failed');
    }
    const printifyColorName = COLOR_CODE_TO_NAME[selectedColor];
    const variant = productVariants[productId]?.[printifyColorName]?.[size];
    return variant?.variant_id || parseInt(product.variants[0].id);
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      // Check stock status before proceeding
      if (getStockStatus(selectedSize) === 'Out of Stock') {
        alert('This variant is out of stock and cannot be added to the cart.');
        return;
      }
      const variantId = getVariantId();
      const colorName = isEternalAwakening
        ? ETERNAL_AWAKENING_COLORS.find(c => c.value === selectedColor)?.name || selectedColor
        : selectedColor;
      addItem({
        id: product.id,
        variantId: variantId,
        name: product.title,
        color: colorName,
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

  // Custom image logic for Eternally Woven
  const getImagePath = () => {
    if (isEternallyWoven) {
      const colorKey = selectedColor;
      const side = currentImageIndex === 0 ? 'front' : 'back';
      return ETERNALLY_WOVEN_IMAGE_MAP[colorKey]?.[side] || ETERNALLY_WOVEN_IMAGE_MAP['white'].back;
    }
    if (isEternalCollapse) {
      const colorObj = ETERNAL_COLLAPSE_COLORS.find(c => c.value === selectedColor);
      return colorObj ? colorObj.images[currentImageIndex] : ETERNAL_COLLAPSE_COLORS[0].images[0];
    }
    if (isVowOfTheEternal) {
      const colorObj = VOW_OF_THE_ETERNAL_COLORS.find(c => c.value === selectedColor);
      return colorObj ? colorObj.images[currentImageIndex] : VOW_OF_THE_ETERNAL_COLORS[0].images[0];
    }
    if (isEternalAwakening) {
      const colorKey = selectedColor;
      const side = currentImageIndex === 0 ? 'front' : 'back';
      return ETERNAL_AWAKENING_IMAGE_MAP[colorKey]?.[side] || ETERNAL_AWAKENING_IMAGE_MAP['black'].front;
    }
    if (isEternalAscension) {
      return ETERNAL_ASCENSION_IMAGE_MAP[selectedColor]?.[currentImageIndex] || ETERNAL_ASCENSION_IMAGE_MAP['black'][0];
    }
    if (isEternalCut) {
      return ETERNAL_CUT_IMAGE_MAP[selectedColor] || ETERNAL_CUT_IMAGE_MAP['black'];
    }
    const suffix = product.title.includes('Purple') ? 'P' : 'BG';
    return `/images/eternal_lotus/eternal_lotus_${selectedColor}_${currentImageIndex === 0 ? 'front' : 'back'}${suffix}.jpg`;
  };

  // Determine available sizes for the current product and color
  const getAvailableSizes = () => {
    if (isEternalCut) {
      const colorObj = ETERNAL_CUT_COLORS.find(c => c.value === selectedColor);
      if (colorObj && productVariants[product.id] && productVariants[product.id][colorObj.name]) {
        return Object.keys(productVariants[product.id][colorObj.name]);
      }
      return [];
    }
    if (isEternalCollapse || isVowOfTheEternal) {
      const productId = isEternalCollapse ? '681acbd3c9285dd17e0dd618' : '681ac79a1207456e76092f23';
      const colorName = colorOptions.find(c => c.value === selectedColor)?.name;
      if (productVariants[productId] && colorName && productVariants[productId][colorName]) {
        return Object.keys(productVariants[productId][colorName]);
      }
    }
    if (isEternalAwakening) {
      return ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
    }
    if (isEternallyWoven) {
      // Use Printify color name for lookup
      const colorName = ETERNALLY_WOVEN_COLORS.find(c => c.value === selectedColor)?.name;
      const sizes = colorName && productVariants[product.id] && productVariants[product.id][colorName]
        ? Object.keys(productVariants[product.id][colorName])
        : ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
      return sizes.includes('XS')
        ? ['XS', ...sizes.filter(s => s !== 'XS')]
        : sizes;
    }
    return ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', 'XS'];
  };
  const availableSizes = getAvailableSizes();

  // Get stock status for the selected color and size
  const getStockStatus = (size: string) => {
    if (isEternalCut) {
      const colorObj = ETERNAL_CUT_COLORS.find(c => c.value === selectedColor);
      if (!colorObj) return 'In Stock';
      return productVariants[product.id]?.[colorObj.name]?.[size]?.stock_status || 'In Stock';
    }
    if (isEternalCollapse || isVowOfTheEternal) {
      const productId = isEternalCollapse ? '681acbd3c9285dd17e0dd618' : '681ac79a1207456e76092f23';
      const colorName = colorOptions.find(c => c.value === selectedColor)?.name;
      if (!colorName) return 'In Stock';
      return productVariants[productId]?.[colorName]?.[size]?.stock_status || 'In Stock';
    }
    if (isEternallyWoven) {
      const colorName = ETERNALLY_WOVEN_COLORS.find(c => c.value === selectedColor)?.name;
      if (!colorName) return 'In Stock';
      return productVariants[product.id]?.[colorName]?.[size]?.stock_status || 'In Stock';
    }
    if (isEternalAscension) {
      const colorName = ETERNAL_ASCENSION_COLORS.find(c => c.value === selectedColor)?.name;
      if (!colorName) return 'In Stock';
      return productVariants[product.id]?.[colorName]?.[size]?.stock_status || 'In Stock';
    }
    return 'In Stock';
  };
  const selectedStockStatus = getStockStatus(selectedSize);

  // Get the price for the selected color and size
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
    if (isEternalAwakening) {
      if (['3XL', '4XL', '5XL'].includes(selectedSize)) {
        return 48.00;
      } else if (selectedSize === '2XL') {
        return 47.00;
      } else {
        return 45.00;
      }
    }
    if (isEternallyWoven) {
      const colorName = ETERNALLY_WOVEN_COLORS.find(c => c.value === selectedColor)?.name;
      if (
        productVariants[product.id] &&
        colorName &&
        productVariants[product.id][colorName] &&
        productVariants[product.id][colorName][selectedSize]
      ) {
        return productVariants[product.id][colorName][selectedSize].price / 100;
      }
    }
    if (isEternalAscension) {
      const colorName = ETERNAL_ASCENSION_COLORS.find(c => c.value === selectedColor)?.name;
      if (
        productVariants[product.id] &&
        colorName &&
        productVariants[product.id][colorName] &&
        productVariants[product.id][colorName][selectedSize]
      ) {
        return productVariants[product.id][colorName][selectedSize].price / 100;
      }
    }
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
          {/* Front/Back View Thumbnails */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 bg-white/80 rounded-full p-1.5">
            {[0, 1].map((idx) => (
              <img
                key={idx}
                src={(() => {
                  if (isEternallyWoven) {
                    const colorKey = selectedColor;
                    return ETERNALLY_WOVEN_IMAGE_MAP[colorKey]?.[idx === 0 ? 'front' : 'back'] || ETERNALLY_WOVEN_IMAGE_MAP['white'].back;
                  }
                  if (isEternalCollapse) {
                    const colorObj = ETERNAL_COLLAPSE_COLORS.find(c => c.value === selectedColor);
                    return colorObj ? colorObj.images[idx] : ETERNAL_COLLAPSE_COLORS[0].images[0];
                  }
                  if (isVowOfTheEternal) {
                    const colorObj = VOW_OF_THE_ETERNAL_COLORS.find(c => c.value === selectedColor);
                    return colorObj ? colorObj.images[idx] : VOW_OF_THE_ETERNAL_COLORS[0].images[0];
                  }
                  if (isEternalAwakening) {
                    const colorKey = selectedColor;
                    return ETERNAL_AWAKENING_IMAGE_MAP[colorKey]?.[idx === 0 ? 'front' : 'back'] || ETERNAL_AWAKENING_IMAGE_MAP['black'].front;
                  }
                  if (isEternalAscension) {
                    return ETERNAL_ASCENSION_IMAGE_MAP[selectedColor]?.[idx] || ETERNAL_ASCENSION_IMAGE_MAP['black'][0];
                  }
                  if (isEternalCut) {
                    return ETERNAL_CUT_IMAGE_MAP[selectedColor] || ETERNAL_CUT_IMAGE_MAP['black'];
                  }
                  const suffix = product.title.includes('Purple') ? 'P' : 'BG';
                  return `/images/eternal_lotus/eternal_lotus_${selectedColor}_${idx === 0 ? 'front' : 'back'}${suffix}.jpg`;
                })()}
                alt={idx === 0 ? 'Front' : 'Back'}
                className={`w-12 h-12 object-contain rounded-lg cursor-pointer border-2 ${currentImageIndex === idx ? 'border-gray-900' : 'border-transparent'}`}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
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

        {/* Add Share Button */}
        <div className="flex justify-center">
          <ShareButton 
            productId={isEternalAscension ? 'eternal-ascension' : product.title.toLowerCase().replace(/\s+/g, '-')} 
            productTitle={product.title} 
          />
        </div>
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
              {/* Front/Back View Thumbnails */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 bg-white/80 rounded-full p-1.5">
                {[0, 1].map((idx) => (
                  <img
                    key={idx}
                    src={(() => {
                      if (isEternallyWoven) {
                        const colorKey = selectedColor;
                        return ETERNALLY_WOVEN_IMAGE_MAP[colorKey]?.[idx === 0 ? 'front' : 'back'] || ETERNALLY_WOVEN_IMAGE_MAP['white'].back;
                      }
                      if (isEternalCollapse) {
                        const colorObj = ETERNAL_COLLAPSE_COLORS.find(c => c.value === selectedColor);
                        return colorObj ? colorObj.images[idx] : ETERNAL_COLLAPSE_COLORS[0].images[0];
                      }
                      if (isVowOfTheEternal) {
                        const colorObj = VOW_OF_THE_ETERNAL_COLORS.find(c => c.value === selectedColor);
                        return colorObj ? colorObj.images[idx] : VOW_OF_THE_ETERNAL_COLORS[0].images[0];
                      }
                      if (isEternalAwakening) {
                        const colorKey = selectedColor;
                        return ETERNAL_AWAKENING_IMAGE_MAP[colorKey]?.[idx === 0 ? 'front' : 'back'] || ETERNAL_AWAKENING_IMAGE_MAP['black'].front;
                      }
                      if (isEternalAscension) {
                        return ETERNAL_ASCENSION_IMAGE_MAP[selectedColor]?.[idx] || ETERNAL_ASCENSION_IMAGE_MAP['black'][0];
                      }
                      if (isEternalCut) {
                        return ETERNAL_CUT_IMAGE_MAP[selectedColor] || ETERNAL_CUT_IMAGE_MAP['black'];
                      }
                      const suffix = product.title.includes('Purple') ? 'P' : 'BG';
                      return `/images/eternal_lotus/eternal_lotus_${selectedColor}_${idx === 0 ? 'front' : 'back'}${suffix}.jpg`;
                    })()}
                    alt={idx === 0 ? 'Front' : 'Back'}
                    className={`w-12 h-12 object-contain rounded-lg cursor-pointer border-2 ${currentImageIndex === idx ? 'border-gray-900' : 'border-transparent'}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
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

            {/* Add Share Button */}
            <div className="flex justify-center">
              <ShareButton 
                productId={isEternalAscension ? 'eternal-ascension' : product.title.toLowerCase().replace(/\s+/g, '-')} 
                productTitle={product.title} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
