'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Collections() {
  return (
    <main className="relative w-full min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full flex items-center justify-center z-0">
        <Image
          src="/images/Collections_BG1.png"
          alt="Collections Background"
          width={650}
          height={600}
          className="object-contain"
          priority
        />
      </div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
        <div className="relative bg-white/30 p-8 rounded-lg max-w-md text-center backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-4" style={{ 
            color: '#1B1F3B',
            textShadow: '0 0 10px rgb(255, 255, 255)'
          }}>Coming Soon</h2>
          <p className="text-lg" style={{ 
            color: '#1B1F3B',
            textShadow: '0 0 10px rgb(255, 255, 255)'
          }}>
            Our collection is being prepared with care. Stay tuned for the launch of our exclusive designs.
          </p>
        </div>
      </div>
    </main>
  );
} 
