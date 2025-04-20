import './globals.css'
import { Corben, Playfair_Display, Inter, Bebas_Neue } from 'next/font/google'
import { Metadata } from 'next'
import Providers from './providers'

const corben = Corben({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-corben',
})

const playfair = Playfair_Display({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas',
})

export const metadata: Metadata = {
  title: 'Eternal Soul Clothing',
  description: 'More than just clothes — we\'re about energy, expression, and wearing your soul on your sleeve. Join our exclusive community for early access.',
  openGraph: {
    title: 'Eternal Soul Clothing',
    description: 'More than just clothes — we\'re about energy, expression, and wearing your soul on your sleeve. Join our exclusive community for early access.',
    url: 'https://eternalsoul.co',
    siteName: 'Eternal Soul',
    images: [
      {
        url: 'https://eternalsoul.co/images/ES%20Slash%20BG%20Grey.png',
        width: 1200,
        height: 630,
        alt: 'Eternal Soul Logo',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eternal Soul Clothing',
    description: 'More than just clothes — we\'re about energy, expression, and wearing your soul on your sleeve. Join our exclusive community for early access.',
    images: ['https://eternalsoul.co/images/ES%20Slash%20BG%20Grey.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL('https://eternalsoul.co'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#6B21A8" />
        <meta name="msapplication-TileColor" content="#6B21A8" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${corben.variable} ${playfair.variable} ${inter.variable} ${bebas.variable} font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
