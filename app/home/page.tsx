'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <div className="min-h-screen flex">
      {/* Left Navigation Menu */}
      <div className={`fixed left-0 top-0 h-screen bg-black/50 backdrop-blur-sm transition-all duration-300 ${isMenuOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full p-4">
          {/* Minimize Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-1 hover:bg-white/10 rounded-lg transition-colors mb-4 self-end"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>

          {/* Logo */}
          <div className={`mb-8 ${isMenuOpen ? 'flex items-center justify-center' : ''}`}>
            <Link href="/" className="block">
              <Image
                src="/images/logo.png"
                alt="Eternal Soul Logo"
                width={isMenuOpen ? 120 : 40}
                height={isMenuOpen ? 40 : 40}
                className="invert transform hover:invert-0 transition-all duration-300"
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-6 mt-4">
            <Link 
              href="/#about"
              className="flex items-center gap-3 text-white p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Image
                src="/images/Glasses.png"
                alt="About"
                width={24}
                height={24}
                className="invert brightness-0"
              />
              {isMenuOpen && <span>About</span>}
            </Link>

            <Link 
              href="/#contact"
              className="flex items-center gap-3 text-white p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Image
                src="/images/Email.png"
                alt="Contact"
                width={24}
                height={24}
                className="invert brightness-0"
              />
              {isMenuOpen && <span>Contact Us</span>}
            </Link>

            <button 
              className="flex items-center gap-3 text-white p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Image
                src="/images/T_Shirt.png"
                alt="Collections"
                width={24}
                height={24}
                className="invert brightness-0"
              />
              {isMenuOpen && <span>Collections</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isMenuOpen ? 'ml-64' : 'ml-20'}`}>
        <section className="min-h-screen flex flex-col justify-center items-center relative pt-16 overflow-hidden">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full"
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            >
              <source src="/background_official.mp4" type="video/mp4" />
              <p>Your browser does not support the video tag.</p>
            </video>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#6B21A8]/50 from-40% via-70% to-[#6B21A8]"></div>

          <div className="relative z-20 max-w-6xl mx-auto p-6 h-screen flex items-center justify-center">
            <div className="text-center -mt-32">
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
        </section>
      </div>
    </div>
  );
} 