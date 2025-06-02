'use client';
import { useState } from 'react';

interface ReturnRequestFormProps {
  onSuccess?: () => void;
}

export default function ReturnRequestForm({ onSuccess }: ReturnRequestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    reason: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    setStatus('loading');
    setErrorMessage('');

    try {
      console.log('Sending request to API');
      const response = await fetch('/api/send-return-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('You have reached the maximum number of return requests. Please try again later.');
        }
        throw new Error(data.message || 'Something went wrong');
      }

      console.log('Setting success state');
      setStatus('success');
      setFormData({ name: '', email: '', orderNumber: '', reason: '' });
      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess();
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  console.log('Current status:', status);

  if (status === 'success') {
    console.log('Rendering success state');
    return (
      <div className="text-center p-6 space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#1E293B]">Return Request Submitted!</h3>
        <p className="text-[#1E293B] mb-2">Thank you for your return request.</p>
        <p className="text-[#1E293B] text-sm">
          Our team will review your message and contact you within 48 hours with next steps.
        </p>
        <p className="text-[#1E293B] text-sm">
          Please keep your order number (#{formData.orderNumber}) for reference.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {errorMessage}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#1E293B]">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-[#1E293B]"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#1E293B]">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-[#1E293B]"
        />
      </div>
      <div>
        <label htmlFor="orderNumber" className="block text-sm font-medium text-[#1E293B]">
          Order Number
        </label>
        <input
          type="text"
          id="orderNumber"
          name="orderNumber"
          value={formData.orderNumber}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-[#1E293B]"
        />
      </div>
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-[#1E293B]">
          Reason for Return
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-[#1E293B]"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Return Request'}
      </button>
    </form>
  );
} 