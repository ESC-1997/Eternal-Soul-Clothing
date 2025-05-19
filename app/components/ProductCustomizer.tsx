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

// Mapping from UI hat color value to eternalSnapVariants/Images mapping key
const SNAP_COLOR_UI_TO_MAPPING: Record<string, string> = {
  black: 'Black',
  black_charcoal_gray: 'Black/Charcoal gray/Charcoal gray',
  black_gray_gray: 'Black/Gray/Gray',
  black_red_red: 'Black/Red/Red',
  red_black_black: 'Red/Black/Black',
  white: 'White',
  black_white_white: 'Black/White/White',
  charcoal_white: 'Charcoal/White', // if needed
};

// Mapping from UI hat color value to button background (solid or split)
const SNAP_COLOR_UI_TO_STYLE: Record<string, React.CSSProperties> = {
  black: { background: '#000000' },
  black_charcoal_gray: { background: 'linear-gradient(90deg, #36454F 50%, #000000 50%)' },
  black_gray_gray: { background: 'linear-gradient(90deg, #808080 50%, #000000 50%)' },
  black_red_red: { background: 'linear-gradient(90deg, #FF0000 50%, #000000 50%)' },
  red_black_black: { background: 'linear-gradient(90deg, #000000 50%, #FF0000 50%)' },
  white: { background: '#FFFFFF' },
  black_white_white: { background: 'linear-gradient(90deg, #000000 50%, #FFFFFF 50%)' },
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

// The Eternal Snap color and logo options
const SNAP_SHIRT_COLORS: ColorOption[] = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Black/Charcoal gray/Charcoal gray', value: 'black_charcoal_gray', hex: '#36454F' },
  { name: 'Black/Gray/Gray', value: 'black_gray_gray', hex: '#808080' },
  { name: 'Black/Red/Red', value: 'black_red_red', hex: '#FF0000' },
  { name: 'Red/Black/Black', value: 'red_black_black', hex: '#FF0000' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Black/White/White', value: 'black_white_white', hex: '#FFFFFF' },
];

const SNAP_LOGO_COLORS: ColorOption[] = [
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Black', value: 'black', hex: '#000000' },
];

// Eternal Snap logo color to product ID mapping
const SNAP_LOGO_COLOR_TO_PRODUCT_ID: Record<string, string> = {
  white: '6828ef61ecd9db648306e954',
  black: '6828ede2465b246fe50cc776',
};

// Eternal Snap variants mapping
const eternalSnapVariants = {
  '6828ef61ecd9db648306e954': { // White Logo
    'Black': {
      'One size': { variant_id: 118985, price: 40, stock_status: 'In Stock' },
    },
    'Black/Charcoal gray/Charcoal gray': {
      'One size': { variant_id: 118987, price: 40, stock_status: 'In Stock' },
    },
    'Black/Gray/Gray': {
      'One size': { variant_id: 118988, price: 40, stock_status: 'In Stock' },
    },
    'Black/Red/Red': {
      'One size': { variant_id: 118989, price: 40, stock_status: 'In Stock' },
    },
    'Red/Black/Black': {
      'One size': { variant_id: 119000, price: 40, stock_status: 'In Stock' },
    },
  },
  '6828ede2465b246fe50cc776': { // Black Logo
    'White': {
      'One size': { variant_id: 119001, price: 40, stock_status: 'In Stock' },
    },
    'Black/Gray/Gray': {
      'One size': { variant_id: 118988, price: 40, stock_status: 'In Stock' },
    },
    'Black/Red/Red': {
      'One size': { variant_id: 118989, price: 40, stock_status: 'In Stock' },
    },
    'Black/White/White': {
      'One size': { variant_id: 118990, price: 40, stock_status: 'In Stock' },
    },
  },
};

// Eternal Snap (Eternal Cap) image mapping
const eternalSnapImages: {
  [productId: string]: {
    [variantId: string]: string[];
  };
} = {
  '6828ede2465b246fe50cc776': {
    '119001': [
      '/images/eternal_cap/white_black1.jpg',
      '/images/eternal_cap/white_black2.jpg',
      '/images/eternal_cap/white_black3.jpg',
    ],
    '118988': [
      '/images/eternal_cap/grey_black1.jpg',
      '/images/eternal_cap/grey_black2.jpg',
      '/images/eternal_cap/grey_black3.jpg',
    ],
    '118989': [
      '/images/eternal_cap/red_black1.jpg',
      '/images/eternal_cap/red_black2.jpg',
      '/images/eternal_cap/red_black3.jpg',
    ],
    '118990': [
      '/images/eternal_cap/white_black_duo1.jpg',
      '/images/eternal_cap/white_black_duo2.jpg',
      '/images/eternal_cap/white_black_duo3.jpg',
    ],
  },
  '6828ef61ecd9db648306e954': {
    '118985': [
      '/images/eternal_cap/black_white1.jpg',
      '/images/eternal_cap/black_white2.jpg',
      '/images/eternal_cap/black_white3.jpg',
    ],
    '118987': [
      '/images/eternal_cap/charcoal_white1.jpg',
      '/images/eternal_cap/charcoal_white2.jpg',
      '/images/eternal_cap/charcoal_white3.jpg',
    ],
    '118988': [
      '/images/eternal_cap/grey_white1.jpg',
      '/images/eternal_cap/grey_white2.jpg',
      '/images/eternal_cap/grey_white3.jpg',
    ],
    '118989': [
      '/images/eternal_cap/red_white1.jpg',
      '/images/eternal_cap/red_white2.jpg',
      '/images/eternal_cap/red_white3.jpg',
    ],
    '119000': [
      '/images/eternal_cap/black_white_duo1.jpg',
      '/images/eternal_cap/black_white_duo2.jpg',
      '/images/eternal_cap/black_white_duo3.jpg',
    ],
  },
};

// For The Eternal Snap, define invalid combinations by logo and hat color value
const SNAP_INVALID_COMBOS: Array<{ logo: string; hat: string }> = [
  { logo: 'white', hat: 'black_white_white' }, // hat color 7
  { logo: 'black', hat: 'red_black_black' },   // hat color 5
  { logo: 'black', hat: 'black_charcoal_gray' } // hat color 2
];

export default function ProductCustomizer({ product }: ProductCustomizerProps) {
  const isEternalElegance = product.title.toLowerCase().includes('eternal elegance');
  const isEternalDivide = product.title.toLowerCase().includes('eternal divide');
  const isEternalSnap = product.title.toLowerCase().includes('eternal snap');
  
  // Use correct color options
  const shirtColors = isEternalElegance 
    ? EE_SHIRT_COLORS 
    : isEternalDivide 
      ? ES_SHIRT_COLORS 
      : isEternalSnap ? SNAP_SHIRT_COLORS : SHIRT_COLORS;
  const logoColors = isEternalElegance 
    ? EE_LOGO_COLORS 
    : isEternalDivide 
      ? ES_LOGO_COLORS 
      : isEternalSnap ? SNAP_LOGO_COLORS : LOGO_COLORS;
  const [selectedShirtColor, setSelectedShirtColor] = useState<ColorOption>(shirtColors[0]);
  const [selectedLogoColor, setSelectedLogoColor] = useState<ColorOption>(logoColors[0]);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { addItem, setIsCartOpen } = useCart();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use correct variant mapping
  const productVariantsTyped: ProductVariantsType = isEternalElegance ? eternalEleganceVariants : isEternalDivide ? eternalSlashVariants : isEternalSnap ? eternalSnapVariants : productVariants;

  const logoKey = selectedLogoColor.value;
  // Use the mapped product ID for productVariants lookup
  const productId = isEternalElegance
    ? EE_LOGO_COLOR_TO_PRODUCT_ID[logoKey]
    : isEternalDivide
      ? ES_LOGO_COLOR_TO_PRODUCT_ID[logoKey]
      : isEternalSnap ? SNAP_LOGO_COLOR_TO_PRODUCT_ID[logoKey] : LOGO_COLOR_TO_PRODUCT_ID[logoKey] || Object.keys(productVariantsTyped)[0];
  const colorKey = selectedShirtColor.value;
  // Use the correct color name format for variants lookup
  const colorName = isEternalDivide ? colorKey : SHIRT_COLOR_CODE_TO_NAME[colorKey] || colorKey;
  const sizeKey = selectedSize;

  // Use the correct variants data source
  const variantsData = isEternalElegance 
    ? eternalEleganceVariants 
    : isEternalDivide 
      ? eternalSlashVariants 
      : isEternalSnap ? eternalSnapVariants : productVariantsTyped;

  // Type assertion to handle the variants data
  const typedVariantsData = variantsData as ProductVariantsType;
  const variant = typedVariantsData[productId]?.[colorName]?.[sizeKey];
  
  // Get available sizes based on the actual variants data
  let availableSizes: string[] = [];
  
  if (isEternalDivide) {
    type EternalDivideProductId = keyof typeof eternalSlashVariants;
    type EternalDivideColorName = keyof (typeof eternalSlashVariants)[EternalDivideProductId];
    
    const productVariants = eternalSlashVariants[productId as EternalDivideProductId];
    if (productVariants) {
      const colorVariants = productVariants[colorName as EternalDivideColorName];
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
    isEternalDivide,
    logoKey,
    productId,
    colorKey,
    colorName,
    selectedSize,
    availableSizes,
    productVariants: isEternalDivide ? eternalSlashVariants[productId as keyof typeof eternalSlashVariants] : null,
    colorVariants: isEternalDivide ? eternalSlashVariants[productId as keyof typeof eternalSlashVariants]?.[colorName as keyof (typeof eternalSlashVariants)[keyof typeof eternalSlashVariants]] : null
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
  } else if (isEternalDivide) {
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
  } else if (isEternalSnap) {
    // Use the mapping to get the correct color key for lookups
    const mappingColorKey = SNAP_COLOR_UI_TO_MAPPING[selectedShirtColor.value] || selectedShirtColor.value;
    let variantId: string | undefined = undefined;
    const snapVariants = (eternalSnapVariants as Record<string, any>)[productId];
    if (snapVariants && snapVariants[mappingColorKey]) {
      const sizeKeys = Object.keys(snapVariants[mappingColorKey]);
      if (sizeKeys.length > 0) {
        variantId = snapVariants[mappingColorKey][sizeKeys[0]].variant_id.toString();
      }
    }
    if (variantId && eternalSnapImages[productId] && eternalSnapImages[productId][variantId]) {
      images = eternalSnapImages[productId][variantId];
    } else {
      images = [];
    }
  } else {
    const imageBase = `/images/phoenixES/${selectedShirtColor.value}_${selectedLogoColor.value}`;
    images = [
      `${imageBase}.jpg`,
      `${imageBase}1.jpg`,
    ];
  }

  // Filter logo colors based on selected shirt color
  const validLogoColors = isEternalDivide 
    ? logoColors // For Eternal Divide, allow all combinations
    : logoColors.filter(
        (color) =>
          !INVALID_COMBOS.some(
            combo =>
              combo.shirt === selectedShirtColor.value &&
              combo.logo === color.value
          )
      );

  // Filter shirt colors based on selected logo color for Eternal Divide
  const validShirtColors = isEternalDivide && selectedLogoColor.value in ES_VALID_SHIRT_COLORS
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
    if (isEternalDivide && selectedLogoColor.value in ES_VALID_SHIRT_COLORS && 
        !ES_VALID_SHIRT_COLORS[selectedLogoColor.value].includes(selectedShirtColor.value)) {
      setSelectedShirtColor(validShirtColors[0]);
    }
  }, [selectedLogoColor, isEternalDivide]);

  // In the color selection button rendering for shirtColors (hat colors), filter out invalid combos for The Eternal Snap:
  const filteredShirtColors = isEternalSnap
    ? validShirtColors.filter(color =>
        !SNAP_INVALID_COMBOS.some(combo =>
          combo.logo === selectedLogoColor.value && combo.hat === color.value
        )
      )
    : validShirtColors;

  // In the logo color selection, filter out invalid combos for The Eternal Snap as well
  const filteredLogoColors = isEternalSnap
    ? validLogoColors.filter(color =>
        !SNAP_INVALID_COMBOS.some(combo =>
          combo.hat === selectedShirtColor.value && combo.logo === color.value
        )
      )
    : validLogoColors;

  // For The Eternal Snap, always use the mapped productId and variantId for cart
  let snapCartProductId = productId;
  let snapCartVariantId: number | undefined = undefined;
  if (isEternalSnap) {
    const mappingColorKey = SNAP_COLOR_UI_TO_MAPPING[selectedShirtColor.value] || selectedShirtColor.value;
    const snapVariants = (eternalSnapVariants as Record<string, any>)[productId];
    if (snapVariants && snapVariants[mappingColorKey]) {
      const sizeKeys = Object.keys(snapVariants[mappingColorKey]);
      if (sizeKeys.length > 0) {
        snapCartVariantId = snapVariants[mappingColorKey][sizeKeys[0]].variant_id;
      }
    }
  }

  // Compute the correct price for The Eternal Snap
  const snapPrice = isEternalSnap && variant ? variant.price : 40;

  const handleAddToCart = async () => {
    // For The Eternal Snap, use snapCartProductId and snapCartVariantId
    if (isEternalSnap && snapCartVariantId) {
      try {
        setIsAddingToCart(true);
        setError(null);
        addItem({
          id: snapCartProductId,
          variantId: snapCartVariantId,
          name: product.title,
          color: selectedShirtColor.value,
          logo: selectedLogoColor.value,
          size: 'One size',
          price: snapPrice,
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
      return;
    }
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
        price: snapPrice,
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
    // For The Eternal Snap, use snapCartProductId and snapCartVariantId
    if (isEternalSnap) {
      const mappingColorKey = SNAP_COLOR_UI_TO_MAPPING[shirtColor] || shirtColor;
      const snapVariants = (eternalSnapVariants as Record<string, any>)[productId];
      let variantId: number | undefined = undefined;
      if (snapVariants && snapVariants[mappingColorKey]) {
        const sizeKeys = Object.keys(snapVariants[mappingColorKey]);
        if (sizeKeys.length > 0) {
          variantId = snapVariants[mappingColorKey][sizeKeys[0]].variant_id;
        }
      }
      if (variantId) {
        try {
          setIsAddingToCart(true);
          setError(null);
          addItem({
            id: productId,
            variantId: variantId,
            name: product.title,
            color: shirtColor,
            logo: logoColor,
            size: 'One size',
            price: snapPrice,
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
      } else {
        setError('No variant found for selected options');
      }
      return;
    }
    try {
      setIsAddingToCart(true);
      setError(null);

      // Use productVariantsTyped for Eternal Elegance and Eternal Divide
      if (isEternalElegance || isEternalDivide) {
        const productId = isEternalElegance 
          ? EE_LOGO_COLOR_TO_PRODUCT_ID[logoColor]
          : ES_LOGO_COLOR_TO_PRODUCT_ID[logoColor];
        const colorName = isEternalDivide ? shirtColor : SHIRT_COLOR_CODE_TO_NAME[shirtColor] || shirtColor;
        const variant = productVariantsTyped[productId]?.[colorName]?.[size];
        
        console.log('Variant lookup:', {
          isEternalDivide,
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
          price: snapPrice,
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
        price: snapPrice,
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
                Price: {isEternalSnap
                  ? `$${snapPrice.toFixed(2)}`
                  : `$${(parseInt(product.variants[0].price) / 100).toFixed(2)}`}
              </span>
            </div>
            <div className="text-green-700 font-medium">
              {selectedStockStatus}
            </div>
          </div>
        )}

        {/* Shirt Color Selection (renamed to Hat Color for Eternal Snap) */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">{isEternalSnap ? 'Hat Color' : 'Shirt Color'}</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filteredShirtColors.map((color) => (
              <button
                key={color.value}
                className={`w-10 h-10 rounded-full border-2 flex-shrink-0 ${
                  selectedShirtColor.value === color.value
                    ? 'border-gray-900'
                    : 'border-transparent'
                }`}
                style={
                  isEternalSnap
                    ? SNAP_COLOR_UI_TO_STYLE[color.value] || { backgroundColor: color.hex }
                    : { backgroundColor: color.hex }
                }
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
            {filteredLogoColors.map((color) => (
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

        {/* Size Selection (static for Eternal Snap) */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Size</h3>
          {isEternalSnap ? (
            <div className="w-full p-2 border rounded text-gray-900 bg-gray-100">One Size</div>
          ) : (
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
          )}
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
                    Price: {isEternalSnap
                      ? `$${snapPrice.toFixed(2)}`
                      : `$${(parseInt(product.variants[0].price) / 100).toFixed(2)}`}
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
            {/* Shirt Color Selection (renamed to Hat Color for Eternal Snap) */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{isEternalSnap ? 'Hat Color' : 'Shirt Color'}</h3>
              <div className="flex flex-wrap gap-3">
                {filteredShirtColors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-12 h-12 rounded-full border-2 ${
                      selectedShirtColor.value === color.value
                        ? 'border-gray-900'
                        : 'border-transparent'
                    }`}
                    style={
                      isEternalSnap
                        ? SNAP_COLOR_UI_TO_STYLE[color.value] || { backgroundColor: color.hex }
                        : { backgroundColor: color.hex }
                    }
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
                {filteredLogoColors.map((color) => (
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

            {/* Size Selection (static for Eternal Snap) */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Size</h3>
              {isEternalSnap ? (
                <div className="w-full p-2 border rounded text-gray-900 bg-gray-100">One Size</div>
              ) : (
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
              )}
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
