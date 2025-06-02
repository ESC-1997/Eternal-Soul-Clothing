'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import ReturnRequestModal from '../components/ReturnRequestModal';

export default function Resources() {
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  return (
    <main className="min-h-screen" style={{ 
      background: 'url(/images/resource_pageBG.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Row 1 */}
          <Link href="/about" className="aspect-square rounded-xl relative cursor-pointer transition-transform hover:scale-105" style={{ background: '#B054FF' }}>
            <div className="absolute" style={{ 
              color: '#DADBE4', 
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '4.0rem',
              fontWeight: 'bold',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              lineHeight: '1.3'
            }}>
              ABOUT<br />THE<br />BRAND
            </div>
            <div className="absolute" style={{
              top: '90px',
              right: '15px',
              width: '130px',
              height: '130px'
            }}>
              <Image
                src="/images/ES_shirt.png"
                alt="ES Shirt"
                width={150}
                height={150}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Link>
          <a 
            href="https://linktr.ee/eternalsoulclothing" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="aspect-square rounded-xl relative cursor-pointer transition-transform hover:scale-105" 
            style={{ background: '#B054FF' }}
          >
            <div className="absolute" style={{ 
              color: '#DADBE4', 
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '4.0rem',
              fontWeight: 'bold',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              lineHeight: '1.3'
            }}>
              FOLLOW<br />OUR<br />SOCIALS
            </div>
          </a>
          <Link href="/sizes" className="aspect-square rounded-xl relative cursor-pointer transition-transform hover:scale-105" style={{ background: '#B054FF' }}>
            <div className="absolute" style={{ 
              color: '#DADBE4', 
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '4.0rem',
              fontWeight: 'bold',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              lineHeight: '1.3'
            }}>
              FULL<br />SIZE<br />CHART
            </div>
            <div className="absolute" style={{
              top: '85px',
              right: '-30px',
              width: '200px',
              height: '200px'
            }}>
              <Image
                src="/images/size_chart.png"
                alt="Size Chart"
                width={160}
                height={160}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Link>
          
          {/* Row 2 */}
          <Link href="/terms" className="aspect-square rounded-xl relative cursor-pointer transition-transform hover:scale-105" style={{ background: '#B054FF' }}>
            <div className="absolute" style={{ 
              color: '#DADBE4', 
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '4.0rem',
              fontWeight: 'bold',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              lineHeight: '1.3'
            }}>
              TERMS<br />OF<br />SERVICE
            </div>
            <div className="absolute" style={{
              top: '90px',
              right: '15px',
              width: '130px',
              height: '130px'
            }}>
              <Image
                src="/images/terms_of_service.png"
                alt="Terms of Service"
                width={150}
                height={150}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Link>
          <Link href="/returns" className="aspect-square rounded-xl relative cursor-pointer transition-transform hover:scale-105" style={{ background: '#B054FF' }}>
            <div className="absolute" style={{ 
              color: '#DADBE4', 
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '4.0rem',
              fontWeight: 'bold',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              lineHeight: '1.3'
            }}>
              OUR<br />RETURN<br />POLICY
            </div>
          </Link>
          <div 
            onClick={() => setIsReturnModalOpen(true)}
            className="aspect-square rounded-xl relative cursor-pointer transition-transform hover:scale-105" 
            style={{ background: '#B054FF' }}
          >
            <div className="absolute" style={{ 
              color: '#DADBE4', 
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '4.0rem',
              fontWeight: 'bold',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              lineHeight: '1.3'
            }}>
              REQUEST<br />A<br />RETURN
            </div>
            <div className="absolute" style={{
              top: '90px',
              right: '15px',
              width: '130px',
              height: '130px'
            }}>
              <Image
                src="/images/return.png"
                alt="Return"
                width={150}
                height={150}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          
          {/* Row 3 */}
          <div className="aspect-square rounded-xl relative cursor-pointer transition-transform hover:scale-105" style={{ background: '#B054FF' }}>
            <div className="absolute" style={{ 
              color: '#DADBE4', 
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '4.0rem',
              fontWeight: 'bold',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              lineHeight: '1.3'
            }}>
              OUR<br />PRIVACY<br />POLICY
            </div>
            <div className="absolute" style={{
              top: '90px',
              right: '1px',
              width: '130px',
              height: '130px'
            }}>
              <Image
                src="/images/privacy.png"
                alt="Privacy"
                width={160}
                height={160}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <Link href="/shipping" className="aspect-square rounded-xl relative cursor-pointer transition-transform hover:scale-105" style={{ background: '#B054FF' }}>
            <div className="absolute" style={{ 
              color: '#DADBE4', 
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '4.0rem',
              fontWeight: 'bold',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              lineHeight: '1.3'
            }}>
              OUR<br />SHIPPING<br />POLICY
            </div>
          </Link>
          <div className="aspect-square rounded-xl relative cursor-pointer transition-transform hover:scale-105" style={{ background: '#B054FF' }}>
            <div className="absolute" style={{ 
              color: '#DADBE4', 
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '4.0rem',
              fontWeight: 'bold',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              lineHeight: '1.3'
            }}>
              CONTACT<br />US<br />HERE!
            </div>
          </div>
        </div>
      </div>

      <ReturnRequestModal 
        isOpen={isReturnModalOpen} 
        onClose={() => setIsReturnModalOpen(false)} 
      />
    </main>
  );
} 