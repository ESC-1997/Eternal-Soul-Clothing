'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Collections() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoSource, setVideoSource] = useState('/videos/Website_video.mp4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayedImage, setDisplayedImage] = useState('/images/question.png');
  const [nextImage, setNextImage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    // Eternal Slash images
    '/images/eternal_slash/collection/white_sage 1.png',
    '/images/eternal_slash/collection/white_navy 1.png',
    '/images/eternal_slash/collection/white_dchocolate 1.png',
    '/images/eternal_slash/collection/white_black 1.png',
    '/images/eternal_slash/collection/red_sand 1.png',
    '/images/eternal_slash/collection/red_navy 1.png',
    '/images/eternal_slash/collection/red_dchocolate 1.png',
    '/images/eternal_slash/collection/red_black 1.png',
    '/images/eternal_slash/collection/purple_lblue 1.png',
    '/images/eternal_slash/collection/purple_black 1.png',
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setImageError(false);
    let count = 0;
    const maxCycles = 15;
    const interval = 150; // Slightly slower for smoother transition

    const cycleImages = () => {
      if (count >= maxCycles) {
        setIsGenerating(false);
        setIsTransitioning(false);
        return;
      }

      // Get random image
      const randomIndex = Math.floor(Math.random() * allImages.length);
      setNextImage(allImages[randomIndex]);
      setIsTransitioning(true);

      // After a short delay, update the main image
      setTimeout(() => {
        setDisplayedImage(nextImage);
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

  return (
    <main className="relative w-full min-h-screen p-0 m-0" style={{ background: '#DADBE4' }}>
      {/* Top Banner */}
      <div className="w-full h-[100px] flex items-center justify-center" style={{ background: '#1b1f3b' }}>
        <h1 className="text-white text-4xl font-bold tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>ETERNAL SOUL COLLECTIONS</h1>
      </div>
      {/* Video Section with padding */}
      <div className="relative w-full h-[400px] overflow-hidden flex items-center justify-center" style={{ paddingTop: '20px' }}>
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
      <div style={{
        width: '100%',
        background: '#64748B',
        height: '800px',
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
            color: '#1B1F3B',
            margin: 0,
            lineHeight: '1.5'
          }}>
            This collection allows you to customize the logo color, pick your favorite shirt tone, and make any of these 3 pieces truly your own.
          </p>
        </div>
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
              className="bg-[#9F2FFF] text-[#DADBE4] border-none py-4 px-12 rounded-lg text-3xl font-['Bebas_Neue'] tracking-wider cursor-pointer w-fit mt-5 transition-all duration-300 hover:bg-[#8A29E6]">
              {isGenerating ? 'GENERATING...' : 'GENERATE'}
            </button>
          </div>
          <div className="w-full md:w-[400px] h-[400px] md:h-[500px] bg-white rounded-2xl shadow-lg relative overflow-hidden max-w-[400px]">
            <Image
              src={displayedImage}
              alt="Generated design"
              fill
              sizes="(max-width: 400px) 100vw, 400px"
              style={{ 
                objectFit: 'cover',
                opacity: isTransitioning ? 0 : 1,
                transition: 'opacity 0.15s ease-in-out',
                position: 'absolute',
                top: 0,
                left: 0
              }}
              priority
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                console.error('Error loading image:', displayedImage);
                setImageError(true);
              }}
            />
            {nextImage && (
              <Image
                src={nextImage}
                alt="Next design"
                fill
                sizes="(max-width: 400px) 100vw, 400px"
                style={{ 
                  objectFit: 'cover',
                  opacity: isTransitioning ? 1 : 0,
                  transition: 'opacity 0.15s ease-in-out',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
                priority
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  console.error('Error loading image:', nextImage);
                  setImageError(true);
                }}
              />
            )}
            {imageError && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#1B1F3B',
                textAlign: 'center',
                fontFamily: 'Lato, sans-serif',
                zIndex: 2
              }}>
                Image not found
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 
