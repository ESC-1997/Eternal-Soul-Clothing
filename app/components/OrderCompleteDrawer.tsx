"use client";
import { useEffect } from 'react';

interface OrderCompleteDrawerProps {
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

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[104]"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-screen w-[420px] bg-white z-[105] shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0"
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
        <div className="p-8 h-full flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Complete!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. We'll send you an email confirmation shortly.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#1B1F3B] text-white py-3 rounded font-semibold hover:bg-[#15182c] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
} 