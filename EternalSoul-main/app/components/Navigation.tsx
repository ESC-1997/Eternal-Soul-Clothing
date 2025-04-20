'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import ProfilePopup from './ProfilePopup';

interface NavigationProps {
  onProfileClick?: () => void;
}

export default function Navigation({ onProfileClick }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Set initial menu state based on screen size
    const checkMobile = () => {
      const isMobileSize = window.innerWidth < 640;
      setIsMenuOpen(!isMobileSize);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
    // Close the menu on mobile when profile is clicked
    if (window.innerWidth < 640) {
      setIsMenuOpen(false);
    }
    onProfileClick?.();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-[100] p-2 rounded-lg bg-black/50 backdrop-blur-sm sm:hidden"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
        <div className="w-6 h-0.5 bg-white"></div>
      </button>

      {/* Left Navigation Menu */}
      <div 
        className={`fixed left-0 top-0 h-screen w-20 bg-black/50 backdrop-blur-sm transition-transform duration-300 ease-in-out z-[90] ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full p-4 pt-16 sm:pt-4">
          {/* Logo */}
          <div className="mb-2 flex flex-col items-center justify-center">
            <Link href="/" className="block">
              <Image
                src="/images/logo.png"
                alt="Eternal Soul Logo"
                width={60}
                height={60}
                className="invert transform hover:invert-0 transition-all duration-300"
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
            <span className="text-xs text-white mt-2">Home</span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4 mt-4">
            <Link 
              href="/contact"
              className="flex flex-col items-center gap-1 text-white p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Image
                src="/images/Email.png"
                alt="Contact"
                width={24}
                height={24}
                className="invert brightness-0"
              />
              <span className="text-xs">Contact</span>
            </Link>

            <Link 
              href="/collections"
              className="flex flex-col items-center gap-1 text-white p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Image
                src="/images/T_Shirt.png"
                alt="Collections"
                width={24}
                height={24}
                className="invert brightness-0"
              />
              <span className="text-xs">Collections</span>
            </Link>

            <button
              onClick={handleProfileClick}
              className="flex flex-col items-center gap-1 text-white p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Image
                src="/images/Profile.png"
                alt="Profile"
                width={24}
                height={24}
                className="invert brightness-0"
              />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay to close menu on mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[80] sm:hidden"
          onClick={toggleMenu}
        ></div>
      )}

      <ProfilePopup isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
} 
