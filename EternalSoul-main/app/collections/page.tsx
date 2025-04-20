'use client';

import Image from "next/image";
import Navigation from "../components/Navigation";

export default function CollectionsPage() {
  return (
    <div className="min-h-screen flex">
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 sm:ml-20">
        <div className="min-h-screen relative overflow-y-auto">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/ES Slash BG Grey.png"
              alt="Collections Background"
              fill
              className="object-cover blur-sm"
              priority
            />
          </div>
          
          {/* Non-closeable Modal */}
          <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
            <div className="relative overflow-hidden rounded-lg w-full max-w-2xl bg-transparent">
              <div className="relative w-full pb-20" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0 bg-black/60"></div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center font-serif [text-shadow:_0_0_15px_rgb(107_33_168_/_100%)]">
                  Coming Soon
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-center max-w-md font-sans font-bold [text-shadow:_0_0_10px_rgb(107_33_168_/_100%)]">
                  Our collection is being prepared with care. Stay tuned for the launch of our exclusive designs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
