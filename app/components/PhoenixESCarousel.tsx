'use client';

import React from 'react';
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
  const { currentIndex, pause, resume } = useCarouselSync();

  return (
    <div 
      className="relative w-full h-[400px]"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <Image
        src={images[currentIndex % images.length]}
        alt="Phoenix ES Collection"
        fill
        className="object-contain transition-opacity duration-500"
        priority
      />
    </div>
  );
};

export default PhoenixESCarousel; 
