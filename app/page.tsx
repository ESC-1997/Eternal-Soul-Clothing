'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Show modal after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleProfileClick = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex">
      <Navigation onProfileClick={handleProfileClick} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isMenuOpen ? 'ml-20' : 'ml-0 sm:ml-20'
      }`}>
        <div className="min-h-screen">
          {/* Hero Section */}
          <div className="h-screen relative overflow-hidden">
            <div className="absolute inset-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/background_official.mp4" type="video/mp4" />
                <p>Your browser does not support the video tag.</p>
              </video>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#6B21A8]/50 from-40% via-70% to-[#6B21A8]"></div>

            <div className="relative z-20 h-full flex items-center justify-center p-6">
              <div className="text-center">
                <Image
                  src="/Eternal Soul Elegant.png"
                  alt="Eternal Soul"
                  width={800}
                  height={400}
                  className="mx-auto w-full max-w-3xl drop-shadow-[0_0_25px_rgba(0,0,0,0.5)] [text-shadow:_0_0_25px_rgba(0,0,0,0.5)] opacity-90"
                  priority
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <section className="min-h-screen bg-[#6B21A8] relative flex items-center">
            <div className="max-w-4xl mx-auto p-4 md:p-6 py-24 relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-8 md:mb-12 text-center font-bebas tracking-wider">ABOUT THE BRAND</h2>
              <p className="text-white text-lg md:text-xl font-semibold leading-[2.5] md:leading-[2.75] text-center font-playfair">
                Eternal Soul Clothing is more than just a fashion label—it&apos;s a tribute to the enduring energy within each of us. Rooted in the belief that the soul is eternal and ever-transforming, our brand stands as a reminder that even in moments of darkness, there is light that never fades. Every design is crafted to reflect themes of personal growth, healing, and the invisible strength that carries us forward. Eternal Soul is for those who feel deeply, think boldly, and believe that identity is not fixed—but a continuous journey of becoming. Through quality pieces and meaningful art, we aim to spark connection, conversation, and self-expression in the most authentic form.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setShowModal(false)}
          ></div>
          
          <div className="relative overflow-hidden rounded-lg w-full max-w-2xl bg-transparent">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 bg-black/60"></div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12">
              <h2 className="text-4xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8 text-center font-serif [text-shadow:_0_0_15px_rgb(107_33_168_/_100%)]">
                Coming Soon
              </h2>
              <p className="text-white text-xl md:text-2xl lg:text-2xl text-center max-w-md font-sans font-bold [text-shadow:_0_0_10px_rgb(107_33_168_/_100%)]">
                We&apos;re crafting something special for you. In the meantime, feel free to explore our site and learn more about Eternal Soul Clothing.
              </p>
            </div>

            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-white hover:text-white transition-all bg-black/60 hover:bg-[#6B21A8] p-1.5 md:p-2 rounded-lg shadow-lg border-2 border-white/50 hover:border-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
