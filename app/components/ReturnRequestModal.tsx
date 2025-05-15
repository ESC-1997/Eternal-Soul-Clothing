import { useState } from 'react';
import ReturnRequestForm from './ReturnRequestForm';

interface ReturnRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReturnRequestModal({ isOpen, onClose }: ReturnRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#DADBE4] rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-[#1E293B]">Request a Return</h2>
        <ReturnRequestForm />
      </div>
    </div>
  );
} 
