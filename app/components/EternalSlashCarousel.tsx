'use client';

import React from 'react';
import Image from 'next/image';
import { useCarouselSync } from './CarouselSyncContext';

const EternalSlashCarousel = () => {
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
  const { currentIndex, pause, resume } = useCarouselSync();

  return (
    <div 
      className="relative w-full h-[400px]"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <Image
        src={images[currentIndex % images.length]}
        alt="Eternal Slash Collection"
        fill
        className="object-contain transition-opacity duration-500"
        priority
      />
    </div>
  );
};

export default EternalSlashCarousel; 
