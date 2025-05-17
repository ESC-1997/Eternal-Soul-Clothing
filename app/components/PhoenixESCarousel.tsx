'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCarouselSync } from './CarouselSyncContext';

const PhoenixESCarousel = () => {
  const images = [
    '/images/phoenixES/collection/white_red 1.png',
    '/images/phoenixES/collection/white_grey.png',
    '/images/phoenixES/collection/white_black.png',
    '/images/phoenixES/collection/sand_white.png',
    '/images/phoenixES/collection/sand_red.png',
    '/images/phoenixES/collection/sand_black.png',
    '/images/phoenixES/collection/lblue_white.png',
    '/images/phoenixES/collection/lblue_violet.png',
    '/images/phoenixES/collection/fgreen_white.png',
    '/images/phoenixES/collection/fgreen_grey.png',
    '/images/phoenixES/collection/charcoal_violet.png',
    '/images/phoenixES/collection/charcoal_black.png',
    '/images/phoenixES/collection/black_white.png',
    '/images/phoenixES/collection/black_violet.png',
    '/images/phoenixES/collection/black_grey.png',
  ];
  const { currentIndex } = useCarouselSync();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(currentIndex);

  useEffect(() => {
    if (currentIndex !== displayIndex) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayIndex(currentIndex);
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, displayIndex]);

  return (
    <div className="relative w-full h-[300px]">
      <div className="relative w-full h-full">
        <Image
          key={displayIndex}
          src={images[displayIndex % images.length]}
          alt="Phoenix ES Collection"
          fill
          className={`object-contain transition-all duration-500 ${
            isTransitioning ? 'opacity-0 blur-lg' : 'opacity-100 blur-0'
          }`}
          priority
        />
        <Image
          key={`next-${displayIndex}`}
          src={images[(displayIndex + 1) % images.length]}
          alt="Phoenix ES Collection"
          fill
          className={`object-contain absolute inset-0 transition-all duration-500 ${
            isTransitioning ? 'opacity-100 blur-0' : 'opacity-0 blur-lg'
          }`}
          priority
        />
      </div>
    </div>
  );
};

export default PhoenixESCarousel; 
