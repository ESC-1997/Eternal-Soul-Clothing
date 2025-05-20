'use client';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import EternalThreadsCarousel from './components/EternalThreadsCarousel';
import PhoenixESCarousel from './components/PhoenixESCarousel';
import EternalSlashCarousel from './components/EternalSlashCarousel';
import { CarouselSyncProvider } from './components/CarouselSyncContext';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoSource, setVideoSource] = useState('/videos/home_vid.mp4');
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <main className="min-h-screen bg-[#1B1F3B]">
      {/* Unclosable Modal */}
      <div className="fixed inset-0 z-[200] bg-[#1B1F3B] flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <Image
            src="/images/Phoenix_ES_DADBE4.png"
            alt="Phoenix Eternal Soul"
            width={200}
            height={200}
            className="mx-auto mb-8"
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#DADBE4]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            COMING SOON
          </h1>
          <p className="text-lg md:text-xl text-[#DADBE4] font-light" style={{ fontFamily: 'Lato, sans-serif' }}>
            Our collection is being crafted with care. Hang tight, the wait is almost over!
          </p>
        </div>
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
      `}</style>
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

      {/* Featured Items Section */}
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
          {/* Grid for mobile, horizontal scroll for desktop */}
          <div className="grid grid-cols-2 gap-4 md:flex md:flex-row md:overflow-x-auto md:gap-8 md:justify-center md:items-center md:mt-8 md:pb-4 md:px-4">
            {/* Service Card 1 */}
            <Link href="/shop" className="block">
              <div style={{ width: '100%', height: 'auto', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                <div style={{ width: '100%', height: '30px', background: '#9F2FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    ETERNAL LOTUS (BLACK & GREY)
                  </span>
                </div>
                <img 
                  src="/images/eternal_lotus/eternal_lotus_white_backBG.jpg" 
                  alt="Eternal Lotus White" 
                  style={{ width: '100%', height: 'auto', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
                />
                <div style={{
                  width: '100%',
                  background: '#DADBE4',
                  textAlign: 'center',
                  padding: '10px 0',
                  borderBottomLeftRadius: '16px',
                  borderBottomRightRadius: '16px',
                  fontFamily: 'Bebas Neue, sans-serif',
                  color: '#1B1F3B',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}>
                  Shop now
                </div>
              </div>
            </Link>
            {/* Service Card 2 */}
            <Link href="/shop" className="block">
              <div style={{ width: '100%', height: 'auto', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                <div style={{ width: '100%', height: '30px', background: '#9F2FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    VOW OF THE ETERNAL
                  </span>
                </div>
                <img 
                  src="/images/vow_of_the_eternal/dchocolate.jpg" 
                  alt="ES Phoenix Tee (Customizable)" 
                  style={{ width: '100%', height: 'auto', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
                />
                <div style={{
                  width: '100%',
                  background: '#DADBE4',
                  textAlign: 'center',
                  padding: '10px 0',
                  borderBottomLeftRadius: '16px',
                  borderBottomRightRadius: '16px',
                  fontFamily: 'Bebas Neue, sans-serif',
                  color: '#1B1F3B',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}>
                  Shop now
                </div>
              </div>
            </Link>
            {/* Service Card 3 */}
            <Link href="/shop" className="block">
              <div style={{ width: '100%', height: 'auto', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                <div style={{ width: '100%', height: '30px', background: '#9F2FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    ETERNAL COLLAPSE
                  </span>
                </div>
                <img 
                  src="/images/eternal_collapse/sand.jpg" 
                  alt="ETERNAL COLLAPSE" 
                  style={{ width: '100%', height: 'auto', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
                />
                <div style={{
                  width: '100%',
                  background: '#DADBE4',
                  textAlign: 'center',
                  padding: '10px 0',
                  borderBottomLeftRadius: '16px',
                  borderBottomRightRadius: '16px',
                  fontFamily: 'Bebas Neue, sans-serif',
                  color: '#1B1F3B',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}>
                  Shop now
                </div>
              </div>
            </Link>
            {/* Service Card 4 */}
            <Link href="/shop" className="block">
              <div style={{ width: '100%', height: 'auto', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                <div style={{ width: '100%', height: '30px', background: '#9F2FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    ETERNAL AWAKENING
                  </span>
                </div>
                <img 
                  src="/images/eternal_awakening/black_back.jpg" 
                  alt="ETERNAL AWAKENING" 
                  style={{ width: '100%', height: 'auto', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
                />
                <div style={{
                  width: '100%',
                  background: '#DADBE4',
                  textAlign: 'center',
                  padding: '10px 0',
                  borderBottomLeftRadius: '16px',
                  borderBottomRightRadius: '16px',
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
