'use client';
import { useEffect, useState } from 'react';
import ProductCustomizer from './ProductCustomizer';
import ProductViewer from './ProductViewer';

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
    images: string[];
  }[];
}

interface PrintifyStoreProps {
  onCustomizationModeChange: (isCustomizing: boolean) => void;
  onViewModeChange: (isViewing: boolean) => void;
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
            const shouldInclude = 
              product.id !== "681449c6b03bb3ed0c01a685" && // Remove the original Phoenix Logo
              (product.title === "Eternal Lotus (Black & Grey)" || 
               product.title === "Eternal Lotus - Purple Floral Graphic Tee ");
            
            // Debug: Log each product's title and whether it's included
            console.log(`Product: ${product.title}, Included: ${shouldInclude}`);
            return shouldInclude;
          }
        );

        // Debug: Log filtered products
        console.log('Filtered products:', filteredProducts.map((p: Product) => p.title));

        // Filter out customizable products and create a single combined product
        const customizableProducts = filteredProducts.filter((product: Product) => product.customizable);
        const regularProducts = filteredProducts.filter((product: Product) => !product.customizable);
        
        // Create a single combined customizable product
        const combinedCustomizableProduct: Product = {
          id: 'customizable-tshirt',
          title: 'ES Phoenix Logo',
          images: [
            { src: '/images/phoenixES/black_grey.jpg' }, // Default image
            { src: '/images/phoenixES/black_grey1.jpg' } // Default back view
          ],
          variants: [{
            id: 'default',
            title: 'Starting at',
            price: '3500' // $35.00 in cents
          }],
          customizable: true,
          colorMappings: [
            // Black shirt combinations
            {
              shirtColor: 'black',
              logoColor: 'grey',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('black grey'))?.id || '',
              images: [
                '/images/phoenixES/black_grey.jpg',
                '/images/phoenixES/black_grey1.jpg'
              ]
            },
            {
              shirtColor: 'black',
              logoColor: 'violet',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('black violet'))?.id || '',
              images: [
                '/images/phoenixES/black_violet.jpg',
                '/images/phoenixES/black_violet1.jpg'
              ]
            },
            {
              shirtColor: 'black',
              logoColor: 'white',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('black white'))?.id || '',
              images: [
                '/images/phoenixES/black_white.jpg',
                '/images/phoenixES/black_white1.jpg'
              ]
            },
            // Charcoal shirt combinations
            {
              shirtColor: 'charcoal',
              logoColor: 'black',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('charcoal black'))?.id || '',
              images: [
                '/images/phoenixES/charcoal_black.jpg',
                '/images/phoenixES/charcoal_black1.jpg'
              ]
            },
            {
              shirtColor: 'charcoal',
              logoColor: 'grey',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('charcoal grey'))?.id || '',
              images: [
                '/images/phoenixES/charcoal_grey.jpg',
                '/images/phoenixES/charcoal_grey1.jpg'
              ]
            },
            {
              shirtColor: 'charcoal',
              logoColor: 'red',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('charcoal red'))?.id || '',
              images: [
                '/images/phoenixES/charcoal_red.jpg',
                '/images/phoenixES/charcoal_red1.jpg'
              ]
            },
            {
              shirtColor: 'charcoal',
              logoColor: 'violet',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('charcoal violet'))?.id || '',
              images: [
                '/images/phoenixES/charcoal_violet.jpg',
                '/images/phoenixES/charcoal_violet1.jpg'
              ]
            },
            {
              shirtColor: 'charcoal',
              logoColor: 'white',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('charcoal white'))?.id || '',
              images: [
                '/images/phoenixES/charcoal_white.jpg',
                '/images/phoenixES/charcoal_white1.jpg'
              ]
            },
            // Forest Green shirt combinations
            {
              shirtColor: 'fgreen',
              logoColor: 'black',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('fgreen black'))?.id || '',
              images: [
                '/images/phoenixES/fgreen_black.jpg',
                '/images/phoenixES/fgreen_black1.jpg'
              ]
            },
            {
              shirtColor: 'fgreen',
              logoColor: 'grey',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('fgreen grey'))?.id || '',
              images: [
                '/images/phoenixES/fgreen_grey.jpg',
                '/images/phoenixES/fgreen_grey1.jpg'
              ]
            },
            {
              shirtColor: 'fgreen',
              logoColor: 'red',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('fgreen red'))?.id || '',
              images: [
                '/images/phoenixES/fgreen_red.jpg',
                '/images/phoenixES/fgreen_red1.jpg'
              ]
            },
            {
              shirtColor: 'fgreen',
              logoColor: 'violet',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('fgreen violet'))?.id || '',
              images: [
                '/images/phoenixES/fgreen_violet.jpg',
                '/images/phoenixES/fgreen_violet1.jpg'
              ]
            },
            {
              shirtColor: 'fgreen',
              logoColor: 'white',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('fgreen white'))?.id || '',
              images: [
                '/images/phoenixES/fgreen_white.jpg',
                '/images/phoenixES/fgreen_white1.jpg'
              ]
            },
            // Light Blue shirt combinations
            {
              shirtColor: 'lblue',
              logoColor: 'black',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('lblue black'))?.id || '',
              images: [
                '/images/phoenixES/lblue_black.jpg',
                '/images/phoenixES/lblue_black1.jpg'
              ]
            },
            {
              shirtColor: 'lblue',
              logoColor: 'grey',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('lblue grey'))?.id || '',
              images: [
                '/images/phoenixES/lblue_grey.jpg',
                '/images/phoenixES/lblue_grey1.jpg'
              ]
            },
            {
              shirtColor: 'lblue',
              logoColor: 'red',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('lblue red'))?.id || '',
              images: [
                '/images/phoenixES/lblue_red.jpg',
                '/images/phoenixES/lblue_red1.jpg'
              ]
            },
            {
              shirtColor: 'lblue',
              logoColor: 'violet',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('lblue violet'))?.id || '',
              images: [
                '/images/phoenixES/lblue_violet.jpg',
                '/images/phoenixES/lblue_violet1.jpg'
              ]
            },
            {
              shirtColor: 'lblue',
              logoColor: 'white',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('lblue white'))?.id || '',
              images: [
                '/images/phoenixES/lblue_white.jpg',
                '/images/phoenixES/lblue_white1.jpg'
              ]
            },
            // Sand shirt combinations
            {
              shirtColor: 'sand',
              logoColor: 'black',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('sand black'))?.id || '',
              images: [
                '/images/phoenixES/sand_black.jpg',
                '/images/phoenixES/sand_black1.jpg'
              ]
            },
            {
              shirtColor: 'sand',
              logoColor: 'grey',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('sand grey'))?.id || '',
              images: [
                '/images/phoenixES/sand_grey.jpg',
                '/images/phoenixES/sand_grey1.jpg'
              ]
            },
            {
              shirtColor: 'sand',
              logoColor: 'red',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('sand red'))?.id || '',
              images: [
                '/images/phoenixES/sand_red.jpg',
                '/images/phoenixES/sand_red1.jpg'
              ]
            },
            {
              shirtColor: 'sand',
              logoColor: 'violet',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('sand violet'))?.id || '',
              images: [
                '/images/phoenixES/sand_violet.jpg',
                '/images/phoenixES/sand_violet1.jpg'
              ]
            },
            {
              shirtColor: 'sand',
              logoColor: 'white',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('sand white'))?.id || '',
              images: [
                '/images/phoenixES/sand_white.jpg',
                '/images/phoenixES/sand_white1.jpg'
              ]
            },
            // White shirt combinations
            {
              shirtColor: 'white',
              logoColor: 'black',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('white black'))?.id || '',
              images: [
                '/images/phoenixES/white_black.jpg',
                '/images/phoenixES/white_black1.jpg'
              ]
            },
            {
              shirtColor: 'white',
              logoColor: 'grey',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('white grey'))?.id || '',
              images: [
                '/images/phoenixES/white_grey.jpg',
                '/images/phoenixES/white_grey1.jpg'
              ]
            },
            {
              shirtColor: 'white',
              logoColor: 'red',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('white red'))?.id || '',
              images: [
                '/images/phoenixES/white_red.jpg',
                '/images/phoenixES/white_red1.jpg'
              ]
            },
            {
              shirtColor: 'white',
              logoColor: 'violet',
              printifyProductId: customizableProducts.find((p: Product) => p.title.toLowerCase().includes('white violet'))?.id || '',
              images: [
                '/images/phoenixES/white_violet.jpg',
                '/images/phoenixES/white_violet1.jpg'
              ]
            }
          ]
        };

        // Create Eternal Elegance product
        const newCombinedProduct: Product = {
          id: 'new-customizable-tshirt',
          title: 'Eternal Elegance',
          images: [
            { src: '/images/eternal_elegance/elegance_white_red.jpg' }, // Default display image
            { src: '/images/eternal_elegance/elegance_white_red1.jpg' } // Hover image
          ],
          variants: [{
            id: 'default',
            title: 'Starting at',
            price: '3500' // $35.00 in cents - will be updated
          }],
          customizable: true,
          colorMappings: [
            // Will be populated with the provided details
            {
              shirtColor: '', // To be provided
              logoColor: '', // To be provided
              printifyProductId: '6814c6d00ed813d9e5087aea',
              images: [] // To be provided
            },
            {
              shirtColor: '', // To be provided
              logoColor: '', // To be provided
              printifyProductId: '68163317960c7decc0099499',
              images: [] // To be provided
            },
            {
              shirtColor: '', // To be provided
              logoColor: '', // To be provided
              printifyProductId: '6816351f960c7decc0099524',
              images: [] // To be provided
            },
            {
              shirtColor: '', // To be provided
              logoColor: '', // To be provided
              printifyProductId: '681637d444c4abfbc303ec25',
              images: [] // To be provided
            },
            {
              shirtColor: '', // To be provided
              logoColor: '', // To be provided
              printifyProductId: '6816397864bdd1b0c608ecf7',
              images: [] // To be provided
            },
            {
              shirtColor: '', // To be provided
              logoColor: '', // To be provided
              printifyProductId: '68163f2a42fcdb2640010975',
              images: [] // To be provided
            }
          ]
        };

        // Combine only the four specified products
        setProducts([
          combinedCustomizableProduct, // ES Phoenix Logo
          newCombinedProduct, // Eternal Elegance
          ...regularProducts // Eternal Lotus (Black & Grey) and Eternal Lotus - Purple Floral Graphic Tee
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
              <p className="text-xs md:text-sm text-gray-600 mb-2">{formatPrice(product.variants[0]?.price || '0')}</p>
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
