'use client';

import Image from "next/image";
import Navigation from "../components/Navigation";
import { useState } from "react";

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Navigation />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isMenuOpen ? 'ml-20' : 'ml-0 sm:ml-20'
      }`}>
        <div className="min-h-screen relative">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/ES Slash BG Grey.png"
              alt="Contact Background"
              fill
              className="object-cover blur-sm"
              priority
            />
          </div>

          <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-black/60 backdrop-blur-sm rounded-lg p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 text-center font-serif [text-shadow:_0_0_15px_rgb(107_33_168_/_100%)]">
                Contact Us
              </h2>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                    placeholder="Your email"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                    placeholder="Your message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#6B21A8] text-white font-semibold rounded-lg hover:bg-[#9333EA] transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
