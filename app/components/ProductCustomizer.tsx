'use client';
import React, { useState, useEffect } from 'react';
import { useCart, CartContextType } from '../context/CartContext';
import { productVariants } from './productVariants';
import Image from 'next/image';
import { eternalEleganceImages } from './eternalEleganceImages';
import { eternalEleganceVariants } from './eternalEleganceVariants';
import { eternalSlashVariants } from './eternalSlashVariants';

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
      size: string;
      variantId: number;
      price: number;
      stock_status: string;
      images?: string[];
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

// Eternal Slash color options
const ES_SHIRT_COLORS: ColorOption[] = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Charcoal', value: 'charcoal', hex: '#36454F' },
  { name: 'Dark Chocolate', value: 'dark_chocolate', hex: '#654321' },
  { name: 'Forest Green', value: 'forest_green', hex: '#228B22' },
  { name: 'Light Blue', value: 'light_blue', hex: '#ADD8E6' },
  { name: 'Navy', value: 'navy', hex: '#000080' },
  { name: 'Sage', value: 'sage', hex: '#BCB88A' },
  { name: 'Sand', value: 'sand', hex: '#C2B280' },
  { name: 'Stone Blue', value: 'stone_blue', hex: '#4682B4' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
];

const ES_LOGO_COLORS: ColorOption[] = [
  { name: 'Midnight Indigo', value: 'midnight_indigo', hex: '#191970' },
  { name: 'Red', value: 'red', hex: '#FF0000' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Grey', value: 'grey', hex: '#808080' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Violet', value: 'violet', hex: '#8F00FF' },
];

// Default color options for other products
const SHIRT_COLORS: ColorOption[] = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Charcoal', value: 'charcoal', hex: '#36454F' },
  { name: 'Forest Green', value: 'fgreen', hex: '#228B22' },
  { name: 'Light Blue', value: 'lblue', hex: '#ADD8E6' },
  { name: 'Sand', value: 'sand', hex: '#C2B280' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
];

const LOGO_COLORS: ColorOption[] = [
  { name: 'Grey', value: 'grey', hex: '#808080' },
  { name: 'Violet', value: 'violet', hex: '#8F00FF' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Red', value: 'red', hex: '#FF0000' },
];

const defaultShirtColor = SHIRT_COLORS.find(c => c.value === 'charcoal') || SHIRT_COLORS[0];

const defaultLogoColor = LOGO_COLORS[0];

// Mapping from shirt color short code to full color name for productVariants lookup
const SHIRT_COLOR_CODE_TO_NAME: Record<string, string> = {
  black: 'Black',
  charcoal: 'Charcoal',
  fgreen: 'Forest Green',
  lblue: 'Light Blue',
  sand: 'Sand',
  white: 'White',
  dark_chocolate: 'Dark Chocolate',
  forest_green: 'Forest Green',
  light_blue: 'Light Blue',
  navy: 'Navy',
  sage: 'Sage',
  stone_blue: 'Stone Blue'
};

// Mapping from UI color value to image color code
const COLOR_TO_IMAGE_CODE: Record<string, string> = {
  dark_chocolate: 'dchocolate',
  forest_green: 'fgreen',
  light_blue: 'lblue',
  stone_blue: 'sblue',
  // Add direct mappings for colors that don't need transformation
  black: 'black',
  charcoal: 'charcoal',
  navy: 'navy',
  sage: 'sage',
  sand: 'sand',
  white: 'white'
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

// Eternal Slash logo color to product ID mapping
const ES_LOGO_COLOR_TO_PRODUCT_ID: Record<string, string> = {
  midnight_indigo: '6820b02093284a99660b189d',
  red: '6820aed333803c3c4502120d',
  white: '6820ad40471efa6af008268a',
  grey: '6820abb0471efa6af0082632',
  black: '681fe48893284a99660af2f9',
  violet: '681fe068ebfdaacb650ca1d7'
};

// Replace productVariants import type with ProductVariantsType
const productVariantsTyped: ProductVariantsType = productVariants;

// List of invalid shirt/logo color combinations
const INVALID_COMBOS: Array<{ shirt: string; logo: string }> = [
  // Only keep invalid combinations for non-Eternal Slash products
  { shirt: 'black', logo: 'red' },
  { shirt: 'black', logo: 'black' },
  { shirt: 'white', logo: 'white' },
];

// Valid shirt colors for each logo color in Eternal Slash
const ES_VALID_SHIRT_COLORS: Record<string, string[]> = {
  black: ['charcoal', 'forest_green', 'light_blue', 'sand', 'white'],
  violet: ['black', 'charcoal', 'forest_green', 'light_blue', 'sand', 'white'],
  grey: ['black', 'charcoal', 'forest_green', 'light_blue', 'navy', 'sage', 'sand', 'white'],
  white: ['black', 'charcoal', 'dark_chocolate', 'forest_green', 'light_blue', 'navy', 'sage', 'sand'],
  red: ['black', 'charcoal', 'dark_chocolate', 'forest_green', 'light_blue', 'navy', 'sage', 'sand', 'white'],
  midnight_indigo: ['charcoal', 'light_blue', 'sage', 'sand', 'stone_blue', 'white'],
};

export default function ProductCustomizer({ product }: ProductCustomizerProps) {
  const isEternalElegance = product.title.toLowerCase().includes('eternal elegance');
  const isEternalSlash = product.title.toLowerCase().includes('eternal slash');
  
  // Use correct color options
  const shirtColors = isEternalElegance 
    ? EE_SHIRT_COLORS 
    : isEternalSlash 
      ? ES_SHIRT_COLORS 
      : SHIRT_COLORS;
  const logoColors = isEternalElegance 
    ? EE_LOGO_COLORS 
    : isEternalSlash 
      ? ES_LOGO_COLORS 
      : LOGO_COLORS;
  const [selectedShirtColor, setSelectedShirtColor] = useState<ColorOption>(shirtColors[0]);
  const [selectedLogoColor, setSelectedLogoColor] = useState<ColorOption>(logoColors[0]);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { addItem, setIsCartOpen } = useCart();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use correct variant mapping
  const productVariantsTyped: ProductVariantsType = isEternalElegance ? eternalEleganceVariants : isEternalSlash ? eternalSlashVariants : productVariants;

  const logoKey = selectedLogoColor.value;
  // Use the mapped product ID for productVariants lookup
  const productId = isEternalElegance
    ? EE_LOGO_COLOR_TO_PRODUCT_ID[logoKey]
    : isEternalSlash
      ? ES_LOGO_COLOR_TO_PRODUCT_ID[logoKey]
      : LOGO_COLOR_TO_PRODUCT_ID[logoKey] || Object.keys(productVariantsTyped)[0];
  const colorKey = selectedShirtColor.value;
  // Use the correct color name format for variants lookup
  const colorName = isEternalSlash ? colorKey : SHIRT_COLOR_CODE_TO_NAME[colorKey] || colorKey;
  const sizeKey = selectedSize;

  // Use the correct variants data source
  const variantsData = isEternalElegance 
    ? eternalEleganceVariants 
    : isEternalSlash 
      ? eternalSlashVariants 
      : productVariantsTyped;

  // Type assertion to handle the variants data
  const typedVariantsData = variantsData as ProductVariantsType;
  const variant = typedVariantsData[productId]?.[colorName]?.[sizeKey];
  
  // Get available sizes based on the actual variants data
  let availableSizes: string[] = [];
  
  if (isEternalSlash) {
    type EternalSlashProductId = keyof typeof eternalSlashVariants;
    type EternalSlashColorName = keyof (typeof eternalSlashVariants)[EternalSlashProductId];
    
    const productVariants = eternalSlashVariants[productId as EternalSlashProductId];
    if (productVariants) {
      const colorVariants = productVariants[colorName as EternalSlashColorName];
      if (colorVariants) {
        availableSizes = Object.keys(colorVariants).filter(size => 
          colorVariants[size as keyof typeof colorVariants].stock_status === 'in_stock'
        );
      }
    }
  } else {
    availableSizes = Object.keys(typedVariantsData[productId]?.[colorName] || {});
  }
  
  console.log('Debug values:', {
    isEternalSlash,
    logoKey,
    productId,
    colorKey,
    colorName,
    selectedSize,
    availableSizes,
    productVariants: isEternalSlash ? eternalSlashVariants[productId as keyof typeof eternalSlashVariants] : null,
    colorVariants: isEternalSlash ? eternalSlashVariants[productId as keyof typeof eternalSlashVariants]?.[colorName as keyof (typeof eternalSlashVariants)[keyof typeof eternalSlashVariants]] : null
  });
  
  // If the currently selected size is not available, select the first available size
  if (!availableSizes.includes(selectedSize) && availableSizes.length > 0) {
    setSelectedSize(availableSizes[0]);
  }

  // Build image paths
  let images: string[] = [];
  if (isEternalElegance) {
    const colorName = SHIRT_COLOR_CODE_TO_NAME[selectedShirtColor.value] || selectedShirtColor.value;
    const logoKey = selectedLogoColor.value;
    images = eternalEleganceImages[colorName]?.[logoKey] || [];
  } else if (isEternalSlash) {
    const logoColor = selectedLogoColor.value;
    const shirtColor = COLOR_TO_IMAGE_CODE[selectedShirtColor.value] || selectedShirtColor.value;
    // Only show image if it's a valid combination
    if (ES_VALID_SHIRT_COLORS[logoColor]?.includes(selectedShirtColor.value)) {
      // Map 'violet' to 'purple' for image paths
      const logoColorForImage = logoColor === 'violet' ? 'purple' : logoColor;
      const imagePath = `/images/eternal_slash/${logoColorForImage}_${shirtColor}.jpg`;
      images = [imagePath];
      console.log('Image path construction:', {
        logoColor,
        shirtColor,
        logoColorForImage,
        finalPath: imagePath,
        validCombination: ES_VALID_SHIRT_COLORS[logoColor]?.includes(selectedShirtColor.value)
      });
    }
  } else {
    const imageBase = `/images/phoenixES/${selectedShirtColor.value}_${selectedLogoColor.value}`;
    images = [
      `${imageBase}.jpg`,
      `${imageBase}1.jpg`,
    ];
  }

  // Filter logo colors based on selected shirt color
  const validLogoColors = isEternalSlash 
    ? logoColors // For Eternal Slash, allow all combinations
    : logoColors.filter(
        (color) =>
          !INVALID_COMBOS.some(
            combo =>
              combo.shirt === selectedShirtColor.value &&
              combo.logo === color.value
          )
      );

  // Filter shirt colors based on selected logo color for Eternal Slash
  const validShirtColors = isEternalSlash && selectedLogoColor.value in ES_VALID_SHIRT_COLORS
    ? shirtColors.filter(color => ES_VALID_SHIRT_COLORS[selectedLogoColor.value].includes(color.value))
    : shirtColors;

  // Auto-select a valid logo color if the current one becomes invalid
  useEffect(() => {
    if (!validLogoColors.some(c => c.value === selectedLogoColor.value)) {
      setSelectedLogoColor(validLogoColors[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShirtColor]);

  // Auto-select a valid shirt color if the current one becomes invalid
  useEffect(() => {
    if (isEternalSlash && selectedLogoColor.value in ES_VALID_SHIRT_COLORS && 
        !ES_VALID_SHIRT_COLORS[selectedLogoColor.value].includes(selectedShirtColor.value)) {
      setSelectedShirtColor(validShirtColors[0]);
    }
  }, [selectedLogoColor, isEternalSlash]);

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

      // Use productVariantsTyped for Eternal Elegance and Eternal Slash
      if (isEternalElegance || isEternalSlash) {
        const productId = isEternalElegance 
          ? EE_LOGO_COLOR_TO_PRODUCT_ID[logoColor]
          : ES_LOGO_COLOR_TO_PRODUCT_ID[logoColor];
        const colorName = isEternalSlash ? shirtColor : SHIRT_COLOR_CODE_TO_NAME[shirtColor] || shirtColor;
        const variant = productVariantsTyped[productId]?.[colorName]?.[size];
        
        console.log('Variant lookup:', {
          isEternalSlash,
          isEternalElegance,
          shirtColor,
          logoColor,
          size,
          productId,
          colorName,
          variant,
          productVariantsTyped: productVariantsTyped[productId],
          colorVariants: productVariantsTyped[productId]?.[colorName]
        });

        if (!productId) {
          setError('No product ID found for selected logo color');
          return;
        }
        if (!variant) {
          setError('No variant found for selected options');
          return;
        }

        addItem({
          id: productId,
          variantId: variant.variant_id,
          name: product.title,
          color: shirtColor,
          logo: logoColor,
          size: size,
          price: variant.price / 100,
          quantity: 1,
          image: images[0],
        });
        setIsCartOpen(true);
        setSuccessMessage('Product added to cart!');
        return;
      }

      // Fallback to old logic for other products
      const productId = LOGO_COLOR_TO_PRODUCT_ID[logoColor];
      const colorName = SHIRT_COLOR_CODE_TO_NAME[shirtColor] || shirtColor;
      const variant = productVariantsTyped[productId]?.[colorName]?.[size];
      
      if (!productId) {
        setError('No product ID found for selected logo color');
        return;
      }
      if (!variant) {
        setError('No variant found for selected options');
        return;
      }

      addItem({
        id: productId,
        variantId: variant.variant_id,
        name: product.title,
        color: shirtColor,
        logo: logoColor,
        size: size,
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

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(e.target.value);
  };

  // Helper to get stock status for a given size
  const getStockStatus = (size: string) => {
    if (productVariantsTyped[productId] && productVariantsTyped[productId][colorName] && productVariantsTyped[productId][colorName][size]) {
      return productVariantsTyped[productId][colorName][size].stock_status || 'In Stock';
    }
    return 'In Stock';
  };
  const selectedStockStatus = getStockStatus(selectedSize);

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
              {selectedStockStatus}
            </div>
          </div>
        )}

        {/* Shirt Color Selection */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Shirt Color</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {validShirtColors.map((color) => (
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
          onClick={() => handleCustomize(selectedShirtColor.value, selectedLogoColor.value, selectedSize)}
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
                  {selectedStockStatus}
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
                {validShirtColors.map((color) => (
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
              onClick={() => handleCustomize(selectedShirtColor.value, selectedLogoColor.value, selectedSize)}
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

      {/* Error and Success Messages */}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {successMessage && <div className="text-green-500 text-center">{successMessage}</div>}
    </div>
  );
} 
