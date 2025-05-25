'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '../../../context/CartContext';
import ShopNavigation from '../../../components/ShopNavigation';

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

export default function EternalShadowPage() {
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        const eternalShadow = products.find((p: any) => 
          p.title.toLowerCase().includes('eternal shadow')
        );

        if (eternalShadow) {
          setProduct({
            id: eternalShadow.id,
            title: eternalShadow.title,
            images: eternalShadow.images.map((img: any) => ({ src: img.src })),
            variants: eternalShadow.variants.map((variant: any) => ({
              id: variant.id,
              title: variant.title,
              price: (variant.price / 100).toFixed(2)
            }))
          });
          if (eternalShadow.variants.length > 0) {
            setSelectedVariant(eternalShadow.variants[0].id);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error || 'Product not found'}
      </div>
    );
  }

  const handleAddToCart = () => {
    const variant = product.variants.find(v => v.id === selectedVariant);
    if (variant) {
      addItem({
        id: product.id,
        name: product.title,
        price: Number(variant.price),
        quantity,
        image: product.images[0].src,
        variantId: Number(variant.id),
        color: 'Black',
        logo: 'Standard',
        size: variant.title
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="max-w-7xl mx-auto relative">
        <ShopNavigation />
        <div className="pt-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-[500px] bg-white rounded-lg overflow-hidden">
                <Image
                  src={product.images[selectedImage].src}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Thumbnail Gallery */}
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex-none w-20 h-20 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-white' : ''
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            {/* Product Details */}
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p className="text-2xl mb-6">$40.00</p>
              
              {/* Variant Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Size</label>
                <select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="w-full bg-white text-black rounded-md p-2"
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-white text-black px-3 py-1 rounded-md"
                  >
                    -
                  </button>
                  <span className="text-xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-white text-black px-3 py-1 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#9F2FFF] text-white py-3 rounded-md hover:bg-[#8A2BE2] transition-colors"
              >
                Add to Cart
              </button>

              {/* Product Description */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                <p className="text-gray-300">
                  Eternal Shadow represents the mysterious and powerful essence of darkness. 
                  This premium garment features a striking design that embodies the eternal 
                  dance between light and shadow, crafted with the highest quality materials 
                  for ultimate comfort and durability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
