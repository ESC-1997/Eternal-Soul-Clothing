'use client';
import { useEffect, useState } from 'react';
import ProductCustomizer from './ProductCustomizer';
import ProductViewer from './ProductViewer';
import { eternalEleganceVariants as _eternalEleganceVariants } from './eternalEleganceVariants';
import { eternalSlashVariants as _eternalSlashVariants } from './eternalSlashVariants';
const eternalEleganceVariants: Record<string, any> = _eternalEleganceVariants;
const eternalSlashVariants: Record<string, any> = _eternalSlashVariants;

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
  }[];
  customizable?: boolean;
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
}

interface PrintifyStoreProps {
  onCustomizationModeChange: (isCustomizing: boolean) => void;
  onViewModeChange: (isViewing: boolean) => void;
}

// Add this mapping at the top of the file
const EE_PRODUCT_ID_TO_LOGO_COLOR: Record<string, string> = {
  '68163f2a42fcdb2640010975': 'red',
  '6816397864bdd1b0c608ecf7': 'blue',
  '681637d444c4abfbc303ec25': 'white',
  '6816351f960c7decc0099524': 'violet',
  '68163317960c7decc0099499': 'grey',
  '6814c6d00ed813d9e5087aea': 'black',
};

const ES_PRODUCT_ID_TO_LOGO_COLOR: Record<string, string> = {
  '6820b02093284a99660b189d': 'midnight_indigo',
  '6820aed333803c3c4502120d': 'red',
  '6820ad40471efa6af008268a': 'white',
  '6820abb0471efa6af0082632': 'grey',
  '681fe48893284a99660af2f9': 'black',
  '681fe068ebfdaacb650ca1d7': 'violet'
};

function getLogoColorFromProductId(productId: string, productType: 'ee' | 'es' = 'ee'): string {
  return productType === 'ee' ? EE_PRODUCT_ID_TO_LOGO_COLOR[productId] || '' : ES_PRODUCT_ID_TO_LOGO_COLOR[productId] || '';
}

export default function PrintifyStore({ onCustomizationModeChange, onViewModeChange }: PrintifyStoreProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState<Record<string, boolean>>({});
  const [currentImageStates, setCurrentImageStates] = useState<Record<string, number>>({});
  // Paging state
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 9;
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const pagedProducts = products.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent, productId: string) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (productId: string) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      setShowSwipeIndicator(prev => ({ ...prev, [productId]: false }));
      setCurrentImageStates(prev => ({
        ...prev,
        [productId]: prev[productId] === 0 ? 1 : 0
      }));
    }
  };

  // Notify parent when customization mode changes
  useEffect(() => {
    if (onCustomizationModeChange) {
      onCustomizationModeChange(!!selectedProduct?.customizable);
    }
  }, [selectedProduct, onCustomizationModeChange]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        
        // Debug: Log all product titles
        console.log('All products:', data.map((p: Product) => p.title));
        
        const filteredProducts = data.filter(
          (product: Product) => {
            const isEternalElegance = product.title && product.title.toLowerCase().trim().includes('eternal elegance');
            const shouldInclude = 
              product.id !== "681449c6b03bb3ed0c01a685" && // Remove the original Phoenix Logo
              (
                product.title === "Eternal Lotus (Black & Grey)" || 
                product.title === "Eternal Lotus - Purple Floral Graphic Tee " ||
                product.title === "Eternal Collapse" ||
                product.title === "Vow of the Eternal" ||
                product.title === "Eternal Awakening" ||
                product.title === "Eternal Divide" ||
                isEternalElegance
              );
            
            // Debug: Log each product's title, isEternalElegance, and whether it's included
            console.log(`Product: '${product.title}', isEternalElegance: ${isEternalElegance}, Included: ${shouldInclude}`);
            
            // Debug: Log variant data for Eternal Awakening
            if (product.title === "Eternal Awakening") {
              console.log('Eternal Awakening variants in frontend:', product.variants);
            }
            
            return shouldInclude;
          }
        );

        // Debug: Log filtered products
        console.log('Filtered products:', filteredProducts.map((p: Product) => p.title));

        // Filter out customizable products and Eternal Elegance products for regularProducts
        const regularProducts = filteredProducts.filter(
          (product: Product) =>
            !product.title.toLowerCase().includes('eternal elegance') && !product.customizable
        );
        
        // Create a single combined customizable product (ES Phoenix Logo)
        const combinedCustomizableProduct: Product = {
          id: 'phoenix-es-logo',
          title: 'ES Phoenix Logo',
          images: [
            { src: '/images/phoenixES/black_grey.jpg' },
            { src: '/images/phoenixES/black_violet.jpg' },
            { src: '/images/phoenixES/black_white.jpg' },
            { src: '/images/phoenixES/charcoal_black.jpg' },
            { src: '/images/phoenixES/charcoal_grey.jpg' },
            { src: '/images/phoenixES/charcoal_red.jpg' },
            { src: '/images/phoenixES/charcoal_violet.jpg' },
            { src: '/images/phoenixES/charcoal_white.jpg' },
            { src: '/images/phoenixES/fgreen_black.jpg' },
            { src: '/images/phoenixES/fgreen_grey.jpg' },
            { src: '/images/phoenixES/fgreen_red.jpg' },
            { src: '/images/phoenixES/fgreen_violet.jpg' },
            { src: '/images/phoenixES/fgreen_white.jpg' },
            { src: '/images/phoenixES/lblue_black.jpg' },
            { src: '/images/phoenixES/lblue_grey.jpg' },
            { src: '/images/phoenixES/lblue_red.jpg' },
            { src: '/images/phoenixES/lblue_violet.jpg' },
            { src: '/images/phoenixES/lblue_white.jpg' },
            { src: '/images/phoenixES/sand_black.jpg' },
            { src: '/images/phoenixES/sand_grey.jpg' },
            { src: '/images/phoenixES/sand_red.jpg' },
            { src: '/images/phoenixES/sand_violet.jpg' },
            { src: '/images/phoenixES/sand_white.jpg' },
            { src: '/images/phoenixES/white_black.jpg' },
            { src: '/images/phoenixES/white_grey.jpg' },
            { src: '/images/phoenixES/white_red.jpg' },
            { src: '/images/phoenixES/white_violet.jpg' },
          ],
          variants: [{
            id: 'default',
            title: 'Starting at',
            price: '3500'
          }],
          customizable: true,
          colorMappings: [
            {
              shirtColor: 'black',
              logoColor: 'grey',
              printifyProductId: '681449c6b03bb3ed0c01a685',
              size: 'S',
              variantId: 1,
              price: 3500,
              stock_status: 'in_stock',
              images: ['/images/phoenixES/black_grey.jpg', '/images/phoenixES/black_grey1.jpg']
            },
            // Add more mappings as needed
          ]
        };

        // Build colorMappings for Eternal Elegance
        const eeColorMappings: any[] = [];
        const eternalEleganceProducts = data.filter(
          (product: Product) =>
            product.title && product.title.toLowerCase().includes('eternal elegance')
        );
        eternalEleganceProducts.forEach((product: Product) => {
          const productId = product.id;
          const logoColor = getLogoColorFromProductId(productId);
          const variantMap = eternalEleganceVariants[productId] as Record<string, any>;
          if (!variantMap) return;
          Object.entries(variantMap).forEach(([shirtColor, sizes]) => {
            Object.entries(sizes as Record<string, any>).forEach(([size, variantData]) => {
              eeColorMappings.push({
                shirtColor,
                logoColor,
                size,
                variantId: variantData.variant_id,
                price: variantData.price,
                stock_status: variantData.stock_status,
                printifyProductId: productId,
              });
            });
          });
        });

        // Build colorMappings for Eternal Slash
        const esColorMappings: any[] = [];
        const eternalSlashProducts = data.filter(
          (product: Product) =>
            product.title && product.title.toLowerCase().includes('eternal slash')
        );
        eternalSlashProducts.forEach((product: Product) => {
          const productId = product.id;
          const logoColor = getLogoColorFromProductId(productId, 'es');
          const variantMap = eternalSlashVariants[productId] as Record<string, any>;
          if (!variantMap) return;
          Object.entries(variantMap).forEach(([shirtColor, sizes]) => {
            Object.entries(sizes as Record<string, any>).forEach(([size, variantData]) => {
              esColorMappings.push({
                shirtColor,
                logoColor,
                size,
                variantId: variantData.variant_id,
                price: variantData.price,
                stock_status: variantData.stock_status,
                printifyProductId: productId,
              });
            });
          });
        });

        const combinedEternalSlashProduct: Product = {
          id: 'eternal-divide',
          title: 'Eternal Divide',
          images: [
            // Purple (Violet) combinations
            { src: '/images/eternal_slash/purple_black.jpg' },
            { src: '/images/eternal_slash/purple_charcoal.jpg' },
            { src: '/images/eternal_slash/purple_forest_green.jpg' },
            { src: '/images/eternal_slash/purple_light_blue.jpg' },
            { src: '/images/eternal_slash/purple_sand.jpg' },
            { src: '/images/eternal_slash/purple_white.jpg' },
            // Midnight Indigo combinations
            { src: '/images/eternal_slash/midnight_indigo_black.jpg' },
            { src: '/images/eternal_slash/midnight_indigo_charcoal.jpg' },
            { src: '/images/eternal_slash/midnight_indigo_light_blue.jpg' },
            { src: '/images/eternal_slash/midnight_indigo_sage.jpg' },
            { src: '/images/eternal_slash/midnight_indigo_sand.jpg' },
            { src: '/images/eternal_slash/midnight_indigo_stone_blue.jpg' },
            { src: '/images/eternal_slash/midnight_indigo_white.jpg' },
            // Red combinations
            { src: '/images/eternal_slash/red_black.jpg' },
            { src: '/images/eternal_slash/red_charcoal.jpg' },
            { src: '/images/eternal_slash/red_dark_chocolate.jpg' },
            { src: '/images/eternal_slash/red_forest_green.jpg' },
            { src: '/images/eternal_slash/red_light_blue.jpg' },
            { src: '/images/eternal_slash/red_navy.jpg' },
            { src: '/images/eternal_slash/red_sage.jpg' },
            { src: '/images/eternal_slash/red_sand.jpg' },
            { src: '/images/eternal_slash/red_white.jpg' },
            // White combinations
            { src: '/images/eternal_slash/white_black.jpg' },
            { src: '/images/eternal_slash/white_charcoal.jpg' },
            { src: '/images/eternal_slash/white_dark_chocolate.jpg' }
          ],
          variants: [
            {
              id: 'XS',
              title: 'Extra Small',
              price: '3500'
            },
            {
              id: 'S',
              title: 'Small',
              price: '3500'
            },
            {
              id: 'M',
              title: 'Medium',
              price: '3500'
            },
            {
              id: 'L',
              title: 'Large',
              price: '3500'
            },
            {
              id: 'XL',
              title: 'Extra Large',
              price: '3500'
            },
            {
              id: '2XL',
              title: '2X Large',
              price: '3500'
            },
            {
              id: '3XL',
              title: '3X Large',
              price: '3750'
            },
            {
              id: '4XL',
              title: '4X Large',
              price: '3750'
            },
            {
              id: '5XL',
              title: '5X Large',
              price: '3750'
            }
          ],
          customizable: true,
          colorMappings: esColorMappings
        };

        const combinedEternalEleganceProduct: Product = {
          id: 'eternal-elegance-combined',
          title: 'Eternal Elegance',
          images: [
            { src: '/images/eternal_elegance/elegance_white_red.jpg' },
            { src: '/images/eternal_elegance/elegance_white_red1.jpg' }
          ],
          variants: [{
            id: 'default',
            title: 'Starting at',
            price: '3500'
          }],
          customizable: true,
          colorMappings: eeColorMappings
        };

        // Combine only the four specified products
        setProducts([
          combinedCustomizableProduct, // ES Phoenix Logo
          combinedEternalEleganceProduct, // Eternal Elegance (single listing)
          combinedEternalSlashProduct, // Eternal Slash (single listing)
          ...regularProducts // Only non-Eternal Elegance, non-customizable products
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: string) => {
    // Convert price to number and format with 2 decimal places
    const numericPrice = parseFloat(price) / 100; // Convert cents to dollars
    return numericPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={() => setSelectedProduct(null)}
          className="mb-8 text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>
        {selectedProduct.customizable ? (
          <ProductCustomizer product={selectedProduct} />
        ) : (
          <ProductViewer product={selectedProduct} />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6 p-2 md:p-4">
        {/* Eternally Woven Product Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[320px] md:max-w-[380px] mx-auto h-[400px] md:h-[460px] flex flex-col">
          <div className="cursor-pointer h-[220px] md:h-[280px] flex items-center justify-center bg-gray-50 relative group"
            onClick={() => {
              setSelectedProduct({
                id: '68268cde04479021a204cf52',
                title: 'Eternally Woven',
                images: [
                  { src: '/images/Eternally Woven/white_back.jpg' },
                  { src: '/images/Eternally Woven/white_front.jpg' }
                ],
                variants: [
                  { id: 'default', title: 'Starting at', price: '4000' }
                ]
              });
              onCustomizationModeChange(false);
              onViewModeChange(true);
            }}
          >
            {/* Main Image */}
            <img
              src="/images/Eternally Woven/white_back.jpg"
              alt="Eternally Woven"
              className="w-full h-full object-contain p-2 transition-opacity duration-300 group-hover:opacity-0"
            />
            {/* Hover Image */}
            <img
              src="/images/Eternally Woven/white_front.jpg"
              alt="Eternally Woven - Front View"
              className="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            />
            {/* Image Progress Indicator - Always 2 dots for front/back */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#9F2FFF]" />
              <div className="w-1.5 h-1.5 rounded-full border border-[#9F2FFF]" />
            </div>
          </div>
          <div className="p-2 flex flex-col flex-grow">
            <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-1 line-clamp-2 flex-grow">Eternally Woven</h3>
            <p className="text-xs md:text-sm text-gray-600 mb-2">$40.00</p>
          </div>
          <button
            className="w-full bg-gray-900 text-white py-2 px-3 rounded-none text-xs md:text-sm hover:bg-gray-800 transition-colors"
            onClick={() => {
              setSelectedProduct({
                id: '68268cde04479021a204cf52',
                title: 'Eternally Woven',
                images: [
                  { src: '/images/Eternally Woven/white_back.jpg' },
                  { src: '/images/Eternally Woven/white_front.jpg' }
                ],
                variants: [
                  { id: 'default', title: 'Starting at', price: '4000' }
                ]
              });
              onCustomizationModeChange(false);
              onViewModeChange(true);
            }}
          >
            View Options
          </button>
        </div>
        {/* Eternal Ascension Product Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[320px] md:max-w-[380px] mx-auto h-[400px] md:h-[460px] flex flex-col">
          <div className="cursor-pointer h-[220px] md:h-[280px] flex items-center justify-center bg-gray-50 relative group"
            onClick={() => {
              setSelectedProduct({
                id: '682803161b86b39978039d62',
                title: 'Eternal Ascension',
                images: [
                  { src: '/images/eternal_ascension/violet.jpg' },
                  { src: '/images/eternal_ascension/violet1.jpg' }
                ],
                variants: [
                  { id: '12125', title: 'Black M', price: '4000' },
                  { id: '12126', title: 'Black S', price: '4000' },
                  { id: '12124', title: 'Black L', price: '4000' },
                  { id: '12127', title: 'Black XL', price: '4000' },
                  { id: '12128', title: 'Black 2XL', price: '4000' },
                  { id: '12129', title: 'Black 3XL', price: '4250' },
                  { id: '24039', title: 'Black 4XL', price: '4250' },
                  { id: '24171', title: 'Black 5XL', price: '4250' },
                  { id: '11873', title: 'Charcoal M', price: '4000' },
                  { id: '11872', title: 'Charcoal L', price: '4000' },
                  { id: '11875', title: 'Charcoal XL', price: '4000' },
                  { id: '11874', title: 'Charcoal S', price: '4000' },
                  { id: '11876', title: 'Charcoal 2XL', price: '4000' },
                  { id: '11877', title: 'Charcoal 3XL', price: '4250' },
                  { id: '23955', title: 'Charcoal 4XL', price: '4250' },
                  { id: '24088', title: 'Charcoal 5XL', price: '4250' },
                  { id: '11899', title: 'Dark Chocolate XL', price: '4000' },
                  { id: '11896', title: 'Dark Chocolate L', price: '4000' },
                  { id: '11898', title: 'Dark Chocolate S', price: '4000' },
                  { id: '11897', title: 'Dark Chocolate M', price: '4000' },
                  { id: '11900', title: 'Dark Chocolate 2XL', price: '4000' },
                  { id: '11901', title: 'Dark Chocolate 3XL', price: '4250' },
                  { id: '23963', title: 'Dark Chocolate 4XL', price: '4250' },
                  { id: '24097', title: 'Dark Chocolate 5XL', price: '4250' },
                  { id: '12055', title: 'Sand XL', price: '4000' },
                  { id: '12053', title: 'Sand M', price: '4000' },
                  { id: '12052', title: 'Sand L', price: '4000' },
                  { id: '12054', title: 'Sand S', price: '4000' },
                  { id: '12056', title: 'Sand 2XL', price: '4000' },
                  { id: '12057', title: 'Sand 3XL', price: '4250' },
                  { id: '24015', title: 'Sand 4XL', price: '4250' },
                  { id: '24147', title: 'Sand 5XL', price: '4250' },
                  { id: '12095', title: 'Violet M', price: '4000' },
                  { id: '12096', title: 'Violet S', price: '4000' },
                  { id: '12094', title: 'Violet L', price: '4000' },
                  { id: '12097', title: 'Violet XL', price: '4000' },
                  { id: '12098', title: 'Violet 2XL', price: '4000' },
                  { id: '12099', title: 'Violet 3XL', price: '4250' },
                  { id: '24028', title: 'Violet 4XL', price: '4250' },
                  { id: '24161', title: 'Violet 5XL', price: '4250' }
                ],
                colorMappings: [
                  { shirtColor: 'Black', logoColor: '', size: 'M', variantId: 12125, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: 'S', variantId: 12126, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: 'L', variantId: 12124, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: 'XL', variantId: 12127, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: '2XL', variantId: 12128, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: '3XL', variantId: 12129, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: '4XL', variantId: 24039, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: '5XL', variantId: 24171, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: 'M', variantId: 11873, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: 'L', variantId: 11872, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: 'XL', variantId: 11875, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: 'S', variantId: 11874, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: '2XL', variantId: 11876, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: '3XL', variantId: 11877, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: '4XL', variantId: 23955, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: '5XL', variantId: 24088, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: 'XL', variantId: 11899, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: 'L', variantId: 11896, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: 'S', variantId: 11898, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: 'M', variantId: 11897, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: '2XL', variantId: 11900, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: '3XL', variantId: 11901, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: '4XL', variantId: 23963, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: '5XL', variantId: 24097, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: 'XL', variantId: 12055, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: 'M', variantId: 12053, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: 'L', variantId: 12052, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: 'S', variantId: 12054, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: '2XL', variantId: 12056, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: '3XL', variantId: 12057, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: '4XL', variantId: 24015, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: '5XL', variantId: 24147, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: 'M', variantId: 12095, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: 'S', variantId: 12096, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: 'L', variantId: 12094, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: 'XL', variantId: 12097, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: '2XL', variantId: 12098, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: '3XL', variantId: 12099, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: '4XL', variantId: 24028, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: '5XL', variantId: 24161, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' }
                ]
              });
              onCustomizationModeChange(false);
              onViewModeChange(true);
            }}
          >
            {/* Main Image */}
            <img
              src="/images/eternal_ascension/violet.jpg"
              alt="Eternal Ascension"
              className="w-full h-full object-contain p-2 transition-opacity duration-300 group-hover:opacity-0"
            />
            {/* Hover Image */}
            <img
              src="/images/eternal_ascension/violet1.jpg"
              alt="Eternal Ascension - Front View"
              className="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            />
            {/* Image Progress Indicator - Always 2 dots for front/back */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#9F2FFF]" />
              <div className="w-1.5 h-1.5 rounded-full border border-[#9F2FFF]" />
            </div>
          </div>
          <div className="p-2 flex flex-col flex-grow">
            <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-1 line-clamp-2 flex-grow">Eternal Ascension</h3>
            <p className="text-xs md:text-sm text-gray-600 mb-2">$40.00</p>
          </div>
          <button
            className="w-full bg-gray-900 text-white py-2 px-3 rounded-none text-xs md:text-sm hover:bg-gray-800 transition-colors"
            onClick={() => {
              setSelectedProduct({
                id: '682803161b86b39978039d62',
                title: 'Eternal Ascension',
                images: [
                  { src: '/images/eternal_ascension/violet.jpg' },
                  { src: '/images/eternal_ascension/violet1.jpg' }
                ],
                variants: [
                  { id: '12125', title: 'Black M', price: '4000' },
                  { id: '12126', title: 'Black S', price: '4000' },
                  { id: '12124', title: 'Black L', price: '4000' },
                  { id: '12127', title: 'Black XL', price: '4000' },
                  { id: '12128', title: 'Black 2XL', price: '4000' },
                  { id: '12129', title: 'Black 3XL', price: '4250' },
                  { id: '24039', title: 'Black 4XL', price: '4250' },
                  { id: '24171', title: 'Black 5XL', price: '4250' },
                  { id: '11873', title: 'Charcoal M', price: '4000' },
                  { id: '11872', title: 'Charcoal L', price: '4000' },
                  { id: '11875', title: 'Charcoal XL', price: '4000' },
                  { id: '11874', title: 'Charcoal S', price: '4000' },
                  { id: '11876', title: 'Charcoal 2XL', price: '4000' },
                  { id: '11877', title: 'Charcoal 3XL', price: '4250' },
                  { id: '23955', title: 'Charcoal 4XL', price: '4250' },
                  { id: '24088', title: 'Charcoal 5XL', price: '4250' },
                  { id: '11899', title: 'Dark Chocolate XL', price: '4000' },
                  { id: '11896', title: 'Dark Chocolate L', price: '4000' },
                  { id: '11898', title: 'Dark Chocolate S', price: '4000' },
                  { id: '11897', title: 'Dark Chocolate M', price: '4000' },
                  { id: '11900', title: 'Dark Chocolate 2XL', price: '4000' },
                  { id: '11901', title: 'Dark Chocolate 3XL', price: '4250' },
                  { id: '23963', title: 'Dark Chocolate 4XL', price: '4250' },
                  { id: '24097', title: 'Dark Chocolate 5XL', price: '4250' },
                  { id: '12055', title: 'Sand XL', price: '4000' },
                  { id: '12053', title: 'Sand M', price: '4000' },
                  { id: '12052', title: 'Sand L', price: '4000' },
                  { id: '12054', title: 'Sand S', price: '4000' },
                  { id: '12056', title: 'Sand 2XL', price: '4000' },
                  { id: '12057', title: 'Sand 3XL', price: '4250' },
                  { id: '24015', title: 'Sand 4XL', price: '4250' },
                  { id: '24147', title: 'Sand 5XL', price: '4250' },
                  { id: '12095', title: 'Violet M', price: '4000' },
                  { id: '12096', title: 'Violet S', price: '4000' },
                  { id: '12094', title: 'Violet L', price: '4000' },
                  { id: '12097', title: 'Violet XL', price: '4000' },
                  { id: '12098', title: 'Violet 2XL', price: '4000' },
                  { id: '12099', title: 'Violet 3XL', price: '4250' },
                  { id: '24028', title: 'Violet 4XL', price: '4250' },
                  { id: '24161', title: 'Violet 5XL', price: '4250' }
                ],
                colorMappings: [
                  { shirtColor: 'Black', logoColor: '', size: 'M', variantId: 12125, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: 'S', variantId: 12126, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: 'L', variantId: 12124, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: 'XL', variantId: 12127, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: '2XL', variantId: 12128, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: '3XL', variantId: 12129, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: '4XL', variantId: 24039, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Black', logoColor: '', size: '5XL', variantId: 24171, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: 'M', variantId: 11873, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: 'L', variantId: 11872, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: 'XL', variantId: 11875, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: 'S', variantId: 11874, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: '2XL', variantId: 11876, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: '3XL', variantId: 11877, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: '4XL', variantId: 23955, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Charcoal', logoColor: '', size: '5XL', variantId: 24088, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: 'XL', variantId: 11899, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: 'L', variantId: 11896, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: 'S', variantId: 11898, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: 'M', variantId: 11897, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: '2XL', variantId: 11900, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: '3XL', variantId: 11901, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: '4XL', variantId: 23963, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Dark Chocolate', logoColor: '', size: '5XL', variantId: 24097, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: 'XL', variantId: 12055, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: 'M', variantId: 12053, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: 'L', variantId: 12052, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: 'S', variantId: 12054, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: '2XL', variantId: 12056, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: '3XL', variantId: 12057, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: '4XL', variantId: 24015, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Sand', logoColor: '', size: '5XL', variantId: 24147, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: 'M', variantId: 12095, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: 'S', variantId: 12096, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: 'L', variantId: 12094, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: 'XL', variantId: 12097, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: '2XL', variantId: 12098, price: 4000, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: '3XL', variantId: 12099, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: '4XL', variantId: 24028, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' },
                  { shirtColor: 'Violet', logoColor: '', size: '5XL', variantId: 24161, price: 4250, stock_status: 'in_stock', printifyProductId: '682803161b86b39978039d62' }
                ]
              });
              onCustomizationModeChange(false);
              onViewModeChange(true);
            }}
          >
            View Options
          </button>
        </div>
        {/* Product Grid */}
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[320px] md:max-w-[380px] mx-auto h-[400px] md:h-[460px] flex flex-col">
            {product.images[0] && (
              <div 
                className="cursor-pointer h-[220px] md:h-[280px] flex items-center justify-center bg-gray-50 relative group"
                onClick={() => {
                  if (product.customizable) {
                    setSelectedProduct(product);
                    onCustomizationModeChange(true);
                    onViewModeChange(false);
                  } else {
                    setSelectedImageIndex(0);
                    setIsGalleryOpen(true);
                    setSelectedProduct({ ...product, customizable: false });
                  }
                }}
                onTouchStart={(e) => onTouchStart(e, product.id)}
                onTouchMove={onTouchMove}
                onTouchEnd={() => onTouchEnd(product.id)}
                onMouseEnter={() => {
                  setCurrentImageStates(prev => ({
                    ...prev,
                    [product.id]: 1
                  }));
                }}
                onMouseLeave={() => {
                  setCurrentImageStates(prev => ({
                    ...prev,
                    [product.id]: 0
                  }));
                }}
              >
                {/* Main Image */}
                <img
                  src={product.images[0].src}
                  alt={product.title}
                  className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${
                    currentImageStates[product.id] === 1 ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                {/* Hover Image */}
                {product.images[1] && (
                  <img
                    src={product.images[1].src}
                    alt={`${product.title} - Back View`}
                    className={`absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-300 ${
                      currentImageStates[product.id] === 1 ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
                {/* Image Progress Indicator - Always 2 dots for front/back */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    currentImageStates[product.id] === 0 ? 'bg-[#9F2FFF]' : 'border border-[#9F2FFF]'
                  }`} />
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    currentImageStates[product.id] === 1 ? 'bg-[#9F2FFF]' : 'border border-[#9F2FFF]'
                  }`} />
                </div>
                {/* Swipe Indicator for Mobile */}
                {showSwipeIndicator[product.id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 animate-pulse md:hidden">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="#9F2FFF" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <svg className="w-4 h-4" fill="none" stroke="#9F2FFF" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="p-2 flex flex-col flex-grow">
              <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-1 line-clamp-2 flex-grow">{product.title}</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-2">
                {(product.title === 'Eternal Collapse' || product.title === 'Vow of the Eternal')
                  ? '$40.00'
                  : product.title === 'Eternal Awakening'
                  ? '$45.00'
                  : formatPrice(product.variants[0]?.price || '0')}
              </p>
            </div>
            <button
              className="w-full bg-gray-900 text-white py-2 px-3 rounded-none text-xs md:text-sm hover:bg-gray-800 transition-colors"
              onClick={() => {
                setSelectedProduct(product);
                if (product.customizable) {
                  onCustomizationModeChange(true);
                  onViewModeChange(false);
                } else {
                  onViewModeChange(true);
                  onCustomizationModeChange(false);
                }
              }}
            >
              {product.customizable ? 'Customize' : 'View Options'}
            </button>
          </div>
        ))}
        {/* Eternal Cut Product Card - always appended at the end */}
        <div key="eternal-cut" className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[320px] md:max-w-[380px] mx-auto h-[400px] md:h-[460px] flex flex-col">
          <div className="cursor-pointer h-[220px] md:h-[280px] flex items-center justify-center bg-gray-50 relative group"
            onClick={() => {
              setSelectedProduct({
                id: '6828e9aa1b86b3997803cc3d',
                title: 'Eternal Cut',
                images: [
                  { src: '/images/eternal_cut/black.jpg' },
                  { src: '/images/eternal_cut/white.jpg' }
                ],
                variants: [
                  { id: '68542', title: 'Black XS', price: '3500' },
                  { id: '68544', title: 'Black S', price: '3500' },
                  { id: '68546', title: 'Black M', price: '3500' },
                  { id: '68548', title: 'Black L', price: '3500' },
                  { id: '68550', title: 'Black XL', price: '3500' },
                  { id: '68552', title: 'Black 2XL', price: '3500' },
                  { id: '107430', title: 'Black 3XL', price: '3500' },
                  { id: '106112', title: 'Coal XS', price: '3500' },
                  { id: '106113', title: 'Coal S', price: '3500' },
                  { id: '106114', title: 'Coal M', price: '3500' },
                  { id: '106115', title: 'Coal L', price: '3500' },
                  { id: '106116', title: 'Coal XL', price: '3500' },
                  { id: '106117', title: 'Coal 2XL', price: '3500' },
                  { id: '107431', title: 'Coal 3XL', price: '3500' },
                  { id: '68543', title: 'White XS', price: '3500' },
                  { id: '68545', title: 'White S', price: '3500' },
                  { id: '68547', title: 'White M', price: '3500' },
                  { id: '68549', title: 'White L', price: '3500' },
                  { id: '68551', title: 'White XL', price: '3500' },
                  { id: '68553', title: 'White 2XL', price: '3500' },
                  { id: '107437', title: 'White 3XL', price: '3500' },
                  { id: '106106', title: 'Army XS', price: '3500' },
                  { id: '106107', title: 'Army S', price: '3500' },
                  { id: '106108', title: 'Army M', price: '3500' },
                  { id: '106109', title: 'Army L', price: '3500' },
                  { id: '106110', title: 'Army XL', price: '3500' },
                  { id: '106111', title: 'Army 2XL', price: '3500' },
                  { id: '107428', title: 'Army 3XL', price: '3500' }
                ]
              });
              onCustomizationModeChange(false);
              onViewModeChange(true);
            }}
          >
            {/* Main Image */}
            <img
              src="/images/eternal_cut/black.jpg"
              alt="Eternal Cut"
              className="w-full h-full object-contain p-2 transition-opacity duration-300 group-hover:opacity-0"
            />
            {/* Hover Image */}
            <img
              src="/images/eternal_cut/white.jpg"
              alt="Eternal Cut - White"
              className="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            />
            {/* Image Progress Indicator - Always 2 dots for front/back */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#9F2FFF]" />
              <div className="w-1.5 h-1.5 rounded-full border border-[#9F2FFF]" />
            </div>
          </div>
          <div className="p-2 flex flex-col flex-grow">
            <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-1 line-clamp-2 flex-grow">Eternal Cut</h3>
            <p className="text-xs md:text-sm text-gray-600 mb-2">$35.00</p>
          </div>
          <button
            className="w-full bg-gray-900 text-white py-2 px-3 rounded-none text-xs md:text-sm hover:bg-gray-800 transition-colors"
            onClick={() => {
              setSelectedProduct({
                id: '6828e9aa1b86b3997803cc3d',
                title: 'Eternal Cut',
                images: [
                  { src: '/images/eternal_cut/black.jpg' },
                  { src: '/images/eternal_cut/white.jpg' }
                ],
                variants: [
                  { id: '68542', title: 'Black XS', price: '3500' },
                  { id: '68544', title: 'Black S', price: '3500' },
                  { id: '68546', title: 'Black M', price: '3500' },
                  { id: '68548', title: 'Black L', price: '3500' },
                  { id: '68550', title: 'Black XL', price: '3500' },
                  { id: '68552', title: 'Black 2XL', price: '3500' },
                  { id: '107430', title: 'Black 3XL', price: '3500' },
                  { id: '106112', title: 'Coal XS', price: '3500' },
                  { id: '106113', title: 'Coal S', price: '3500' },
                  { id: '106114', title: 'Coal M', price: '3500' },
                  { id: '106115', title: 'Coal L', price: '3500' },
                  { id: '106116', title: 'Coal XL', price: '3500' },
                  { id: '106117', title: 'Coal 2XL', price: '3500' },
                  { id: '107431', title: 'Coal 3XL', price: '3500' },
                  { id: '68543', title: 'White XS', price: '3500' },
                  { id: '68545', title: 'White S', price: '3500' },
                  { id: '68547', title: 'White M', price: '3500' },
                  { id: '68549', title: 'White L', price: '3500' },
                  { id: '68551', title: 'White XL', price: '3500' },
                  { id: '68553', title: 'White 2XL', price: '3500' },
                  { id: '107437', title: 'White 3XL', price: '3500' },
                  { id: '106106', title: 'Army XS', price: '3500' },
                  { id: '106107', title: 'Army S', price: '3500' },
                  { id: '106108', title: 'Army M', price: '3500' },
                  { id: '106109', title: 'Army L', price: '3500' },
                  { id: '106110', title: 'Army XL', price: '3500' },
                  { id: '106111', title: 'Army 2XL', price: '3500' },
                  { id: '107428', title: 'Army 3XL', price: '3500' }
                ]
              });
              onCustomizationModeChange(false);
              onViewModeChange(true);
            }}
          >
            View Options
          </button>
        </div>
      </div>

      {/* Full-screen Image Gallery Modal */}
      {isGalleryOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl h-full max-h-[80vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsGalleryOpen(false);
                setSelectedProduct(null);
                onCustomizationModeChange(false);
                onViewModeChange(false);
              }}
              className="absolute top-0 right-0 text-white hover:text-gray-300 p-4 z-50 touch-manipulation"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image Container */}
            <div className="relative flex-1 flex items-center justify-center">
              {/* Previous Image Button */}
              <button
                onClick={() => setSelectedImageIndex(prev => 
                  prev > 0 ? prev - 1 : (selectedProduct as Product).images.length - 1
                )}
                className="absolute left-0 text-white hover:text-gray-300 p-2 bg-black/50 rounded-r-lg z-50 touch-manipulation"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Current Image */}
              <img
                src={(selectedProduct as Product).images[selectedImageIndex].src}
                alt={`${(selectedProduct as Product).title} - Image ${selectedImageIndex + 1}`}
                className="max-h-[70vh] max-w-full object-contain"
              />

              {/* Next Image Button */}
              <button
                onClick={() => setSelectedImageIndex(prev => 
                  prev < (selectedProduct as Product).images.length - 1 ? prev + 1 : 0
                )}
                className="absolute right-0 text-white hover:text-gray-300 p-2 bg-black/50 rounded-l-lg z-50 touch-manipulation"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Image Counter and Title */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 text-center z-50">
              <div className="text-base font-semibold">{(selectedProduct as Product).title}</div>
              <div className="text-sm">
                {selectedImageIndex + 1} / {(selectedProduct as Product).images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 
