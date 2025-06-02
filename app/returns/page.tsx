'use client';

export default function Returns() {
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
            RETURN POLICY
          </h1>
          <div className="text-2xl leading-relaxed max-w-4xl mx-auto space-y-8" style={{ 
            color: '#DADBE4',
            fontFamily: 'Lato, sans-serif'
          }}>
            <p>
              At Eternal Soul Clothing, we want you to be completely satisfied with your purchase. We partner with Printify to ensure high-quality products and a smooth return process.
            </p>
            
            <div className="text-left">
              <h2 className="text-4xl mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Return Eligibility</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Items must be returned within 30 days of delivery</li>
                <li>Items must be unworn, unwashed, and in original packaging</li>
                <li>All original tags must be attached</li>
                <li>Custom and limited edition items are final sale and cannot be returned</li>
              </ul>
            </div>

            <div className="text-left">
              <h2 className="text-4xl mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Return Process</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact our customer service team to initiate a return</li>
                <li>We will provide you with a return shipping label</li>
                <li>Package your item securely with all original packaging and tags</li>
                <li>Ship the item back using the provided return label</li>
                <li>Once received and inspected, your refund will be processed</li>
              </ol>
            </div>

            <div className="text-left">
              <h2 className="text-4xl mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Refund Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds are processed within 5-7 business days after return receipt</li>
                <li>Refunds will be issued to the original payment method</li>
                <li>Shipping costs are non-refundable unless the item was defective</li>
                <li>Return shipping is free for eligible returns</li>
              </ul>
            </div>

            <div className="text-left">
              <h2 className="text-4xl mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Important Notes</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We reserve the right to refuse returns that do not meet our return policy requirements</li>
                <li>Items must be in resellable condition to be eligible for a refund</li>
                <li>For defective items, please contact us immediately upon receipt</li>
                <li>International returns may be subject to additional shipping fees</li>
              </ul>
            </div>

            <div className="text-left">
              <h2 className="text-4xl mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Contact Us</h2>
              <p>
                If you have any questions about our return policy or need assistance with a return, please contact our customer service team at support@eternalsoulclothing.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 