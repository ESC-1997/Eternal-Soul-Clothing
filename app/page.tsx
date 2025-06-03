'use client';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import EternalThreadsCarousel from './components/EternalThreadsCarousel';
import PhoenixESCarousel from './components/PhoenixESCarousel';
import EternalSlashCarousel from './components/EternalSlashCarousel';
import { CarouselSyncProvider } from './components/CarouselSyncContext';
import { useCart } from '@/app/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoSource, setVideoSource] = useState('/videos/home_vid.mp4');
  const [isMobile, setIsMobile] = useState(false);
  const [productImages, setProductImages] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent) && window.innerWidth <= 768;
      console.log('Is Mobile:', isMobileDevice);
      console.log('Window Width:', window.innerWidth);
      console.log('User Agent:', userAgent);
      
      setIsMobile(isMobileDevice);
      setVideoSource(isMobileDevice ? '/videos/mobile_home.mp4' : '/videos/home_vid.mp4');
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoLoading(false);
      // Ensure video is muted for autoplay
      video.muted = true;
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing video:', error);
        });
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [videoSource]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // video.playbackRate = 0.7; // Removed to play at full speed
    }
  }, []);

  useEffect(() => {
    // Fetch product images from Printify API
    const fetchProductImages = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching product images...');
        const response = await fetch('/api/printify/products');
        const products = await response.json();
        console.log('API Response:', products);
        
        // Find specific products and their images
        const images: {[key: string]: string} = {};
        products.forEach((product: any) => {
          console.log('Checking product:', product.title);
          if (product.title === "Eternal Shadow") {
            images.eternalShadow = product.images[0]?.src || '';
            console.log('Found Eternal Shadow image:', images.eternalShadow);
          }
          if (product.title === "Eternally Untainted") {
            images.eternallyUntainted = product.images[0]?.src || '';
            console.log('Found Eternally Untainted image:', images.eternallyUntainted);
          }
          if (product.title === "Eternal Rebirth (Mineral Wash)") {
            images.eternalRebirth = product.images[0]?.src || '';
            console.log('Found Eternal Rebirth image:', images.eternalRebirth);
          }
          if (product.title === "Eternal Glow") {
            images.eternalGlow = product.images[0]?.src || '';
            console.log('Found Eternal Glow image:', images.eternalGlow);
          }
          if (product.title === "Eternally Cozy Legacy Sweatpants") {
            images.eternallyCozy = product.images[0]?.src || '';
            console.log('Found Eternally Cozy image:', images.eternallyCozy);
          }
          if (product.title === "Eternal Ascension T-Shirt") {
            images.eternalAscension = product.images[0]?.src || '';
            console.log('Found Eternal Ascension image:', images.eternalAscension);
          }
          if (product.title === "Eternally Bold") {
            images.eternallyBold = product.images[0]?.src || '';
            console.log('Found Eternally Bold image:', images.eternallyBold);
          }
        });
        
        console.log('Final images object:', images);
        setProductImages(images);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product images:', error);
        setIsLoading(false);
      }
    };

    fetchProductImages();
  }, []);

  return (
    <main className="min-h-screen bg-[#1B1F3B]">
      {/* Top Section */}
      <div className="relative w-full flex items-center justify-center" style={{ height: '100vh' }}>
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
          key={videoSource}
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/Phoenix_ES_1B1F3B.png"
          className="w-full h-full object-cover"
        >
          <source 
            src={videoSource} 
            type="video/mp4"
          />
        </video>
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent opacity-80"></div>
      </div>

      <style jsx global>{`
        .service-cards-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 32px;
          margin-top: 48px;
          overflow-x: auto;
          width: 100%;
          padding-bottom: 8px;
          margin: 0 auto;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          touch-action: pan-x;
          padding-left: 16px;
          justify-content: flex-start;
        }
        
        @media (min-width: 768px) {
          .service-cards-container {
            justify-content: center;
            padding-left: 0;
          }
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .featured-items-scroll::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .featured-items-scroll {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      {/* Top Section */}
      <div style={{ 
        width: '100%', 
        background: '#000000',
        height: 'auto', 
        padding: '60px 0 60px 0',
        position: 'relative',
        marginTop: '-2px',
        zIndex: 1
      }}>
        {/* Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent"></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{
            color: '#DADBE4',
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '2.5rem',
            textAlign: 'center',
            marginTop: '0',
            marginBottom: '25px',
            letterSpacing: '0.1em',
            fontWeight: 'bold',
          }}>
            FEATURED ITEMS
          </h2>
          {/* Horizontal scrolling container */}
          <div className="featured-items-scroll" style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '24px',
            padding: '0 24px',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}>
            {/* Service Card 1 */}
            <div style={{ flex: '0 0 auto', width: '320px', scrollSnapAlign: 'start' }}>
              <Link href="/shop/mens/eternal-shadow" className="block">
                <div style={{ width: '100%', height: 'auto', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                  <div style={{ width: '100%', height: '35px', background: 'linear-gradient(to right, #000000, #9F2FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{
                      fontFamily: 'Lato, sans-serif',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      color: '#DADBE4',
                      fontSize: '0.65rem',
                      letterSpacing: '0.03em',
                      textAlign: 'center',
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      ETERNAL SHADOW
                    </span>
                  </div>
                  {isLoading ? (
                    <div style={{ width: '100%', height: '320px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="/images/Phoenix_ES_1B1F3B.png" 
                        alt="Loading..." 
                        width={40}
                        height={40}
                        className="animate-pulse"
                      />
                    </div>
                  ) : productImages.eternalShadow ? (
                    <Image 
                      src={productImages.eternalShadow}
                      alt="Eternal Shadow" 
                      width={320}
                      height={320}
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  ) : null}
                  <div style={{
                    width: '100%',
                    background: '#DADBE4',
                    textAlign: 'center',
                    padding: '10px 0',
                    fontFamily: 'Bebas Neue, sans-serif',
                    color: '#1B1F3B',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}>
                    Shop now
                  </div>
                </div>
              </Link>
            </div>

            {/* Service Card 2 */}
            <div style={{ flex: '0 0 auto', width: '320px', scrollSnapAlign: 'start' }}>
              <Link href="/shop/mens/eternally-untainted" className="block">
                <div style={{ width: '100%', height: 'auto', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                  <div style={{ width: '100%', height: '35px', background: 'linear-gradient(to right, #000000, #9F2FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{
                      fontFamily: 'Lato, sans-serif',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      color: '#DADBE4',
                      fontSize: '0.75rem',
                      letterSpacing: '0.03em',
                      textAlign: 'center',
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      ETERNALLY UNTAINTED
                    </span>
                  </div>
                  {isLoading ? (
                    <div style={{ width: '100%', height: '320px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="/images/Phoenix_ES_1B1F3B.png" 
                        alt="Loading..." 
                        width={40}
                        height={40}
                        className="animate-pulse"
                      />
                    </div>
                  ) : productImages.eternallyUntainted ? (
                    <Image 
                      src={productImages.eternallyUntainted}
                      alt="Eternally Untainted" 
                      width={320}
                      height={320}
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  ) : null}
                  <div style={{
                    width: '100%',
                    background: '#DADBE4',
                    textAlign: 'center',
                    padding: '10px 0',
                    fontFamily: 'Bebas Neue, sans-serif',
                    color: '#1B1F3B',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}>
                    Shop now
                  </div>
                </div>
              </Link>
            </div>

            {/* Service Card 3 */}
            <div style={{ flex: '0 0 auto', width: '320px', scrollSnapAlign: 'start' }}>
              <Link href="/shop/mens/eternal-rebirth" className="block">
                <div style={{ width: '100%', height: 'auto', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                  <div style={{ width: '100%', height: '35px', background: 'linear-gradient(to right, #000000, #9F2FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{
                      fontFamily: 'Lato, sans-serif',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      color: '#DADBE4',
                      fontSize: '0.75rem',
                      letterSpacing: '0.03em',
                      textAlign: 'center',
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      ETERNAL REBIRTH
                    </span>
                  </div>
                  {isLoading ? (
                    <div style={{ width: '100%', height: '320px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="/images/Phoenix_ES_1B1F3B.png" 
                        alt="Loading..." 
                        width={40}
                        height={40}
                        className="animate-pulse"
                      />
                    </div>
                  ) : productImages.eternalRebirth ? (
                    <Image 
                      src={productImages.eternalRebirth}
                      alt="Eternal Rebirth" 
                      width={320}
                      height={320}
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  ) : null}
                  <div style={{
                    width: '100%',
                    background: '#DADBE4',
                    textAlign: 'center',
                    padding: '10px 0',
                    fontFamily: 'Bebas Neue, sans-serif',
                    color: '#1B1F3B',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}>
                    Shop now
                  </div>
                </div>
              </Link>
            </div>

            {/* Service Card 4 */}
            <div style={{ flex: '0 0 auto', width: '320px', scrollSnapAlign: 'start' }}>
              <Link href="/shop/women/eternal-glow" className="block">
                <div style={{ width: '100%', height: 'auto', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                  <div style={{ width: '100%', height: '35px', background: 'linear-gradient(to right, #000000, #9F2FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{
                      fontFamily: 'Lato, sans-serif',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      color: '#DADBE4',
                      fontSize: '0.75rem',
                      letterSpacing: '0.03em',
                      textAlign: 'center',
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      ETERNAL GLOW
                    </span>
                  </div>
                  {isLoading ? (
                    <div style={{ width: '100%', height: '320px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="/images/Phoenix_ES_1B1F3B.png" 
                        alt="Loading..." 
                        width={40}
                        height={40}
                        className="animate-pulse"
                      />
                    </div>
                  ) : productImages.eternalGlow ? (
                    <Image 
                      src={productImages.eternalGlow}
                      alt="Eternal Glow" 
                      width={320}
                      height={320}
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  ) : null}
                  <div style={{
                    width: '100%',
                    background: '#DADBE4',
                    textAlign: 'center',
                    padding: '10px 0',
                    fontFamily: 'Bebas Neue, sans-serif',
                    color: '#1B1F3B',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}>
                    Shop now
                  </div>
                </div>
              </Link>
            </div>

            {/* Service Card 5 */}
            <div style={{ flex: '0 0 auto', width: '320px', scrollSnapAlign: 'start' }}>
              <Link href="/shop/mens/eternally-cozy-sweatpants" className="block">
                <div style={{ width: '100%', height: 'auto', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                  <div style={{ width: '100%', height: '35px', background: 'linear-gradient(to right, #000000, #9F2FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{
                      fontFamily: 'Lato, sans-serif',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      color: '#DADBE4',
                      fontSize: '0.75rem',
                      letterSpacing: '0.03em',
                      textAlign: 'center',
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      ETERNALLY COZY
                    </span>
                  </div>
                  {isLoading ? (
                    <div style={{ width: '100%', height: '320px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="/images/Phoenix_ES_1B1F3B.png" 
                        alt="Loading..." 
                        width={40}
                        height={40}
                        className="animate-pulse"
                      />
                    </div>
                  ) : productImages.eternallyCozy ? (
                    <Image 
                      src={productImages.eternallyCozy}
                      alt="Eternally Cozy Sweatpants" 
                      width={320}
                      height={320}
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  ) : null}
                  <div style={{
                    width: '100%',
                    background: '#DADBE4',
                    textAlign: 'center',
                    padding: '10px 0',
                    fontFamily: 'Bebas Neue, sans-serif',
                    color: '#1B1F3B',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}>
                    Shop now
                  </div>
                </div>
              </Link>
            </div>

            {/* Service Card 6 */}
            <div style={{ flex: '0 0 auto', width: '320px', scrollSnapAlign: 'start' }}>
              <Link href="/shop/unisex/eternal-ascension" className="block">
                <div style={{ width: '100%', height: 'auto', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                  <div style={{ width: '100%', height: '35px', background: 'linear-gradient(to right, #000000, #9F2FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{
                      fontFamily: 'Lato, sans-serif',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      color: '#DADBE4',
                      fontSize: '0.75rem',
                      letterSpacing: '0.03em',
                      textAlign: 'center',
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      ETERNAL ASCENSION
                    </span>
                  </div>
                  {isLoading ? (
                    <div style={{ width: '100%', height: '320px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="/images/Phoenix_ES_1B1F3B.png" 
                        alt="Loading..." 
                        width={40}
                        height={40}
                        className="animate-pulse"
                      />
                    </div>
                  ) : productImages.eternalAscension ? (
                    <Image 
                      src={productImages.eternalAscension}
                      alt="Eternal Ascension T-Shirt" 
                      width={320}
                      height={320}
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  ) : null}
                  <div style={{
                    width: '100%',
                    background: '#DADBE4',
                    textAlign: 'center',
                    padding: '10px 0',
                    fontFamily: 'Bebas Neue, sans-serif',
                    color: '#1B1F3B',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}>
                    Shop now
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Eternal Threads Section */}
      <div style={{ 
        width: '100%', 
        background: 'url(/images/GalaxyBG.png)',
        backgroundSize: '200% auto',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        padding: '70px 0 50px 0' 
      }}>
        <CarouselSyncProvider imageCount={15}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{
              color: '#DADBE4',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '2.5rem',
              textAlign: 'center',
              letterSpacing: '0.1em',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              ETERNAL THREADS
            </h2>
            <p style={{
              color: '#DADBE4',
              fontFamily: 'Lato, sans-serif',
              fontSize: '1.2rem',
              fontStyle: 'italic',
              textAlign: 'center',
              marginBottom: '25px'
            }}>
              a collection of customizable t-shirts
            </p>
            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-8">
              {/* Elegance (left) */}
              <div className="w-full md:flex-1 flex justify-center mb-6 md:mb-0">
                <EternalThreadsCarousel />
              </div>
              {/* PhoenixES (center) */}
              <div className="w-full md:flex-1 flex justify-center mb-6 md:mb-0">
                <PhoenixESCarousel />
              </div>
              {/* Eternal Slash (right) */}
              <div className="w-full md:flex-1 flex justify-center">
                <EternalSlashCarousel />
              </div>
            </div>
          </div>
        </CarouselSyncProvider>
      </div>
    </main>
  );
} 