'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCarouselSync } from './CarouselSyncContext';

const EternalThreadsCarousel = () => {
  const images = [
    '/images/eternal_elegance/collection/elegance_black_white 1.png',
    '/images/eternal_elegance/collection/elegance_black_violet 1.png',
    '/images/eternal_elegance/collection/elegance_black_red 1.png',
    '/images/eternal_elegance/collection/elegance_black_grey 1.png',
    '/images/eternal_elegance/collection/elegance_charcoal_white 1.png',
    '/images/eternal_elegance/collection/elegance_charcoal_blue 1.png',
    '/images/eternal_elegance/collection/elegance_fgreen_white 1.png',
    '/images/eternal_elegance/collection/elegance_fgreen_black 1.png',
    '/images/eternal_elegance/collection/elegance_lblue_violet 1.png',
    '/images/eternal_elegance/collection/elegance_lblue_blue 1.png',
    '/images/eternal_elegance/collection/elegance_sand_red 1.png',
    '/images/eternal_elegance/collection/elegance_sand_black 1.png',
    '/images/eternal_elegance/collection/elegance_white_violet 1.png',
    '/images/eternal_elegance/collection/elegance_white_red 1.png',
    '/images/eternal_elegance/collection/elegance_white_black 1.png',
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
          alt="Eternal Threads Collection"
          fill
          className={`object-contain transition-all duration-500 ${
            isTransitioning ? 'opacity-0 blur-lg' : 'opacity-100 blur-0'
          }`}
          priority
        />
        <Image
          key={`next-${displayIndex}`}
          src={images[(displayIndex + 1) % images.length]}
          alt="Eternal Threads Collection"
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

export default EternalThreadsCarousel; 