import { notFound } from 'next/navigation';
import ProductViewer from '../../components/ProductViewer';
import ProductCustomizer from '../../components/ProductCustomizer';

interface Product {
  id: string;
  title: string;
  images: {
    src: string;
  }[];
  variants: {
    id: string;
    title: string;
    price: string;
  }[];
}

interface Products {
  [key: string]: Product;
}

// This would typically come from your database or API
const products: Products = {
  'eternal-awakening': {
    id: '681acbd3c9285dd17e0dd618',
    title: 'Eternal Awakening',
    images: [
      { src: '/images/eternal_awakening/black_front.jpg' },
      { src: '/images/eternal_awakening/black_back.jpg' }
    ],
    variants: [
      { id: '38164', title: 'Small', price: '4000' }
    ]
  },
  'eternal-collapse': {
    id: '681ac79a1207456e76092f23',
    title: 'Eternal Collapse',
    images: [
      { src: '/images/eternal_collapse/black_front.jpg' },
      { src: '/images/eternal_collapse/black_back.jpg' }
    ],
    variants: [
      { id: '38164', title: 'Small', price: '4000' }
    ]
  }
};

export default function ProductPage({ params }: { params: { productId: string } }) {
  const product = products[params.productId];

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#DADBE4]">
      <div className="container mx-auto px-4 py-8">
        {product.title.toLowerCase().includes('eternal elegance') ? (
          <ProductCustomizer product={product} />
        ) : (
          <ProductViewer product={product} />
        )}
      </div>
    </div>
  );
} 
