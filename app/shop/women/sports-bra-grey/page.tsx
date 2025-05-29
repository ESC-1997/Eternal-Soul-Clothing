'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import LoadingScreen from '@/app/components/LoadingScreen';

interface Product {
  id: string;
  title: string;
  description: string;
  images: {
    src: string;
  }[];
  variants: {
    id: string;
    title: string;
    price: number;
    size: string;
    color: string;
    isAvailable: boolean;
  }[];
}

export default function SportsBraGreyPage() {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products from Printify');
        }
        const products = await response.json();
        
        // Find the grey sports bra product
        const foundProduct = products.find((p: any) => 
          p.title.toLowerCase().includes('sports bra') && 
          p.title.toLowerCase().includes('grey')
        );
        
        if (!foundProduct) {
          throw new Error('Grey sports bra product not found');
        }

        // Transform the product data
        const transformedProduct: Product = {
          id: foundProduct.id,
          title: foundProduct.title,
          description: foundProduct.description || 'The Eternal Soul Sports Bra in Grey is designed for maximum comfort and support during your workouts. Featuring a racerback design with adjustable straps and a wide elastic band, this sports bra provides excellent support while maintaining breathability. The moisture-wicking fabric keeps you dry and comfortable during intense workouts, while the seamless construction prevents chafing and irritation. Perfect for high-impact activities and everyday wear.',
          images: foundProduct.images.map((img: any) => ({ 
            src: img.src
          })),
          variants: foundProduct.variants
            .filter((variant: any) => variant.is_enabled)
            .map((variant: any) => {
              // Parse the variant title to extract size
              const size = variant.title.split(' / ')[0];
              return {
                id: variant.id,
                title: variant.title,
                price: Number((variant.price / 100).toFixed(2)),
                size: size || variant.title,
                color: 'Grey',
                isAvailable: variant.is_available
              };
            })
        };

        setProduct(transformedProduct);
        // Set initial selections
        const availableSizes = transformedProduct.variants
          .filter(v => v.isAvailable)
          .map(v => v.size);
        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return;

    try {
      const selectedVariant = product.variants.find(
        v => v.size === selectedSize
      );

      if (!selectedVariant) {
        throw new Error('Selected variant not found');
      }

      addItem({
        id: product.id,
        name: product.title,
        color: 'Grey',
        size: selectedSize,
        price: selectedVariant.price,
        quantity: 1,
        image: product.images[0].src,
        variantId: parseInt(selectedVariant.id),
        logo: 'default'
      });

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  // Helper function to check if a variant is in stock
  const isVariantInStock = (size: string) => {
    if (!product) return false;
    const variant = product.variants.find(v => v.size === size);
    return variant?.isAvailable ?? false;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !product) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error || 'Product not found'}
      </div>
    );
  }

  const uniqueSizes = Array.from(new Set(product.variants.map(v => v.size)));
  const selectedVariant = product.variants.find(
    v => v.size === selectedSize
  );

  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/shop/women"
            className="inline-flex items-center text-white hover:text-gray-300 transition-colors duration-200"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage].src}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-white rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-white' : ''
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={`${product.title} - view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="text-white space-y-6">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-2xl">${selectedVariant?.price}</p>
            
            {/* Size Selection */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Size</h3>
              <div className="grid grid-cols-6 gap-2">
                {uniqueSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!isVariantInStock(size)}
                    className={`px-4 py-2 border rounded-lg ${
                      !isVariantInStock(size)
                        ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                        : selectedSize === size
                        ? 'border-white bg-white text-[#2C2F36]'
                        : 'border-gray-600 hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !isVariantInStock(selectedSize)}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden
                ${!selectedSize || !isVariantInStock(selectedSize)
                  ? 'bg-gray-500 cursor-not-allowed'
                  : addedToCart
                    ? 'bg-green-600 text-white scale-105'
                    : 'bg-white text-[#2C2F36] hover:bg-gray-200'
                }`}
            >
              <span className={`transition-opacity duration-300 ${addedToCart ? 'opacity-0' : 'opacity-100'}`}>
                {!selectedSize || !isVariantInStock(selectedSize)
                  ? 'Select Size'
                  : addedToCart
                    ? 'Added to Cart!'
                    : 'Add to Cart'}
              </span>
              <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                addedToCart ? 'opacity-100' : 'opacity-0'
              }`}>
                <span className="flex items-center gap-2">
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                  Added to Cart!
                </span>
              </span>
            </button>

            {/* Product Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-300">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
