'use client';
import Link from 'next/link';
import WomensCollection from '../../components/WomensCollection';

export default function WomensShop() {
  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="max-w-7xl mx-auto relative">
        <nav className="flex overflow-x-auto md:overflow-visible justify-start md:justify-center gap-4 pt-12 pb-6 px-4 md:px-0 scrollbar-hide">
          <Link href="/shop" className="whitespace-nowrap px-4 py-2 text-white hover:bg-white hover:text-[#2C2F36] transition-colors duration-200">
            Shop All
          </Link>
          <Link href="/shop/mens" className="whitespace-nowrap px-4 py-2 text-white hover:bg-white hover:text-[#2C2F36] transition-colors duration-200">
            Mens
          </Link>
          <button className="whitespace-nowrap px-4 py-2 text-white hover:bg-white hover:text-[#2C2F36] transition-colors duration-200">
            Women's
          </button>
          <button className="whitespace-nowrap px-4 py-2 text-white hover:bg-white hover:text-[#2C2F36] transition-colors duration-200">
            Accessories
          </button>
        </nav>
        <WomensCollection />
      </div>
    </main>
  );
} 
