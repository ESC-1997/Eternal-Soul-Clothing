'use client';
import WomensCollection from '../../components/WomensCollection';
import ShopNavigation from '../../components/ShopNavigation';

export default function WomensShop() {
  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="max-w-7xl mx-auto relative">
        <ShopNavigation />
        <WomensCollection />
      </div>
    </main>
  );
} 