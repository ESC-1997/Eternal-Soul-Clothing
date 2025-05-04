'use client';
import PrintifyStore from '../components/PrintifyStore';
import Image from 'next/image';
import { useState } from 'react';

export default function Shop() {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  return (
    <main className="min-h-screen bg-[#DADBE4]">
      <div className="max-w-7xl mx-auto relative">
        {!isCustomizing && !isViewing && (
          <>
            <div className="flex justify-center py-8">
              <Image
                src="/images/Phoenix_ES_1B1F3B.png"
                alt="Eternal Soul"
                width={300}
                height={100}
                className="object-contain"
              />
            </div>
            {/* Hardcoded bubble overlays */}
            <img
              src="/images/bubble.png"
              alt="Customizable Overlay 1"
              style={{
                position: 'absolute',
                left: '135px',
                top: '330px',
                width: '100px',
                height: '90px',
                zIndex: 30,
              }}
            />
            <img
              src="/images/bubble.png"
              alt="Customizable Overlay 2"
              style={{
                position: 'absolute',
                left: '360px',
                top: '330px',
                width: '100px',
                height: '90px',
                zIndex: 30,
              }}
            />
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
