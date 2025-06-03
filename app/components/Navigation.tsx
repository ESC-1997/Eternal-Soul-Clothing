'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import React from 'react';
import StripeProvider from './StripeProvider';
import CheckoutForm from './CheckoutForm';
import OrderCompleteDrawer from './OrderCompleteDrawer';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { items: cartItems, subtotal, removeItem, updateQuantity, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[101] bg-black p-2 rounded-md"
      >
        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
        <div className="w-6 h-0.5 bg-white"></div>
      </button>

      {/* Mobile Navigation Menu */}
      <nav 
        className={`fixed left-0 top-0 h-screen z-[100] transition-all duration-300 ease-in-out bg-black
          ${isOpen ? 'w-24' : 'w-0'} lg:w-0 lg:opacity-0 lg:pointer-events-none`} 
      >
        <div 
          className={`flex flex-col p-1.5 ${!isOpen && '!hidden'} overflow-hidden pt-8`}
        >
          <div className="flex justify-center mb-4">
            <Link 
              href="/" 
              className="relative group block cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex flex-col items-center mt-7">
                <Image
                  src="/images/Home.png"
                  alt="Phoenix Eternal Soul"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div className="text-white px-1.5 py-0 rounded hover:bg-gray-700 transition-colors text-sm w-full text-center mt-2">
                  Home
                </div>
              </div>
            </Link>
          </div>
          
          <div className="flex flex-col items-center space-y-5 mt-2">
            <Link 
              href="/shop" 
              className="group flex flex-col items-center relative"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex justify-center">
                <Image
                  src="/images/Shop.png"
                  alt="Shop"
                  width={35}
                  height={35}
                  className="object-contain"
                />
              </div>
              <button className="text-white px-1.5 py-1 rounded hover:bg-gray-700 transition-colors text-sm w-full text-center">
                Shop
              </button>
            </Link>

            <Link 
              href="/resources" 
              className="group flex flex-col items-center"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex justify-center">
                <Image
                  src="/images/about.png"
                  alt="Resources"
                  width={35}
                  height={35}
                  className="object-contain"
                />
              </div>
              <button className="text-white px-1.5 py-1 rounded hover:bg-gray-700 transition-colors text-sm w-full text-center">
                Resources
              </button>
            </Link>

            <div className="flex flex-col items-center space-y-1 mt-auto">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#9F2FFF] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {cartItems.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <Image
            src="/images/Phoenix_ES_DADBE4.png"
            alt="Phoenix Eternal Soul"
            width={50}
            height={50}
            className="object-contain"
          />
        </div>
      </nav>

      {/* Desktop Navigation Menu */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-[100] bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="w-[200px]"></div> {/* Spacer to balance the right side */}

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/Phoenix_ES_DADBE4.png"
                  alt="Phoenix Eternal Soul"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </Link>
            </div>

            <div className="flex items-center">
              <div className="flex items-center space-x-8">
                <Link href="/shop" className="text-white hover:text-gray-300 transition-colors font-['Bebas_Neue'] tracking-wider text-lg">
                  Shop
                </Link>
                <Link href="/resources" className="text-white hover:text-gray-300 transition-colors font-['Bebas_Neue'] tracking-wider text-lg">
                  Resources
                </Link>
              </div>
              <div className="flex items-center space-x-4 ml-8">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center text-white hover:text-gray-300 transition-colors"
                >
                  <Image
                    src="/images/Profile.png"
                    alt="Profile"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#9F2FFF] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                      {cartItems.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Add padding to main content to account for fixed header on desktop */}
      <div className="hidden lg:block h-16"></div>

      {/* Cart Panel */}
      <div 
        className={`fixed right-0 top-0 h-screen w-full min-w-0 max-w-[100vw] sm:max-w-sm md:max-w-md lg:w-96 bg-white z-[102] transform transition-transform duration-300 ease-in-out
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 h-full flex flex-col overflow-y-auto">
          {/* Cart Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-grow overflow-y-auto">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id + item.size + item.color + item.logo} className="flex items-center gap-3 border-b pb-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-600">{item.size} | {item.color} | {item.logo}</div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.logo,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="px-2 py-1 rounded bg-gray-200 text-[#1B1F3B] font-bold"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          readOnly
                          className="w-10 border rounded p-1 text-center text-sm"
                          style={{ color: '#1B1F3B' }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.logo,
                              item.quantity + 1
                            )
                          }
                          className="px-2 py-1 rounded bg-gray-200 text-[#1B1F3B] font-bold"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                        {/* Remove button to the right of quantity */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id, item.size, item.color, item.logo)}
                          className="ml-2 p-1 hover:bg-red-100 rounded"
                          aria-label="Remove item"
                        >
                          <img src="/images/trash.png" alt="Remove" className="w-7 h-7" />
                        </button>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="border-t pt-4 mt-4">
            {/* Subtotal Section */}
            <div className="flex justify-between items-center mb-2 px-2 py-2 rounded" style={{ background: '#DADBE4' }}>
              <span className="font-semibold text-[#1B1F3B]">Subtotal</span>
              <span className="font-semibold text-[#1B1F3B]">${subtotal.toFixed(2)}</span>
            </div>
            {/* Discount Section - Only show if there's a discount */}
            {discount > 0 && (
              <div className="flex justify-between items-center mb-2 px-2 py-2">
                <span className="text-green-600">Discount</span>
                <span className="text-green-600">-${discount.toFixed(2)}</span>
              </div>
            )}
            {/* Total Section */}
            <div className="flex justify-between items-center mb-4 px-2 py-2 bg-[#B054FF] rounded">
              <span className="font-bold text-lg text-white">Total</span>
              <span className="font-bold text-lg text-white">${(subtotal - discount).toFixed(2)}</span>
            </div>
            <button className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2" onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}>
              <span className="text-lg font-semibold">Checkout</span>
              <img src="/images/checkout.png" alt="Checkout" className="w-10 h-13 ml-1s" />
            </button>
            {cartItems.length > 0 && (
              <button className="w-full mt-2 text-xs text-gray-500 hover:underline" onClick={clearCart}>
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Panel */}
      <StripeProvider>
        <div
          className={`fixed right-0 top-0 h-screen w-full min-w-0 max-w-[100vw] sm:max-w-sm md:max-w-md lg:w-[420px] bg-white z-[103] shadow-lg transform transition-transform duration-300 ease-in-out
            ${isCheckoutOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-8 h-full flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Checkout</h2>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CheckoutForm 
              subtotal={subtotal} 
              clearCart={clearCart} 
              setIsCheckoutOpen={setIsCheckoutOpen}
              setIsOrderComplete={setIsOrderComplete}
            />
          </div>
        </div>
      </StripeProvider>

      {/* Order Complete Drawer */}
      <OrderCompleteDrawer 
        open={isOrderComplete} 
        onClose={() => setIsOrderComplete(false)} 
      />

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[99] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Overlay for cart */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[101]"
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </>
  );
} 