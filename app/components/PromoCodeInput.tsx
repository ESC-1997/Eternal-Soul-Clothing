'use client';
import { useState } from 'react';

interface PromoCodeInputProps {
  onPromoApplied: (discount: number, couponId: string) => void;
  subtotal: number;
}

export default function PromoCodeInput({ onPromoApplied, subtotal }: PromoCodeInputProps) {
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setError('Please enter a promo code');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/validate-promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: promoCode,
          subtotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate promo code');
      }

      setSuccess('Promo code applied successfully!');
      onPromoApplied(data.discount, data.couponId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          placeholder="Enter promo code"
          className="flex-1 border rounded p-2 text-[#1B1F3B]"
          disabled={isLoading}
        />
        <button
          onClick={handleApplyPromo}
          disabled={isLoading}
          className="px-4 py-2 bg-[#B054FF] text-white rounded hover:bg-[#9F2FFF] transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Applying...' : 'Apply'}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
      {success && (
        <p className="text-green-500 text-sm mt-2">{success}</p>
      )}
    </div>
  );
} 