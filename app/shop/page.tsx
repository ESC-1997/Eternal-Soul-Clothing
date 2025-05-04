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
            {/* Bubble overlays for web and mobile */}
            <img src="/images/bubble.png" alt="Customizable Overlay 1" className="bubble-img bubble-1" />
            <img src="/images/bubble.png" alt="Customizable Overlay 2" className="bubble-img bubble-2" />
            <style jsx>{`
              .bubble-img {
                position: absolute;
                width: 100px;
                height: 90px;
                z-index: 30;
              }
              .bubble-1 {
                left: 177px;
                top: 330px;
              }
              .bubble-2 {
                left: 465px;
                top: 330px;
              }
              @media (max-width: 767px) {
                .bubble-1 {
                  left: 100px;
                  top: 320px;
                }
                .bubble-2 {
                  left: 290px;
                  top: 320px;
                }
              }
            `}</style>
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
