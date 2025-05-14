'use client';

import React from 'react';
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
  const { currentIndex, pause, resume } = useCarouselSync();

  return (
    <div 
      className="relative w-full h-[400px]"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <Image
        src={images[currentIndex % images.length]}
        alt="Eternal Threads Collection"
        fill
        className="object-contain transition-opacity duration-500"
        priority
      />
    </div>
  );
};

export default EternalThreadsCarousel; 
