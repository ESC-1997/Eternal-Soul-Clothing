'use client';

export default function About() {
  return (
    <main className="min-h-screen" style={{ 
      background: 'url(/images/resource_pageBG.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-7xl font-bold mb-12" style={{ 
            color: '#DADBE4',
            fontFamily: 'Bebas Neue, sans-serif'
          }}>
            ABOUT THE BRAND
          </h1>
          <p className="text-2xl leading-relaxed max-w-4xl mx-auto" style={{ 
            color: '#DADBE4',
            fontFamily: 'Lato, sans-serif'
          }}>
            Eternal Soul Clothing is more than just a fashion label—it's a tribute to the enduring energy within each of us. Rooted in the belief that the soul is eternal and ever-transforming, our brand stands as a reminder that even in moments of darkness, there is light that never fades. Every design is crafted to reflect themes of personal growth, healing, and the invisible strength that carries us forward. Eternal Soul is for those who feel deeply, think boldly, and believe that identity is not fixed—but a continuous journey of becoming. Through quality pieces and meaningful art, we aim to spark connection, conversation, and self-expression in the most authentic form.
          </p>
        </div>
      </div>
    </main>
  );
} 