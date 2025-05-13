'use client';

export default function Terms() {
  return (
    <main className="min-h-screen" style={{ 
      background: 'url(/images/resource_pageBG.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ 
            color: '#DADBE4',
            fontFamily: 'Bebas Neue, sans-serif'
          }}>
            TERMS OF SERVICE
          </h1>
          <p className="text-lg" style={{ 
            color: '#DADBE4',
            fontFamily: 'Lato, sans-serif'
          }}>
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8" style={{ 
          color: '#DADBE4',
          fontFamily: 'Lato, sans-serif'
        }}>
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>1. Agreement to Terms</h2>
            <p className="text-lg leading-relaxed">
              By accessing and using Eternal Soul Clothing's website and services, you agree to be bound by these Terms of Service. These terms apply to all visitors, users, and customers of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>2. Order Acceptance and Processing</h2>
            <p className="text-lg leading-relaxed">
              All orders are subject to acceptance and availability. We reserve the right to refuse service to anyone. Orders are processed within 1-3 business days. Custom orders may require additional processing time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>3. Pricing and Payment</h2>
            <p className="text-lg leading-relaxed">
              All prices are in USD and include applicable taxes. We accept major credit cards and PayPal. Payment is processed at the time of order placement. Prices are subject to change without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>4. Shipping and Delivery</h2>
            <p className="text-lg leading-relaxed">
              Standard shipping within the United States takes 3-5 business days. International shipping may take 7-14 business days. Delivery times are estimates and not guaranteed. Shipping costs are calculated at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>5. Returns and Refunds</h2>
            <p className="text-lg leading-relaxed">
              Items may be returned within 30 days of delivery. Items must be unworn, unwashed, and in original packaging with tags attached. Custom and limited edition items are final sale. Refunds are processed within 5-7 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>6. Product Information</h2>
            <p className="text-lg leading-relaxed">
              We strive to display our products as accurately as possible. However, colors and sizes may vary slightly due to monitor settings and manufacturing processes. Please refer to our size chart for accurate measurements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>7. Intellectual Property</h2>
            <p className="text-lg leading-relaxed">
              All content on this website, including designs, logos, and text, is the property of Eternal Soul Clothing and is protected by copyright laws. Unauthorized use of our intellectual property is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>8. Privacy and Data Protection</h2>
            <p className="text-lg leading-relaxed">
              We collect and process personal information in accordance with our Privacy Policy. By using our services, you consent to such processing and warrant that all data provided is accurate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>9. Limitation of Liability</h2>
            <p className="text-lg leading-relaxed">
              Eternal Soul Clothing shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>10. Contact Information</h2>
            <p className="text-lg leading-relaxed">
              For questions about these Terms of Service, please contact us at support@eternalsoulclothing.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
} 