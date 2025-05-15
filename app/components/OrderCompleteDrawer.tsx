"use client";
import { useEffect } from 'react';
import Image from 'next/image';

export interface OrderCompleteDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function OrderCompleteDrawer({ open, onClose }: OrderCompleteDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[199]"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md transform transition-transform duration-300 ease-in-out z-[200]
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: '#1B1F3B' }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center p-8 h-full">
          {/* Logo */}
          <div className="mt-12 mb-8">
            <Image
              src="/images/Phoenix_ES_DADBE4.png"
              alt="Phoenix Eternal Soul"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>

          {/* Message */}
          <div className="text-center text-white space-y-4">
            <h2 className="text-2xl font-semibold">Thanks for your order 🔮</h2>
            <p className="text-lg">
              We've sent a confirmation to your email. You can also view your order anytime on the Profile page.
            </p>
            <p className="text-lg mt-8">
              Stay limitless.
            </p>
            <p className="text-lg font-semibold">
              — Eternal Soul
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 
