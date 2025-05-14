'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Sizes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen5000, setIsModalOpen5000] = useState(false);

  return (
    <main className="min-h-screen" style={{ 
      background: 'url(/images/resource_pageBG.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 gap-6">
          {/* Gildan 64000 Card */}
          <div 
            className="h-32 md:h-48 rounded-xl relative cursor-pointer transition-transform hover:scale-105" 
            style={{ background: '#B054FF' }}
            onClick={() => setIsModalOpen(true)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ 
                color: '#DADBE4', 
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
                fontWeight: 'bold',
                lineHeight: '1',
                whiteSpace: 'nowrap',
                padding: '0 clamp(10px, 3vw, 20px)',
                textAlign: 'center'
              }}>
                GILDAN 64000 T-SHIRT
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-8 md:h-10 rounded-b-xl" style={{ background: '#DADBE4' }}>
              <div className="h-full flex items-center justify-center px-2">
                <span style={{
                  fontFamily: 'Lato, sans-serif',
                  color: '#1B1F3B',
                  fontSize: 'clamp(0.75rem, 2vw, 1.2rem)',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  View Size Chart for collections: Eternal Customization & Eternal Elegance
                </span>
              </div>
            </div>
          </div>

          {/* Gildan 5000 Card */}
          <div 
            className="h-32 md:h-48 rounded-xl relative cursor-pointer transition-transform hover:scale-105" 
            style={{ background: '#B054FF' }}
            onClick={() => setIsModalOpen5000(true)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ 
                color: '#DADBE4', 
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
                fontWeight: 'bold',
                lineHeight: '1',
                whiteSpace: 'nowrap',
                padding: '0 clamp(10px, 3vw, 20px)',
                textAlign: 'center'
              }}>
                GILDAN 5000 T-SHIRT
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-8 md:h-10 rounded-b-xl" style={{ background: '#DADBE4' }}>
              <div className="h-full flex items-center justify-center px-2">
                <span style={{
                  fontFamily: 'Lato, sans-serif',
                  color: '#1B1F3B',
                  fontSize: 'clamp(0.75rem, 2vw, 1.2rem)',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  View Size Chart for: Eternal Awakening T-Shirt
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Gildan 64000 */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-3xl rounded-sm overflow-hidden"
            style={{ background: '#DADBE4' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 z-10"
              onClick={() => setIsModalOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-[70vh] md:h-[90vh]">
              <Image
                src="/images/gildan64000_sc.png"
                alt="Gildan 64000 Size Chart"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal for Gildan 5000 */}
      {isModalOpen5000 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1"
          onClick={() => setIsModalOpen5000(false)}
        >
          <div 
            className="relative w-full max-w-3xl rounded-sm overflow-hidden"
            style={{ background: '#DADBE4' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 z-10"
              onClick={() => setIsModalOpen5000(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-[70vh] md:h-[90vh]">
              <Image
                src="/images/gildan5000_sc.png"
                alt="Gildan 5000 Size Chart"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 
