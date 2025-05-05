'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useProfileDrawer } from '../context/ProfileDrawerContext';
import ProfileDrawer from './ProfileDrawer';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { items: cartItems, subtotal, removeItem, updateQuantity, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const { user, drawerOpen, setDrawerOpen } = useProfileDrawer();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[101] bg-[#1B1F3B] p-2 rounded-md"
      >
        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
        <div className="w-6 h-0.5 bg-white"></div>
      </button>

      {/* Navigation Menu */}
      <nav 
        className={`fixed left-0 top-0 h-screen z-[100] transition-all duration-300 ease-in-out
          ${isOpen ? 'w-24' : 'w-0 lg:w-24'}`} 
        style={{ backgroundColor: '#1B1F3B' }}
      >
        <div 
          className={`flex flex-col p-1.5 ${!isOpen && '!hidden lg:!flex'} overflow-hidden pt-16 lg:pt-0`}
        >
          <div className="flex justify-center mb-2">
            <Link 
              href="/" 
              className="relative group block cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <div className="relative">
                <Image
                  src="/images/Phoenix_ES_Grey.png"
                  alt="Phoenix Eternal Soul"
                  width={70}
                  height={70}
                  className="object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 text-white px-1.5 py-0 rounded hover:bg-gray-700 transition-colors text-sm w-full text-center">
                  Home
                </div>
              </div>
            </Link>
          </div>
          
          <div className="flex flex-col items-center space-y-5 mt-10">
            <Link 
              href="/collections" 
              className="group flex flex-col items-center"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex justify-center">
                <Image
                  src="/images/T_Shirt.png"
                  alt="T-Shirt"
                  width={35}
                  height={35}
                  className="object-contain"
                />
              </div>
              <button className="text-white px-1.5 py-1 rounded hover:bg-gray-700 transition-colors text-sm w-full text-center">
                Collections
              </button>
            </Link>

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

            {/* Always show Profile button */}
            <button
              className="group flex flex-col items-center"
              onClick={() => {
                if (user) {
                  setDrawerOpen(true);
                } else {
                  router.push('/profile');
                }
              }}
            >
              <div className="flex justify-center">
                <Image
                  src="/images/Profile.png"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-white px-1.5 py-1 rounded hover:bg-gray-700 transition-colors text-sm w-full text-center">
                Profile
              </span>
            </button>

            {/* Cart Button */}
            <div className="flex flex-col items-center space-y-1 mt-auto">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center w-full hover:bg-gray-700 transition-colors rounded p-1.5"
              >
                <div className="flex justify-center">
                  <Image
                    src="/images/Cart.png"
                    alt="Cart"
                    width={35}
                    height={35}
                    className="object-contain"
                  />
                </div>
                <span className="text-white text-sm">
                  Cart
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Panel */}
      <div 
        className={`fixed right-0 top-0 h-screen w-96 bg-white z-[102] transform transition-transform duration-300 ease-in-out
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 h-full flex flex-col">
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
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2" onClick={() => {/* TODO: handle checkout */}}>
              <span className="text-lg font-semibold">Checkout</span>
              <img src="/images/credit_card1.png" alt="Checkout" className="w-8 h-7 ml-2" />
            </button>
            {cartItems.length > 0 && (
              <button className="w-full mt-2 text-xs text-gray-500 hover:underline" onClick={clearCart}>
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

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

      {/* Render the ProfileDrawer globally so it can open from anywhere */}
      <ProfileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
} 