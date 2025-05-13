'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Collections() {
  return (
    <main className="relative w-full min-h-screen p-0 m-0" style={{ background: '#DADBE4' }}>
      {/* Customizable Collection Section */}
      <div style={{
        width: '100%',
        background: '#64748B',
        height: '850px',
        marginTop: 0,
        paddingTop: '60px',
      }}>
        <h2 style={{
          color: '#1B1F3B',
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '3rem',
          textAlign: 'center',
          marginTop: 0,
          letterSpacing: '0.1em',
          fontWeight: 'bold',
        }}>
          CUSTOMIZABLE COLLECTION!
        </h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          marginTop: '120px',
        }}>
          <div style={{ width: '230px', height: '300px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.20)' }}></div>
          <div style={{ width: '230px', height: '300px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.20)' }}></div>
          <div style={{ width: '230px', height: '300px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.20)' }}></div>
          <div style={{ width: '230px', height: '300px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.20)' }}></div>
        </div>
      </div>
    </main>
  );
} 