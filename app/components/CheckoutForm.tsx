import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  subtotal: number;
  clearCart: () => void;
  setIsCheckoutOpen: (open: boolean) => void;
}

export default function CheckoutForm({ subtotal, clearCart, setIsCheckoutOpen }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [aptSuite, setAptSuite] = useState('');
  const [city, setCity] = useState('');
  const [stateField, setStateField] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');
    setCheckoutSuccess('');
    setIsProcessing(true);
    if (!stripe || !elements) {
      setCheckoutError('Stripe has not loaded yet.');
      setIsProcessing(false);
      return;
    }
    try {
      // 1. Create PaymentIntent
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(subtotal * 100),
          shipping: {
            name: fullName,
            address: {
              line1: streetAddress,
              line2: aptSuite,
              city,
              state: stateField,
              postal_code: zip,
              country,
            },
            phone,
          },
          receipt_email: email,
        }),
      });
      const { clientSecret, error } = await res.json();
      if (error || !clientSecret) {
        setCheckoutError(error || 'Failed to create payment intent.');
        setIsProcessing(false);
        return;
      }
      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: fullName,
            email,
            phone,
            address: {
              line1: streetAddress,
              line2: aptSuite,
              city,
              state: stateField,
              postal_code: zip,
              country,
            },
          },
        },
      });
      if (result.error) {
        setCheckoutError(result.error.message || 'Payment failed.');
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setCheckoutSuccess('Payment successful! Thank you for your order.');
        clearCart();
        setIsCheckoutOpen(false);
      }
    } catch (err: any) {
      setCheckoutError(err.message || 'An error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 flex-grow overflow-y-auto" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" className="w-full border rounded p-2" placeholder="First & Last Name" required value={fullName} onChange={e => setFullName(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" className="w-full border rounded p-2" placeholder="you@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
        <input type="text" className="w-full border rounded p-2 mb-2" placeholder="Street Address" required value={streetAddress} onChange={e => setStreetAddress(e.target.value)} />
        <input type="text" className="w-full border rounded p-2 mb-2" placeholder="Apt, Suite, Unit, etc. (optional)" value={aptSuite} onChange={e => setAptSuite(e.target.value)} />
        <div className="flex gap-2">
          <input type="text" className="w-1/2 border rounded p-2" placeholder="City" required value={city} onChange={e => setCity(e.target.value)} />
          <input type="text" className="w-1/2 border rounded p-2" placeholder="State" required value={stateField} onChange={e => setStateField(e.target.value)} />
        </div>
        <div className="flex gap-2 mt-2">
          <input type="text" className="w-1/2 border rounded p-2" placeholder="ZIP Code" required value={zip} onChange={e => setZip(e.target.value)} />
          <input type="text" className="w-1/2 border rounded p-2" placeholder="Country" required value={country} onChange={e => setCountry(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input type="tel" className="w-full border rounded p-2" placeholder="(555) 555-5555" required value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Information</label>
        <div className="w-full border rounded p-4 bg-gray-50">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>
      {checkoutError && <div className="text-red-600 text-sm mt-2">{checkoutError}</div>}
      {checkoutSuccess && <div className="text-green-600 text-sm mt-2">{checkoutSuccess}</div>}
      <button type="submit" className="w-full mt-6 bg-[#1B1F3B] text-white py-3 rounded font-semibold hover:bg-[#15182c] transition-colors" disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
} 
