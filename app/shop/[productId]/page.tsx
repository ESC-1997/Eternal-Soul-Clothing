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
  'eternal-lotus-(black-&-grey)': {
    id: '681449c6b03bb3ed0c01a685',
    title: 'Eternal Lotus (Black & Grey)',
    images: [
      { src: '/images/eternal_lotus/eternal_lotus_black_front.jpg' },
      { src: '/images/eternal_lotus/eternal_lotus_black_back.jpg' }
    ],
    variants: [
      { id: '38164', title: 'Small', price: '4000' }
    ]
  },
  'eternal-lotus---purple-floral-graphic-tee-': {
    id: '681449c6b03bb3ed0c01a686',
    title: 'Eternal Lotus - Purple Floral Graphic Tee',
    images: [
      { src: '/images/eternal_lotus/eternal_lotus_purple_front.jpg' },
      { src: '/images/eternal_lotus/eternal_lotus_purple_back.jpg' }
    ],
    variants: [
      { id: '38164', title: 'Small', price: '4000' }
    ]
  },
  'vow-of-the-eternal': {
    id: '681ac79a1207456e76092f24',
    title: 'Vow of the Eternal',
    images: [
      { src: '/images/vow_of_the_eternal/black.jpg' },
      { src: '/images/vow_of_the_eternal/black1.jpg' }
    ],
    variants: [
      { id: '38164', title: 'Small', price: '4000' }
    ]
  },
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
  },
  'the-eternal-snap': {
    id: '6828ede2465b246fe50cc776',
    title: 'The Eternal Snap',
    images: [
      { src: '/images/eternal_snap/placeholder_front.jpg' },
      { src: '/images/eternal_snap/placeholder_back.jpg' }
    ],
    variants: [
      { id: '118985', title: 'One size', price: '40' }
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
        {(product.title.toLowerCase().includes('eternal elegance') || product.title.toLowerCase().includes('eternal snap')) ? (
          <ProductCustomizer product={product} />
        ) : (
          <ProductViewer product={product} />
        )}
      </div>
    </div>
  );
} 