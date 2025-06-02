'use client';
import MensCollection from '../../components/MensCollection';
import ShopNavigation from '../../components/ShopNavigation';

export default function MensShop() {
  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="max-w-7xl mx-auto relative">
        <ShopNavigation />
        <div className="pt-8">
          <MensCollection />
        </div>
      </div>
    </main>
  );
} 