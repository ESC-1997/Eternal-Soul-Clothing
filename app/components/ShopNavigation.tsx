'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ShopNavigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Determine if we're in the shop section
  const isShopPage = pathname.startsWith('/shop');
  
  // Determine the current section
  const isMensPage = pathname.includes('/mens');
  const isWomensPage = pathname.includes('/women');
  const isShopAllPage = pathname === '/shop';
  const isAccessoriesPage = pathname.includes('/accessories');

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(lastScrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed left-0 right-0 w-full bg-[#DADBE4] transform transition-all duration-300 ease-in-out
      ${isScrolled ? 'md:top-0 md:z-[100]' : 'md:top-[64px] md:z-[90]'} 
      top-0 z-[100]`}>
      <div className="relative max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <nav className="relative flex overflow-x-auto md:overflow-visible justify-start md:justify-center gap-4 pt-4 pb-4 px-4 md:px-0 scrollbar-hide">
          <Link 
            href="/shop" 
            className={`whitespace-nowrap px-4 py-2 text-base transition-colors duration-200 ${
              isShopAllPage 
                ? 'bg-[#9F2FFF] text-white' 
                : 'text-[#2C2F36] hover:bg-[#9F2FFF] hover:text-white'
            }`}
          >
            Shop All
          </Link>
          <Link 
            href="/shop/mens" 
            className={`whitespace-nowrap px-4 py-2 text-base transition-colors duration-200 ${
              isMensPage 
                ? 'bg-[#9F2FFF] text-white' 
                : 'text-[#2C2F36] hover:bg-[#9F2FFF] hover:text-white'
            }`}
          >
            Mens
          </Link>
          <Link 
            href="/shop/women" 
            className={`whitespace-nowrap px-4 py-2 text-base transition-colors duration-200 ${
              isWomensPage 
                ? 'bg-[#9F2FFF] text-white' 
                : 'text-[#2C2F36] hover:bg-[#9F2FFF] hover:text-white'
            }`}
          >
            Women's
          </Link>
          <Link 
            href="/shop/accessories" 
            className={`whitespace-nowrap px-4 py-2 text-base transition-colors duration-200 ${
              isAccessoriesPage 
                ? 'bg-[#9F2FFF] text-white' 
                : 'text-[#2C2F36] hover:bg-[#9F2FFF] hover:text-white'
            }`}
          >
            Accessories
          </Link>
        </nav>
      </div>
    </div>
  );
} 
