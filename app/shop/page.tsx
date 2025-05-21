'use client';
import PrintifyStore from '../components/PrintifyStore';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

export default function Shop() {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  return (
    <main className="min-h-screen bg-[#DADBE4]">
      <div className="max-w-7xl mx-auto relative">
        {!isCustomizing && !isViewing && (
          <>
            <nav className="flex overflow-x-auto md:overflow-visible justify-start md:justify-center gap-4 pt-12 pb-6 px-4 md:px-0 scrollbar-hide">
              <button className="whitespace-nowrap px-4 py-2 text-[#1B1F3B] hover:bg-[#1B1F3B] hover:text-white transition-colors duration-200">
                Shop All
              </button>
              <Link href="/shop/mens" className="whitespace-nowrap px-4 py-2 text-[#1B1F3B] hover:bg-[#1B1F3B] hover:text-white transition-colors duration-200">
                Mens
              </Link>
              <button className="whitespace-nowrap px-4 py-2 text-[#1B1F3B] hover:bg-[#1B1F3B] hover:text-white transition-colors duration-200">
                Women's
              </button>
              <button className="whitespace-nowrap px-4 py-2 text-[#1B1F3B] hover:bg-[#1B1F3B] hover:text-white transition-colors duration-200">
                Accessories
              </button>
            </nav>
            <div className="flex justify-center py-8">
              <Image
                src="/images/Phoenix_ES_1B1F3B.png"
                alt="Eternal Soul"
                width={300}
                height={100}
                className="object-contain"
              />
            </div>
            {/* Bubble overlays for web and mobile removed */}
          </>
        )}
        <PrintifyStore 
          onCustomizationModeChange={setIsCustomizing} 
          onViewModeChange={setIsViewing} 
        />
      </div>
    </main>
  );
} 
