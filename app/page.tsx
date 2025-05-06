'use client';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
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
        {/* Responsive MP4 Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
        >
          <source src="/videos/Website_video.mp4" type="video/mp4" />
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
                src="/images/phoenixES/sand_red1.jpg" 
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
                src="/images/eternal_lotus/eternal_lotus_lblue_backP.jpg" 
                alt="ETERNAL LOTUS - PURPLE GRAPHIC TEE" 
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

      {/* About Section */}
      <section className="relative w-full py-16 bg-[#1B1F3B]">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-7xl font-bold mb-8 tracking-wider text-center" style={{ 
            color: '#DADBE4',
            textShadow: '0 0 15px rgba(218, 219, 228, 0.5)'
          }}>ABOUT THE BRAND</h1>
          <div className="relative w-full">
            <div className={`flex items-center justify-center p-4 md:p-8 ${inter.className}`}>
              <p className="text-center max-w-2xl text-base md:text-[1.75rem] leading-relaxed md:leading-[2.5] font-semibold" style={{ 
                color: '#DADBE4',
                textShadow: '0 0 15px rgba(159, 47, 255, 0.5)',
                fontWeight: '1000'
              }}>
                Eternal Soul Clothing is more than just a fashion label—it's a tribute to the enduring energy within each of us. Rooted in the belief that the soul is eternal and ever-transforming, our brand stands as a reminder that even in moments of darkness, there is light that never fades. Every design is crafted to reflect themes of personal growth, healing, and the invisible strength that carries us forward. Eternal Soul is for those who feel deeply, think boldly, and believe that identity is not fixed—but a continuous journey of becoming. Through quality pieces and meaningful art, we aim to spark connection, conversation, and self-expression in the most authentic form.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 
