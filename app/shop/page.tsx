'use client';
import PrintifyStore from '../components/PrintifyStore';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import ShopNavigation from '../components/ShopNavigation';
import { useCart } from '../context/CartContext';
import { eternalEleganceVariants } from '../components/eternalEleganceVariants';
import { productVariants } from '../components/productVariants';
import ProductCustomizer from '../components/ProductCustomizer';

// Type definitions
type ProductId = '68163f2a42fcdb2640010975' | '6816397864bdd1b0c608ecf7' | '681637d444c4abfbc303ec25' | '6816351f960c7decc0099524' | '68163317960c7decc0099499' | '6814c6d00ed813d9e5087aea';

type ColorName = 'Black' | 'Charcoal' | 'Forest Green' | 'Light Blue' | 'Sand' | 'White';

type ColorVariants = Record<string, { variant_id: number; price: number; stock_status: string }>;

type ProductVariants = Partial<Record<ColorName, ColorVariants>>;

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

interface Product {
  id: string;
  title: string;
  images: { src: string }[];
  variants: { id: string; title: string; price: string }[];
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

interface VariantInfo {
  variant_id: number;
  price: number;
  stock_status: string;
}

// Constants
const ELEGANCE_LOGO_COLOR_TO_PRODUCT_ID: Record<string, ProductId> = {
  'red': '68163f2a42fcdb2640010975',
  'blue': '6816397864bdd1b0c608ecf7',
  'white': '681637d444c4abfbc303ec25',
  'violet': '6816351f960c7decc0099524',
  'grey': '68163317960c7decc0099499',
  'black': '6814c6d00ed813d9e5087aea'
};

const SHIRT_COLOR_CODE_TO_NAME: Record<string, ColorName> = {
  'black': 'Black',
  'charcoal': 'Charcoal',
  'fgreen': 'Forest Green',
  'lblue': 'Light Blue',
  'sand': 'Sand',
  'white': 'White'
};

const PHOENIX_LOGO_COLOR_TO_PRODUCT_ID: Record<string, string> = {
  'violet': '6814491964bdd1b0c60875d0',
  'red': '681446b7b03bb3ed0c01a5c7',
  'white': '6814469c5057e72cc20d67c7',
  'grey': '681445f7b03bb3ed0c01a591',
  'black': '681449c6b03bb3ed0c01a685',
  'midnight_indigo': '681449c6b03bb3ed0c01a685'
};

const PHOENIX_SHIRT_COLOR_CODE_TO_NAME: Record<string, string> = {
  'white': 'White',
  'sand': 'Sand',
  'lblue': 'Light Blue',
  'black': 'Black',
  'charcoal': 'Charcoal',
  'fgreen': 'Forest Green'
};

export default function Shop() {
  const { addItem, setIsCartOpen } = useCart();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoSource, setVideoSource] = useState('/videos/Website_video.mp4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayedImage, setDisplayedImage] = useState('/videos/q_mark.mp4');
  const [nextImage, setNextImage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedProductInfo, setSelectedProductInfo] = useState<{
    productId: string;
    shirtColor: string;
    logoColor: string;
  } | null>(null);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Array of all possible images
  const allImages = [
    // Eternal Elegance images
    '/images/eternal_elegance/elegance_white_grey.jpg',
    '/images/eternal_elegance/elegance_charcoal_red.jpg',
    '/images/eternal_elegance/elegance_lblue_red.jpg',
    '/images/eternal_elegance/elegance_fgreen_red.jpg',
    '/images/eternal_elegance/elegance_sand_red.jpg',
    '/images/eternal_elegance/elegance_black_red.jpg',
    '/images/eternal_elegance/elegance_white_red.jpg',
    '/images/eternal_elegance/elegance_charcoal_blue.jpg',
    '/images/eternal_elegance/elegance_lblue_blue.jpg',
    '/images/eternal_elegance/elegance_fgreen_blue.jpg',
    '/images/eternal_elegance/elegance_sand_blue.jpg',
    '/images/eternal_elegance/elegance_black_blue.jpg',
    '/images/eternal_elegance/elegance_white_blue.jpg',
    // Phoenix ES images
    '/images/phoenixES/white_violet.jpg',
    '/images/phoenixES/white_red.jpg',
    '/images/phoenixES/white_grey.jpg',
    '/images/phoenixES/white_black.jpg',
    '/images/phoenixES/sand_white.jpg',
    '/images/phoenixES/sand_violet.jpg',
    '/images/phoenixES/sand_red.jpg',
    '/images/phoenixES/sand_grey.jpg',
    '/images/phoenixES/sand_black.jpg',
    '/images/phoenixES/lblue_white.jpg',
    '/images/phoenixES/lblue_violet.jpg',
    '/images/phoenixES/lblue_red.jpg',
    '/images/phoenixES/lblue_grey.jpg',
    '/images/phoenixES/lblue_black.jpg',
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowModal(true);
    let count = 0;
    const interval = 100;
    const maxImages = 10;

    const cycleImages = () => {
      if (count >= maxImages) {
        setIsGenerating(false);
        return;
      }

      const newImage = allImages[Math.floor(Math.random() * allImages.length)];
      
      // Update available sizes based on the selected image
      if (newImage.includes('/eternal_elegance/')) {
        const parts = newImage.split('/').pop()?.split('_') || [];
        if (parts.length >= 2) {
          const shirtColor = parts[0];
          const logoColor = parts[1].replace('.jpg', '');
          const productId = ELEGANCE_LOGO_COLOR_TO_PRODUCT_ID[logoColor];
          
          if (productId) {
            setSelectedProductInfo({
              productId,
              shirtColor,
              logoColor
            });

            // Update available sizes based on stock status
            const colorName = SHIRT_COLOR_CODE_TO_NAME[shirtColor] || shirtColor;
            const productVariants = eternalEleganceVariants[productId] as Record<ColorName, Record<string, VariantInfo>>;
            if (productVariants && colorName in productVariants) {
              const colorVariants = productVariants[colorName];
              const inStockSizes = Object.entries(colorVariants)
                .filter(([_, variant]) => variant.stock_status === 'In Stock')
                .map(([size]) => size);
              setAvailableSizes(inStockSizes);
              setSelectedSize(''); // Reset selected size when generating new image
            }
          }
        }
      } else if (newImage.includes('/phoenixES/')) {
        const parts = newImage.split('/').pop()?.split('_') || [];
        if (parts.length >= 2) {
          const shirtColor = parts[0];
          const logoColor = parts[1].replace('.jpg', '');
          const productId = PHOENIX_LOGO_COLOR_TO_PRODUCT_ID[logoColor];
          
          if (productId) {
            setSelectedProductInfo({
              productId,
              shirtColor,
              logoColor
            });

            // Update available sizes based on stock status
            const colorName = PHOENIX_SHIRT_COLOR_CODE_TO_NAME[shirtColor] || shirtColor;
            const phoenixVariants = productVariants[productId];
            const colorVariants = phoenixVariants?.[colorName] || {};
            const inStockSizes = Object.entries(colorVariants)
              .filter(([_, variant]) => variant.stock_status === 'In Stock')
              .map(([size]) => size);
            setAvailableSizes(inStockSizes);
            setSelectedSize(''); // Reset selected size when generating new image
          }
        }
      }
      
      // Update both states in sequence
      setNextImage(newImage);
      setIsTransitioning(true);

      // After a short delay, update the main image
      setTimeout(() => {
        setDisplayedImage(newImage);
        setIsTransitioning(false);
      }, 100);

      count++;
      setTimeout(cycleImages, interval);
    };

    cycleImages();
  };

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      if (mobileRegex.test(userAgent)) {
        setVideoSource('/videos/Website_video.webm');
      }
    };
    checkMobile();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoLoading(false);
      video.play().catch(error => {
        console.error('Error playing video:', error);
      });
    };

    video.addEventListener('canplay', handleCanPlay);
    video.load();
    video.muted = true;
    video.play().catch((err) => {
      console.log('Autoplay error:', err);
    });

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [videoSource]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.7;
    }
  }, []);

  const handleAddToCart = () => {
    if (!selectedProductInfo || !selectedSize) return;

    const { productId, shirtColor, logoColor } = selectedProductInfo;
    const isPhoenixES = displayedImage.includes('/phoenixES/');
    const colorName = isPhoenixES 
      ? PHOENIX_SHIRT_COLOR_CODE_TO_NAME[shirtColor] || shirtColor
      : SHIRT_COLOR_CODE_TO_NAME[shirtColor] || shirtColor;
    
    let variant: VariantInfo | undefined;
    if (isPhoenixES) {
      const phoenixVariants = productVariants[productId];
      variant = phoenixVariants?.[colorName]?.[selectedSize];
    } else {
      const productVariants = eternalEleganceVariants[productId as ProductId];
      if (productVariants && colorName in productVariants) {
        const colorVariants = productVariants[colorName as keyof typeof productVariants];
        if (colorVariants && selectedSize in colorVariants) {
          variant = colorVariants[selectedSize as keyof typeof colorVariants];
        }
      }
    }

    if (variant) {
      addItem({
        id: productId,
        variantId: variant.variant_id,
        name: isPhoenixES ? 'Phoenix ES' : 'Eternal Elegance',
        color: shirtColor,
        logo: logoColor,
        size: selectedSize,
        price: variant.price / 100, // Convert from cents to dollars
        quantity: 1,
        image: displayedImage
      });
      setIsCartOpen(true);
      setShowModal(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#DADBE4]">
      <div className="max-w-7xl mx-auto relative">
        {!isCustomizing && !isViewing && (
          <>
            <ShopNavigation />
            {/* Video Section with padding */}
            <div className="relative w-full h-[400px] overflow-hidden flex items-center justify-center mt-16">
              {isVideoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1B1F3B]">
                  <img 
                    src="/images/Phoenix_ES_1B1F3B.png"
                    alt="Loading..." 
                    width={60}
                    height={60}
                    className="animate-pulse"
                  />
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/images/Phoenix_ES_1B1F3B.png"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center 30%' }}
              >
                <source 
                  src={videoSource} 
                  type={videoSource.endsWith('.webm') ? 'video/webm' : 'video/mp4'} 
                />
              </video>
            </div>
            {/* Customizable Collection Section */}
            <div id="customizable-collection" style={{
              width: '100%',
              background: '#2C2F36',
              height: '1200px',
              marginTop: 0,
              paddingTop: '40px',
              paddingBottom: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <h2 style={{
                color: '#DADBE4',
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '3rem',
                textAlign: 'center',
                marginBottom: '20px',
                letterSpacing: '0.1em',
                fontWeight: 'bold',
              }}>
                CUSTOMIZABLE COLLECTION!
              </h2>
              <div style={{
                color: '#DADBE4',
                textAlign: 'center',
                maxWidth: '800px',
                margin: '0 auto 40px',
                fontSize: '1.25rem',
                lineHeight: '1.6',
                fontFamily: 'Lato, sans-serif'
              }}>
                <p style={{ marginBottom: '20px' }}>
                </p>
                <p style={{ 
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '1.5rem',
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  This collection allows you to customize the logo color, pick your favorite shirt tone, and make any of these 3 pieces truly your own.
                </p>
              </div>
              <PrintifyStore 
                onCustomizationModeChange={setIsCustomizing} 
                onViewModeChange={setIsViewing}
                onProductSelect={setSelectedProduct}
              />
              <div className="flex justify-between items-center max-w-[1000px] mx-auto px-5 flex-col md:flex-row gap-10 md:gap-0">
                <div className="flex flex-col gap-5 max-w-[500px] w-full md:w-auto items-center md:items-start text-center md:text-left">
                  <h3 className="font-['Bebas_Neue'] text-[3.5rem] text-[#DADBE4] m-0">
                    Can't decide? Let the universe pick.
                  </h3>
                  <p className="font-['Lato'] text-2xl text-[#DADBE4] m-0 leading-relaxed">
                    Tap to discover 1 of 102 Eternal Threads design combos.
                  </p>
                  <button 
                    onClick={handleGenerate}
                    className="bg-[#9F2FFF] text-[#DADBE4] border-none py-4 px-12 text-3xl font-['Bebas_Neue'] tracking-wider cursor-pointer w-fit mt-5 transition-all duration-300 hover:bg-[#8A29E6]">
                    {isGenerating ? 'GENERATING...' : 'GENERATE'}
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-[500px] h-[500px] border-4 border-white overflow-hidden ml-auto mr-0">
                    <video
                      src="/videos/q_mark.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {isCustomizing && selectedProduct && (
          <div className="max-w-7xl mx-auto p-8">
            <button
              onClick={() => {
                setIsCustomizing(false);
                setIsViewing(false);
                setSelectedProduct(null);
              }}
              className="mb-8 text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Products
            </button>
            <ProductCustomizer product={selectedProduct} />
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-['Bebas_Neue'] text-[#1B1F3B]">Your Generated Design</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-2"
              >
                ✕
              </button>
            </div>
            
            <div className="relative w-full aspect-square mb-6">
              <Image
                src={displayedImage}
                alt="Selected design"
                fill
                className={`object-contain transition-opacity duration-300 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              />
              {nextImage && (
                <Image
                  src={nextImage}
                  alt="Next design"
                  fill
                  className={`object-contain rounded-lg transition-opacity duration-300 ${
                    isTransitioning ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-['Bebas_Neue'] text-[#1B1F3B] mb-2">Select Size</h4>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-1.5 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? 'border-[#9F2FFF] bg-[#9F2FFF] text-white'
                          : 'border-gray-300 hover:border-[#9F2FFF] text-[#1B1F3B]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {availableSizes.length === 0 && (
                  <p className="text-red-500 mt-2">No sizes available for this combination</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedProductInfo}
                  className={`flex-1 py-2 px-4 rounded-lg text-white font-['Bebas_Neue'] text-lg tracking-wider transition-all ${
                    selectedSize && selectedProductInfo
                      ? 'bg-[#9F2FFF] hover:bg-[#8A29E6]'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 py-2 px-4 rounded-lg border-2 border-[#9F2FFF] text-[#9F2FFF] font-['Bebas_Neue'] text-lg tracking-wider hover:bg-[#9F2FFF] hover:text-white transition-all"
                >
                  {isGenerating ? 'GENERATING...' : 'Generate Another'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 
