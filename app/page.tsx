'use client';
import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
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
