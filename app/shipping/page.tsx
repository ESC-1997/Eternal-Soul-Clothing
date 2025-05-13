'use client';

export default function Shipping() {
  return (
    <main className="min-h-screen" style={{ 
      background: 'url(/images/resource_pageBG.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-7xl font-bold mb-12" style={{ 
            color: '#DADBE4',
            fontFamily: 'Bebas Neue, sans-serif'
          }}>
            SHIPPING POLICY
          </h1>
          <div className="text-2xl leading-relaxed max-w-4xl mx-auto space-y-8" style={{ 
            color: '#DADBE4',
            fontFamily: 'Lato, sans-serif'
          }}>
            <p>
              At Eternal Soul Clothing, we partner with Printify to ensure high-quality production and reliable shipping of your orders. Our shipping policy is designed to provide transparency and clarity about delivery times and costs.
            </p>
            
            <div className="text-left">
              <h2 className="text-4xl mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Shipping Times</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Standard Shipping: 2-7 business days</li>
                <li>Express Shipping: 1-3 business days (where available)</li>
                <li>International Shipping: 7-14 business days</li>
              </ul>
            </div>

            <div className="text-left">
              <h2 className="text-4xl mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Shipping Costs</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Shipping costs are calculated based on product weight and destination</li>
                <li>Free shipping may be available for orders over certain thresholds</li>
                <li>International shipping rates vary by country</li>
              </ul>
            </div>

            <div className="text-left">
              <h2 className="text-4xl mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Order Processing</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Orders are typically processed within 1-2 business days</li>
                <li>Production time: 1-3 business days</li>
                <li>Tracking numbers are provided for all shipments</li>
              </ul>
            </div>

            <div className="text-left">
              <h2 className="text-4xl mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Important Notes</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery times may be affected by holidays and peak seasons</li>
                <li>Customs and import duties may apply for international orders</li>
                <li>We work with multiple print providers to ensure the fastest possible delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 