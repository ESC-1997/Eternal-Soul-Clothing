'use client';
import Link from 'next/link';
import MensCollection from '../../components/MensCollection';

export default function MensShop() {
  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="max-w-7xl mx-auto relative">
        <nav className="flex overflow-x-auto md:overflow-visible justify-start md:justify-center gap-4 pt-12 pb-6 px-4 md:px-0 scrollbar-hide">
          <Link href="/shop" className="whitespace-nowrap px-4 py-2 text-white hover:bg-white hover:text-[#2C2F36] transition-colors duration-200">
            Shop All
          </Link>
          <button className="whitespace-nowrap px-4 py-2 text-white hover:bg-white hover:text-[#2C2F36] transition-colors duration-200">
            Mens
          </button>
          <Link href="/shop/women" className="whitespace-nowrap px-4 py-2 text-white hover:bg-white hover:text-[#2C2F36] transition-colors duration-200">
            Women's
          </Link>
          <button className="whitespace-nowrap px-4 py-2 text-white hover:bg-white hover:text-[#2C2F36] transition-colors duration-200">
            Accessories
          </button>
        </nav>
        <MensCollection />
      </div>
    </main>
  );
} 
