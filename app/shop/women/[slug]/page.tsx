'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

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
    size: string;
    color: string;
  }[];
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Color to image index mapping
  const colorImageMap: { [key: string]: number } = {
    'Black': 0,
    'Peach': 2,
    'Military Green': 4,
    'Storm': 6
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/printify/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products from Printify');
        }
        const products = await response.json();
        
        // Find the specific product by ID
        const foundProduct = products.find((p: any) => p.id === params.slug);
        
        if (!foundProduct) {
          throw new Error('Product not found');
        }

        // Debug: Log the complete raw product data
        console.log('Complete raw product data:', foundProduct);

        // Transform the product data and parse variants
        const transformedProduct: Product = {
          id: foundProduct.id,
          title: foundProduct.title,
          images: foundProduct.images.map((img: any) => ({ 
            src: img.src
          })),
          variants: foundProduct.variants.map((variant: any) => {
            // Parse the variant title to extract size and color
            const [size, color] = variant.title.split(' / ');
            return {
              id: variant.id,
              title: variant.title,
              price: (variant.price / 100).toFixed(2),
              size: size || variant.title,
              color: color || variant.title
            };
          })
        };

        // Debug: Log the transformed product data
        console.log('Transformed product data:', {
          title: transformedProduct.title,
          images: transformedProduct.images,
          variants: transformedProduct.variants
        });

        setProduct(transformedProduct);
        // Set initial selections
        const uniqueSizes = Array.from(new Set(transformedProduct.variants.map(v => v.size)));
        const uniqueColors = Array.from(new Set(transformedProduct.variants.map(v => v.color)));
        setSelectedSize(uniqueSizes[0]);
        setSelectedColor(uniqueColors[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  // Update selected image when color changes
  useEffect(() => {
    if (product && selectedColor) {
      // Debug: Log the color matching attempt
      console.log('Attempting to match color:', {
        selectedColor,
        colorImageMap,
        mappedIndex: colorImageMap[selectedColor]
      });

      // Get the image index from our mapping
      const imageIndex = colorImageMap[selectedColor];
      
      // If we have a mapping for this color, use it
      if (typeof imageIndex === 'number' && imageIndex < product.images.length) {
        setSelectedImage(imageIndex);
        
        // Debug: Log the image change
        console.log('Image change:', {
          selectedColor,
          imageIndex,
          newImage: product.images[imageIndex]
        });
      }
    }
  }, [selectedColor, product]);

  // Get the selected variant based on size and color
  const selectedVariant = product?.variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;

    const selectedVariant = product.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );

    if (!selectedVariant) return;

    setIsAddingToCart(true);
    setAddedToCart(true);
    
    try {
      addItem({
        id: product.id,
        name: product.title,
        color: selectedColor,
        logo: 'default',
        size: selectedSize,
        price: parseFloat(selectedVariant.price),
        quantity: 1,
        image: product.images[selectedImage].src,
        variantId: parseInt(selectedVariant.id)
      });

      // Reset the success state after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2C2F36] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#2C2F36] flex items-center justify-center">
        <h1 className="text-white text-2xl">{error || 'Product not found'}</h1>
      </div>
    );
  }

  // Get unique sizes and colors
  const uniqueSizes = Array.from(new Set(product.variants.map(v => v.size)));
  const uniqueColors = Array.from(new Set(product.variants.map(v => v.color)));

  return (
    <main className="min-h-screen bg-[#2C2F36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link 
            href="/shop/women" 
            className="inline-flex items-center text-white hover:text-gray-300 text-sm sm:text-base"
          >
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2" 
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

        {/* Navigation - More compact on mobile */}
        <nav className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-8 text-sm sm:text-base">
          <Link href="/shop" className="text-white hover:text-gray-300">Shop All</Link>
          <Link href="/shop/mens" className="text-white hover:text-gray-300">Mens</Link>
          <Link href="/shop/women" className="text-white hover:text-gray-300">Women's</Link>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Product Images - Full width on mobile */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage].src}
                alt={`${product.title} - ${selectedColor}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            {/* Thumbnail gallery - Scrollable on mobile */}
            <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-16 sm:w-20 aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-white' : ''
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={`${product.title} - View ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 64px, 80px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info - Stacked on mobile */}
          <div className="text-white space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold">{product.title}</h1>
            <p className="text-xl sm:text-2xl">${selectedVariant?.price}</p>
            
            {/* Size Selection - Grid layout for better mobile spacing */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-semibold">Size</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {uniqueSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-2 sm:px-4 py-2 text-sm sm:text-base border rounded-lg ${
                      selectedSize === size
                        ? 'border-white bg-white text-[#2C2F36]'
                        : 'border-gray-600 hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection - Grid layout for better mobile spacing */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-semibold">Color</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {uniqueColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-2 sm:px-4 py-2 text-sm sm:text-base border rounded-lg ${
                      selectedColor === color
                        ? 'border-white bg-white text-[#2C2F36]'
                        : 'border-gray-600 hover:border-white'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button - Full width on mobile */}
            <button 
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor || isAddingToCart}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden
                ${!selectedSize || !selectedColor || isAddingToCart
                  ? 'bg-gray-500 cursor-not-allowed'
                  : addedToCart
                    ? 'bg-green-600 text-white scale-105'
                    : 'bg-white text-[#2C2F36] hover:bg-gray-200'
                }`}
            >
              <span className={`transition-opacity duration-300 ${addedToCart ? 'opacity-0' : 'opacity-100'}`}>
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
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

            {/* Product Description - Adjusted text size for mobile */}
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Description</h3>
              <p className="text-sm sm:text-base text-gray-300">
                The Eternal Ascension Women's Cropped Hoodie is a modern take on classic comfort. 
                Featuring a cropped silhouette and premium materials, this hoodie combines style 
                with functionality. Perfect for everyday wear or as a statement piece in your 
                collection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 