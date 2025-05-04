'use client';
import React, { useState, useEffect } from 'react';
import { useCart, CartContextType } from '../context/CartContext';
import { productVariants } from './productVariants';
import Image from 'next/image';
import { eternalEleganceImages } from './eternalEleganceImages';
import { eternalEleganceVariants } from './eternalEleganceVariants';

// Add type for productVariants with index signature
interface ProductVariantsType {
  [productId: string]: {
    [colorName: string]: {
      [size: string]: {
        variant_id: number;
        price: number;
        stock_status: string;
      };
    };
  };
}

interface ColorOption {
  name: string;
  value: string;
  hex: string;
}

interface ProductCustomizerProps {
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
    colorMappings?: {
      shirtColor: string;
      logoColor: string;
      printifyProductId: string;
      images: string[];
    }[];
  };
}

// Eternal Elegance color options
const EE_SHIRT_COLORS: ColorOption[] = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Charcoal', value: 'charcoal', hex: '#36454F' },
  { name: 'Forest Green', value: 'fgreen', hex: '#228B22' },
  { name: 'Light Blue', value: 'lblue', hex: '#ADD8E6' },
  { name: 'Sand', value: 'sand', hex: '#C2B280' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
];

const EE_LOGO_COLORS: ColorOption[] = [
  { name: 'Grey', value: 'grey', hex: '#808080' },
  { name: 'Violet', value: 'violet', hex: '#8F00FF' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Red', value: 'red', hex: '#FF0000' },
  { name: 'Blue', value: 'blue', hex: '#0000FF' },
];

const SHIRT_COLORS: ColorOption[] = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Charcoal', value: 'charcoal', hex: '#36454F' },
  { name: 'Forest Green', value: 'fgreen', hex: '#228B22' },
  { name: 'Light Blue', value: 'lblue', hex: '#ADD8E6' },
  { name: 'Sand', value: 'sand', hex: '#C2B280' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
];

const defaultShirtColor = SHIRT_COLORS.find(c => c.value === 'charcoal') || SHIRT_COLORS[0];

const LOGO_COLORS: ColorOption[] = [
  { name: 'Grey', value: 'grey', hex: '#808080' },
  { name: 'Violet', value: 'violet', hex: '#8F00FF' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Red', value: 'red', hex: '#FF0000' },
];

const defaultLogoColor = LOGO_COLORS[0];

// Mapping from shirt color short code to full color name for productVariants lookup
const SHIRT_COLOR_CODE_TO_NAME: Record<string, string> = {
  black: 'Black',
  charcoal: 'Charcoal',
  fgreen: 'Forest Green',
  lblue: 'Light Blue',
  sand: 'Sand',
  white: 'White',
};

// Mapping from logo color value to product ID for productVariants lookup
const LOGO_COLOR_TO_PRODUCT_ID: Record<string, string> = {
  red: '6814491964bdd1b0c60875d0',
  violet: '681446b7b03bb3ed0c01a5c7',
  black: '681445f7b03bb3ed0c01a591',
  grey: '681449c6b03bb3ed0c01a685',
  white: '6814469c5057e72cc20d67c7',
};

// Eternal Elegance logo color to product ID mapping
const EE_LOGO_COLOR_TO_PRODUCT_ID: Record<string, string> = {
  red: '68163f2a42fcdb2640010975',
  blue: '6816397864bdd1b0c608ecf7',
  white: '681637d444c4abfbc303ec25',
  violet: '6816351f960c7decc0099524',
  grey: '68163317960c7decc0099499',
  black: '6814c6d00ed813d9e5087aea',
};

// Replace productVariants import type with ProductVariantsType
const productVariantsTyped: ProductVariantsType = productVariants;

// List of invalid shirt/logo color combinations
const INVALID_COMBOS: Array<{ shirt: string; logo: string }> = [
  { shirt: 'black', logo: 'red' },
  { shirt: 'black', logo: 'black' },
  { shirt: 'white', logo: 'white' },
];

export default function ProductCustomizer({ product }: ProductCustomizerProps) {
  const isEternalElegance = product.title.toLowerCase().includes('eternal elegance');
  // Use correct color options
  const shirtColors = isEternalElegance ? EE_SHIRT_COLORS : SHIRT_COLORS;
  const logoColors = isEternalElegance ? EE_LOGO_COLORS : LOGO_COLORS;
  const [selectedShirtColor, setSelectedShirtColor] = useState<ColorOption>(shirtColors[0]);
  const [selectedLogoColor, setSelectedLogoColor] = useState<ColorOption>(logoColors[0]);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { addItem, setIsCartOpen } = useCart();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use correct variant mapping
  const productVariantsTyped: ProductVariantsType = isEternalElegance ? eternalEleganceVariants : productVariants;

  const logoKey = selectedLogoColor.value;
  // Use the mapped product ID for productVariants lookup
  const productId = isEternalElegance
    ? EE_LOGO_COLOR_TO_PRODUCT_ID[logoKey]
    : LOGO_COLOR_TO_PRODUCT_ID[logoKey] || Object.keys(productVariantsTyped)[0];
  const colorKey = selectedShirtColor.value;
  // Use the full color name for productVariants lookup
  const colorName = SHIRT_COLOR_CODE_TO_NAME[colorKey] || colorKey;
  const sizeKey = selectedSize;
  const variant = productVariantsTyped[productId]?.[colorName]?.[sizeKey];
  const availableSizes = Object.keys(productVariantsTyped[productId]?.[colorName] || {});

  // Build image paths
  let images: string[] = [];
  if (isEternalElegance) {
    const colorName = SHIRT_COLOR_CODE_TO_NAME[selectedShirtColor.value] || selectedShirtColor.value;
    const logoKey = selectedLogoColor.value;
    images = eternalEleganceImages[colorName]?.[logoKey] || [];
  } else {
    const imageBase = `/images/phoenixES/${selectedShirtColor.value}_${selectedLogoColor.value}`;
    images = [
      `${imageBase}.jpg`,
      `${imageBase}1.jpg`,
    ];
  }

  // Filter logo colors based on selected shirt color
  const validLogoColors = logoColors.filter(
    (color) =>
      !INVALID_COMBOS.some(
        combo =>
          combo.shirt === selectedShirtColor.value &&
          combo.logo === color.value
      )
  );

  // Auto-select a valid logo color if the current one becomes invalid
  useEffect(() => {
    if (!validLogoColors.some(c => c.value === selectedLogoColor.value)) {
      setSelectedLogoColor(validLogoColors[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShirtColor]);

  const handleAddToCart = async () => {
    if (!variant) return;
    try {
      setIsAddingToCart(true);
      setError(null);
      addItem({
        id: productId,
        variantId: variant.variant_id,
        name: product.title,
        color: colorKey,
        logo: logoKey,
        size: sizeKey,
        price: variant.price / 100,
        quantity: 1,
        image: images[0],
      });
      setIsCartOpen(true);
      setSuccessMessage('Product added to cart!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleCustomize = async (shirtColor: string, logoColor: string, size: string) => {
    try {
      setIsAddingToCart(true);
      setError(null);

      // Get the product ID directly from your mapping
      const productId = LOGO_COLOR_TO_PRODUCT_ID[logoColor];
      if (!productId) {
        setError('No product ID found for selected logo color');
        return;
      }

      // Get the full color name for lookup
      const colorName = SHIRT_COLOR_CODE_TO_NAME[shirtColor] || shirtColor;

      // Check if the variant exists for the selected shirt color and size
      const variant = productVariantsTyped[productId]?.[colorName]?.[size];
      if (!variant) {
        setError('No variant found for selected options');
        return;
      }

      // Add the item to the cart
      addItem({
        id: productId,
        variantId: variant.variant_id,
        name: product.title,
        color: shirtColor,
        logo: logoColor,
        size,
        price: variant.price / 100,
        quantity: 1,
        image: `/images/phoenixES/${shirtColor}_${logoColor}.jpg`,
      });
      setIsCartOpen(true);
      setSuccessMessage('Product added to cart!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Mobile Layout */}
      <div className="lg:hidden space-y-6">
        <div className="relative h-[350px] rounded-lg overflow-hidden">
          <Image
            src={images[currentImageIndex]}
            alt={`${product.title} - ${selectedShirtColor.name} shirt with ${selectedLogoColor.name} logo`}
            fill
            className="object-contain"
            priority
          />
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

        {/* Shirt Color Selection */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Shirt Color</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {shirtColors.map((color) => (
              <button
                key={color.value}
                className={`w-10 h-10 rounded-full border-2 flex-shrink-0 ${
                  selectedShirtColor.value === color.value
                    ? 'border-gray-900'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedShirtColor(color)}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Logo Color Selection */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Logo Color</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {validLogoColors.map((color) => (
              <button
                key={color.value}
                className={`w-10 h-10 rounded-full border-2 flex-shrink-0 ${
                  selectedLogoColor.value === color.value
                    ? 'border-gray-900'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedLogoColor(color)}
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
            onChange={handleSizeChange}
            className="w-full p-2 border rounded text-gray-900"
          >
            {availableSizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={isAddingToCart}
          onClick={() => handleCustomize(selectedShirtColor.value, selectedLogoColor.value, selectedSize)}
          className="w-full py-3 rounded text-white text-lg font-semibold transition-colors duration-200"
          style={{ background: '#15803D' }}
        >
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>

      {/* Desktop Layout - Hidden on mobile */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[minmax(0,1.5fr),minmax(0,0.5fr)] gap-16 -ml-4">
          {/* Left Column - Product Image */}
          <div className="space-y-4">
            <div 
              className="relative w-full h-[600px] cursor-pointer bg-white rounded-lg p-4" 
              onClick={() => handleImageClick(currentImageIndex === 0 ? 1 : 0)}
            >
              <img
                src={images[currentImageIndex]}
                alt={`${selectedShirtColor.name} shirt with ${selectedLogoColor.name} logo`}
                className="w-full h-full object-contain"
              />
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

          {/* Right Column - Customization Options */}
          <div className="space-y-6 mt-24">
            {/* Shirt Color Selection */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Shirt Color</h3>
              <div className="flex flex-wrap gap-3">
                {shirtColors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-12 h-12 rounded-full border-2 ${
                      selectedShirtColor.value === color.value
                        ? 'border-gray-900'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedShirtColor(color)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Logo Color Selection */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Logo Color</h3>
              <div className="flex flex-wrap gap-3">
                {validLogoColors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-12 h-12 rounded-full border-2 ${
                      selectedLogoColor.value === color.value
                        ? 'border-gray-900'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedLogoColor(color)}
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
                onChange={handleSizeChange}
                className="w-full p-2 border rounded text-gray-900"
              >
                {availableSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Add to Cart Button */}
            <button
              disabled={isAddingToCart}
              onClick={() => handleCustomize(selectedShirtColor.value, selectedLogoColor.value, selectedSize)}
              className="w-full py-4 rounded text-white text-xl font-semibold transition-colors duration-200"
              style={{ background: '#15803D' }}
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {successMessage && <div className="text-green-500 text-center">{successMessage}</div>}
    </div>
  );
} 
