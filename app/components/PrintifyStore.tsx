'use client';
import { useEffect, useState } from 'react';
import ProductCustomizer from './ProductCustomizer';
import ProductViewer from './ProductViewer';
import { eternalEleganceVariants as _eternalEleganceVariants } from './eternalEleganceVariants';
const eternalEleganceVariants: Record<string, any> = _eternalEleganceVariants;

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
function getLogoColorFromProductId(productId: string): string {
  return EE_PRODUCT_ID_TO_LOGO_COLOR[productId] || '';
}

export default function PrintifyStore({ onCustomizationModeChange, onViewModeChange }: PrintifyStoreProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
                isEternalElegance
              );
            
            // Debug: Log each product's title, isEternalElegance, and whether it's included
            console.log(`Product: '${product.title}', isEternalElegance: ${isEternalElegance}, Included: ${shouldInclude}`);
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-2 lg:gap-3 p-2 md:p-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[200px] md:max-w-[240px] mx-auto h-[280px] md:h-[320px] flex flex-col">
            {product.images[0] && (
              <div 
                className="cursor-pointer h-[160px] md:h-[200px] flex items-center justify-center bg-gray-50 relative group"
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
              >
                {/* Main Image */}
                <img
                  src={product.images[0].src}
                  alt={product.title}
                  className="w-full h-full object-contain p-2 transition-opacity duration-300 group-hover:opacity-0"
                />
                {/* Hover Image */}
                {product.images[1] && (
                  <img
                    src={product.images[1].src}
                    alt={`${product.title} - Back View`}
                    className="absolute inset-0 w-full h-full object-contain p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                )}
              </div>
            )}
            <div className="p-2 flex flex-col flex-grow">
              <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-1 line-clamp-2 flex-grow">{product.title}</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-2">
                {(product.title === 'Eternal Collapse' || product.title === 'Vow of the Eternal')
                  ? '$40.00'
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
