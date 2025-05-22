'use client';
import PrintifyStore from '../components/PrintifyStore';
import Image from 'next/image';
import { useState } from 'react';
import ShopNavigation from '../components/ShopNavigation';

export default function Shop() {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  return (
    <main className="min-h-screen bg-[#DADBE4]">
      <div className="max-w-7xl mx-auto relative">
        {!isCustomizing && !isViewing && (
          <>
            <ShopNavigation />
            <div className="flex justify-center py-8">
              <Image
                src="/images/Phoenix_ES_1B1F3B.png"
                alt="Eternal Soul"
                width={300}
                height={100}
                className="object-contain"
              />
            </div>
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
