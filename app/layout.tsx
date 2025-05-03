import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from './components/Navigation';
import { CartProvider } from './context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eternal Soul Clothing',
  description: 'Customizable clothing with unique designs',
  icons: {
    icon: '/images/facebook_profile.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <CartProvider>
          <Navigation />
          <div className="lg:ml-24">
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
