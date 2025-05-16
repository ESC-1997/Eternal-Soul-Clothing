'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCarouselSync } from './CarouselSyncContext';

const EternalDivideCarousel = () => {
  const images = [
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
    '/images/eternal_slash/collection/midnight_indigo_sand 1.png',
    '/images/eternal_slash/collection/midnight_indigo_sage 1.png',
    '/images/eternal_slash/collection/midnight_indigo_charcoal 1.png',
    '/images/eternal_slash/collection/grey_navy 1.png',
    '/images/eternal_slash/collection/black_lblue 1.png',
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
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, displayIndex]);

  return (
    <div className="relative w-full h-[300px] perspective-1000">
      <div className={`relative w-full h-full transition-all duration-600 transform-style-3d ${
        isTransitioning ? 'rotate-y-180' : 'rotate-y-0'
      }`}>
        <Image
          src={images[displayIndex % images.length]}
          alt="Eternal Divide Collection"
          fill
          className="object-contain backface-hidden"
          priority
        />
        <Image
          src={images[displayIndex % images.length]}
          alt="Eternal Divide Collection"
          fill
          className="object-contain absolute inset-0 rotate-y-180 backface-hidden"
          priority
        />
      </div>
    </div>
  );
};

export default EternalDivideCarousel; 
