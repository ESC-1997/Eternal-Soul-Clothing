import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import PromoCodeInput from './PromoCodeInput';
import { supabase } from '../supabase/client';

interface CheckoutFormProps {
  subtotal: number;
  clearCart: () => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsOrderComplete: (open: boolean) => void;
}

export default function CheckoutForm({ subtotal, clearCart, setIsCheckoutOpen, setIsOrderComplete }: CheckoutFormProps) {
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
  const [country, setCountry] = useState('US');
  const [phone, setPhone] = useState('');
  const { items: cartItems, shippingMethod, setShippingMethod, shippingCost } = useCart();
  const [discount, setDiscount] = useState(0);
  const [couponId, setCouponId] = useState<string | null>(null);
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [error, setError] = useState('');

  // Get user's email when component mounts
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      }
    };
    getUser();
  }, []);

  // Fetch shipping rates when address is complete
  const fetchShippingRates = async () => {
    if (!city || !stateField || !zip || !streetAddress) {
      console.log('Missing required address fields:', { city, stateField, zip, streetAddress });
      return;
    }

    try {
      setIsLoadingShipping(true);
      setError('');

      // Calculate shipping: $4.75 for the first shirt, $1.00 for each additional shirt
      const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const shippingPrice = totalQuantity > 0 ? 4.75 + (totalQuantity - 1) * 1.0 : 0;
      const shippingOption = {
        id: '1',
        name: 'Standard Shipping',
        delivery_time: '5-8 business days',
        price: Math.round(shippingPrice * 100),
        currency: 'USD',
        is_express: false,
      };
      setShippingRates([shippingOption]);
      if (!shippingMethod || shippingMethod.id !== '1') {
        setShippingMethod(shippingOption);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoadingShipping(false);
    }
  };

  // Call fetchShippingRates when address fields change
  useEffect(() => {
    const timer = setTimeout(fetchShippingRates, 500);
    return () => clearTimeout(timer);
  }, [city, stateField, zip, streetAddress, cartItems, country, shippingMethod, setShippingMethod]);

  const handlePromoApplied = (discountAmount: number, couponId: string) => {
    setDiscount(discountAmount);
    setCouponId(couponId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingMethod) {
      setCheckoutError('Please select a shipping method');
      return;
    }
    setCheckoutError('');
    setCheckoutSuccess('');
    setIsProcessing(true);
    if (!stripe || !elements) {
      setCheckoutError('Stripe has not loaded yet.');
      setIsProcessing(false);
      return;
    }
    try {
      // 1. Create PaymentIntent with discount
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round((subtotal - discount) * 100),
          shipping: {
            name: fullName,
            address: {
              line1: streetAddress,
              line2: aptSuite,
              city,
              state: stateField,
              postal_code: zip,
              country: 'US',
            },
            phone,
          },
          receipt_email: email,
          coupon: couponId,
          shippingMethod,
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
              country: 'US',
            },
          },
        },
      });
      if (result.error) {
        setCheckoutError(result.error.message || 'Payment failed.');
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setCheckoutSuccess('Payment successful! Thank you for your order.');
        // Build Printify order payload
        const line_items = cartItems.map(item => ({
          product_id: item.id,
          variant_id: item.variantId,
          quantity: item.quantity,
        }));
        const address_to = {
          first_name: fullName.split(' ')[0] || fullName,
          last_name: fullName.split(' ').slice(1).join(' ') || '',
          email,
          phone,
          country: 'US',
          region: stateField,
          city,
          address1: streetAddress,
          address2: aptSuite,
          zip: zip,
        };
        const orderPayload = {
          external_id: `order-${Date.now()}`,
          label: 'Website Order',
          line_items,
          shipping_method: Number(shippingMethod.id),
          address_to,
        };
        try {
          console.log('Calling Printify order API with:', orderPayload);
          await fetch('/api/printify/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload),
          });
        } catch (err) {
          // Optionally show a warning, but don't block order complete drawer
          console.error('Printify order creation failed:', err);
        }
        clearCart();
        setIsCheckoutOpen(false);
        setIsOrderComplete(true);
      }
    } catch (err: any) {
      setCheckoutError(err.message || 'An error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 flex-grow overflow-y-auto w-full max-w-md mx-auto px-2" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" className="w-full border rounded p-2 text-[#1B1F3B]" placeholder="First & Last Name" required value={fullName} onChange={e => setFullName(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" className="w-full border rounded p-2 text-[#1B1F3B]" placeholder="you@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
        <input type="text" className="w-full border rounded p-2 mb-2 text-[#1B1F3B]" placeholder="Street Address" required value={streetAddress} onChange={e => setStreetAddress(e.target.value)} />
        <input type="text" className="w-full border rounded p-2 mb-2 text-[#1B1F3B]" placeholder="Apt, Suite, Unit, etc. (optional)" value={aptSuite} onChange={e => setAptSuite(e.target.value)} />
        <div className="flex gap-2">
          <input type="text" className="w-1/2 border rounded p-2 text-[#1B1F3B]" placeholder="City" required value={city} onChange={e => setCity(e.target.value)} />
          <input type="text" className="w-1/2 border rounded p-2 text-[#1B1F3B]" placeholder="State" required value={stateField} onChange={e => setStateField(e.target.value)} />
        </div>
        <div className="flex gap-2 mt-2">
          <input type="text" className="w-1/2 border rounded p-2 text-[#1B1F3B]" placeholder="ZIP Code" required value={zip} onChange={e => setZip(e.target.value)} />
          <div className="w-1/2">
            <select 
              className="w-full border rounded p-2 text-[#1B1F3B] bg-white" 
              value={country} 
              onChange={e => setCountry(e.target.value)}
              disabled
            >
              <option value="US">United States</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input type="tel" className="w-full border rounded p-2 text-[#1B1F3B]" placeholder="(555) 555-5555" required value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      {/* Shipping Method Selection */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
        {isLoadingShipping ? (
          <div className="text-gray-500">Loading shipping options...</div>
        ) : shippingRates.length > 0 ? (
          <div className="space-y-2">
            {shippingRates.map((rate) => (
              <label
                key={rate.id}
                className={`flex items-center p-3 border rounded cursor-pointer ${
                  shippingMethod?.id === rate.id ? 'border-[#B054FF] bg-purple-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value={rate.id}
                  checked={shippingMethod?.id === rate.id}
                  onChange={() => setShippingMethod(rate)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">{rate.name}</div>
                  <div className="text-sm text-gray-500">
                    {rate.delivery_time} • ${(rate.price / 100).toFixed(2)}
                  </div>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">
            {!city || !stateField || !zip || !streetAddress 
              ? 'Please enter your complete shipping address to see shipping options'
              : 'No shipping options available for this address'}
          </div>
        )}
      </div>
      <PromoCodeInput 
        onPromoApplied={handlePromoApplied}
        subtotal={subtotal}
      />
      {/* Price Breakdown */}
      <div className="mt-4 space-y-2 bg-gray-50 p-4 rounded">
        <div className="flex justify-between text-sm">
          <span className="text-[#1B1F3B] font-semibold">Subtotal</span>
          <span className="text-[#1B1F3B] font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount</span>
            <span className="text-green-600">-${discount.toFixed(2)}</span>
          </div>
        )}
        {shippingMethod && (
          <div className="flex justify-between text-sm">
            <span className="text-[#1B1F3B]">Shipping</span>
            <span className="text-[#1B1F3B]">${(shippingMethod.price / 100).toFixed(2)}</span>
          </div>
        )}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg bg-[#B054FF] text-white p-2 rounded">
            <span>Total</span>
            <span>${(subtotal - discount + (shippingMethod ? shippingMethod.price / 100 : 0)).toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Information</label>
        <div className="w-full border rounded p-4 bg-gray-50">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1B1F3B',
                  '::placeholder': {
                    color: '#aab7c4'
                  }
                },
                invalid: {
                  color: '#fa755a',
                  iconColor: '#fa755a'
                }
              },
              hidePostalCode: true
            }} 
          />
        </div>
      </div>
      {error && (
        <div className="text-red-600 text-sm mt-2 p-3 bg-red-50 border border-red-200 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      {checkoutSuccess && (
        <div className="text-green-600 text-sm mt-2 p-3 bg-green-50 border border-green-200 rounded">
          <p className="font-semibold">Success!</p>
          <p>{checkoutSuccess}</p>
        </div>
      )}
      <button type="submit" className="w-full mt-6 bg-[#1B1F3B] text-white py-3 rounded font-semibold hover:bg-[#15182c] transition-colors" disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
} 
