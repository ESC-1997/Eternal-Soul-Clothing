'use client';
import ShopNavigation from '../../components/ShopNavigation';
import Image from 'next/image';

export default function AccessoriesShop() {
  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="max-w-7xl mx-auto relative">
        <ShopNavigation />
        <div className="pt-8">
          <div className="flex justify-center py-8">
            <Image
              src="/images/Phoenix_ES_DADBE4.png"
              alt="Eternal Soul Accessories"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>

          {/* Banner Section */}
          <div className="bg-[#DADBE4] py-4 mb-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-['Bebas_Neue'] text-[#1B1F3B] tracking-wider text-center">
                ACCESSORIES
              </h2>
            </div>
          </div>

          {/* Coming Soon Message */}
          <div className="text-center py-12">
            <p className="text-xl text-white">Coming Soon</p>
          </div>
        </div>
      </div>
    </main>
  );
} 
