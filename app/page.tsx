'use client';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoSource, setVideoSource] = useState('/videos/Website_video.mp4');

  useEffect(() => {
    // Check if device is mobile
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

    // Ensure muted and try to play programmatically for mobile autoplay
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
    <main className="flex min-h-screen flex-col">
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
      {/* Banner Section */}
      <div style={{ width: '100%', background: '#DADBE4', height: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '10px' }}>
        <img 
          src="/images/Phoenix_ES_1B1F3B.png" 
          alt="Phoenix Logo" 
          width={60}
          height={60}
          style={{ objectFit: 'contain' }}
        />
        <span style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#1B1F3B', fontSize: '2rem', letterSpacing: '0.1em', marginTop: '8px', display: 'block' }}>
          ETERNAL SOUL CLOTHING
        </span>
      </div>
      {/* Top Section */}
      <div className="relative w-full h-[400px] overflow-hidden flex items-center justify-center">
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

      {/* New Section Below Video */}
      <div style={{ width: '100%', background: '#DADBE4', height: '520px' }}>
        <h2 style={{
          color: '#1B1F3B',
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '2.5rem',
          textAlign: 'center',
          marginTop: '25px',
          marginBottom: '25px',
          letterSpacing: '0.1em',
          fontWeight: 'bold',
        }}>
          FEATURED ITEMS
        </h2>
        {/* Horizontally Scrollable Service Cards */}
        <div className="service-cards-container">
          {/* Service Card 1 */}
          <Link href="/shop" style={{ textDecoration: 'none', scrollSnapAlign: 'center' }}>
            <div style={{ width: '230px', height: '320px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              <div style={{ width: '100%', height: '30px', background: '#1B1F3B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                style={{ width: '100%', height: '240px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
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
          <Link href="/shop" style={{ textDecoration: 'none', scrollSnapAlign: 'center' }}>
            <div style={{ width: '230px', height: '320px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              <div style={{ width: '100%', height: '30px', background: '#1B1F3B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  ES Phoenix Tee (Customizable) 
                </span>
              </div>
              <img 
                src="/images/vow_of_the_eternal/dchocolate.jpg" 
                alt="ES Phoenix Tee (Customizable)" 
                style={{ width: '100%', height: '240px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
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
          <Link href="/shop" style={{ textDecoration: 'none', scrollSnapAlign: 'center' }}>
            <div style={{ width: '230px', height: '320px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              <div style={{ width: '100%', height: '30px', background: '#1B1F3B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{
                  fontFamily: 'Lato, sans-serif',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: '#DADBE4',
                  fontSize: '0.62rem',
                  letterSpacing: '0.03em',
                  textAlign: 'center',
                  width: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  ETERNAL LOTUS - PURPLE GRAPHIC TEE
                </span>
              </div>
              <img 
                src="/images/eternal_collapse/sand.jpg" 
                alt="ETERNAL COLLAPSE" 
                style={{ width: '100%', height: '240px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
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
          <Link href="/shop" style={{ textDecoration: 'none', scrollSnapAlign: 'center' }}>
            <div style={{ width: '230px', height: '320px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.20)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              <div style={{ width: '100%', height: '30px', background: '#1B1F3B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  ETERNAL ELEGANCE (CUSTOMIZABLE)
                </span>
              </div>
              <img 
                src="/images/eternal_elegance/elegance_charcoal_white1.jpg" 
                alt="ETERNAL ELEGANCE (CUSTOMIZABLE)" 
                style={{ width: '100%', height: '240px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
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
    </main>
  );
} 