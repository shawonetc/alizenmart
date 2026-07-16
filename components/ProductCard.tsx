"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBasket01Icon } from "@hugeicons/core-free-icons";

import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  slug?: string;
  priority?: boolean;
}

const ProductCard = ({ title, price, oldPrice, image, slug, priority }: ProductCardProps) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [cartHovered, setCartHovered] = useState(false);

  const handleOrderNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const productData = { title, price, oldPrice, image };
    addToCart(productData);
    router.push("/checkout");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const productData = { title, price, oldPrice, image };
    addToCart(productData);
  };

  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\u0980-\u09FF-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const productSlug = slug || generateSlug(title);

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 group flex flex-col h-full shadow-sm hover:shadow-md transition-shadow relative">
      {/* Absolute Link Overlay for the entire card */}
      <Link href={`/product-details/${productSlug}`} className="absolute inset-0 z-10" aria-label={title} />

      {/* Discount Badge & Image Container */}
      <div className="relative aspect-square overflow-hidden bg-white">
        {oldPrice && (
          <div className="absolute top-2 left-2 z-20 bg-[#1a80c2] text-white text-[10px] md:text-[11px] font-bold px-2.5 py-1.5 rounded-md shadow-sm">
            -{Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF
          </div>
        )}
        <div className="w-full h-full p-4 flex items-center justify-center">
          <Image
            src={image}
            alt={title}
            width={300}
            height={300}
            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
            priority={priority}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 pt-0 flex flex-col items-center flex-1">
        <div className="w-full text-center">
          <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-1 mb-4 w-full group-hover:text-[#FF5722] transition-colors">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-6 justify-center w-full">
          <span className="text-gray-900 font-bold text-base md:text-lg">৳ {price}</span>
          {oldPrice && (
            <span className="text-gray-400 text-xs md:text-sm line-through decoration-gray-400">৳ {oldPrice}</span>
          )}
        </div>

        <div className="mt-auto w-full flex gap-1.5 md:gap-2 relative z-20">
          {/* Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 border border-[#008080] rounded-md md:rounded-lg flex items-center justify-center hover:border-[#FF5722] hover:bg-orange-50 transition-colors bg-white group"
            onMouseEnter={() => setCartHovered(true)}
            onMouseLeave={() => setCartHovered(false)}
          >
            <HugeiconsIcon
              icon={ShoppingBasket01Icon}
              size={20}
              color={cartHovered ? "#FF5722" : "#008080"}
              className="w-4 h-4 md:w-5 md:h-5"
              strokeWidth={1.5}
            />
          </button>

          {/* Order Button */}
          <button
            onClick={handleOrderNow}
            className="flex-1 bg-[#008080] text-white h-8 md:h-10 rounded-md md:rounded-lg text-[10px] md:text-sm font-bold hover:bg-[#FF5722] transition-all active:scale-[0.98] shadow-sm flex items-center justify-center leading-none"
          >
            অর্ডার করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
