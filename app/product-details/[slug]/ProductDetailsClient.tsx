"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useCart } from "@/context/CartContext";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBasket01Icon,
  FavouriteIcon,
  StarIcon,
  ShoppingBag02Icon
} from "@hugeicons/core-free-icons";

interface ProductDetailsClientProps {
  product: {
    title: string;
    price: number;
    oldPrice?: number;
    images: string[];
    category: string;
    tags: string[];
    unit: string;
    description: string;
  };
}

const categories = [
  { name: "Gadgets", icon: "📱", slug: "gadgets" },
  { name: "Smart Electronics", icon: "🔌", slug: "smart-electronics" },
  { name: "Home & Lifestyle", icon: "🛋️", slug: "home-lifestyle" },
  { name: "Beauty & Personal", icon: "💄", slug: "beauty-personal" },
  { name: "Healthy Food", icon: "🥗", slug: "healthy-food" },
];

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [mainImage, setMainImage] = useState(product.images[0] || "/placeholder.png");

  const discountAmount = product.oldPrice ? product.oldPrice - product.price : 0;
  const discountPercent = product.oldPrice ? Math.round((discountAmount / product.oldPrice) * 100) : 0;

  const handleAddToCart = () => {
    addToCart({
      title: product.title,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.images[0]
    });
  };

  const handleOrderNow = () => {
    addToCart({
      title: product.title,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.images[0]
    });
    window.location.href = "/checkout"; // simple redirect
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
      <Header />

      <main className="flex-1 pb-20 md:pb-12 pt-6">
        <div className="container-custom">

          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left and Middle Sections Container */}
            <div className="flex-1 flex flex-col md:flex-row gap-6">

              {/* Left Section (Gallery) */}
              <div className="w-full md:w-[45%] flex gap-3">
                {/* Thumbnails (Hidden on mobile) */}
                <div className="hidden md:flex flex-col gap-2 w-16 md:w-20 shrink-0">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImage(img)}
                      className={`border rounded-lg p-1 transition-colors ${mainImage === img ? 'border-primary' : 'border-gray-200'}`}
                    >
                      <div className="relative aspect-square w-full bg-gray-50 rounded-md overflow-hidden">
                        <Image src={img} alt="Thumbnail" fill className="object-contain p-1" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 relative border border-gray-100 rounded-lg bg-white overflow-hidden shadow-sm aspect-square group cursor-zoom-in">
                  {discountPercent > 0 && (
                    <div className="absolute top-3 left-3 bg-[#e5ffe5] text-[#00b300] text-xs font-bold px-2 py-1 rounded-sm z-10">
                      -{discountPercent}% OFF
                    </div>
                  )}
                  <button className="absolute top-3 right-3 z-10 text-primary">
                    <HugeiconsIcon icon={FavouriteIcon} size={24} color="currentColor" />
                  </button>
                  <Image src={mainImage} alt={product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" priority />
                  {/* Mobile Image Counter Badge */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full md:hidden">
                    1/{product.images.length}
                  </div>
                </div>
              </div>

              {/* Middle Section (Product Info) */}
              <div className="w-full md:w-[55%] flex flex-col pt-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {product.title}
                </h1>

                {/* Ratings */}
                <div className="flex items-center gap-1 mb-4">
                  <div className="flex text-[#ffb000]">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <HugeiconsIcon key={i} icon={StarIcon} size={16} color="currentColor" />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm ml-2">(0 reviews)</span>
                </div>

                {/* Pricing */}
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl font-bold text-[#FF5722]">৳ {product.price}</span>
                  {product.oldPrice && (
                    <div className="flex flex-col">
                      <span className="text-[#ffb000] text-[10px] font-bold">৳ {discountAmount} Off</span>
                      <span className="text-gray-400 text-lg line-through font-medium">৳ {product.oldPrice}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mb-8">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#FF5722] rounded-md overflow-hidden h-11 w-28 shrink-0">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-full flex items-center justify-center text-[#FF5722] hover:bg-orange-50 font-medium"
                    >
                      -
                    </button>
                    <div className="flex-1 h-full flex items-center justify-center font-bold text-[#1a80c2] border-x border-[#FF5722]/30">
                      {quantity}
                    </div>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-8 h-full flex items-center justify-center text-[#FF5722] hover:bg-orange-50 font-medium"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart & Order (Desktop only) */}
                  <div className="hidden md:flex flex-1 gap-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 h-11 bg-[#FF5722] text-white rounded-md font-bold flex items-center justify-center gap-2 hover:bg-[#E64A19] transition-colors text-sm shadow-sm"
                    >
                      <HugeiconsIcon icon={ShoppingBasket01Icon} size={20} color="currentColor" strokeWidth={2} />
                      যোগ করুন
                    </button>

                    <button
                      onClick={handleOrderNow}
                      className="flex-1 h-11 bg-[#1a80c2] text-white rounded-md font-bold flex items-center justify-center gap-2 hover:bg-[#156a9e] transition-colors text-sm shadow-sm"
                    >
                      <HugeiconsIcon icon={ShoppingBasket01Icon} size={20} color="currentColor" strokeWidth={2} />
                      অর্ডার করুন
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-col gap-3 text-sm text-gray-600 mt-2">
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-20">Category:</span>
                    <Link href={`/category/${product.category.toLowerCase()}`} className="text-[#FF5722] hover:underline font-medium">
                      {product.category}
                    </Link>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-20">Tags:</span>
                    <span className="text-[#FF5722] font-medium">{product.tags.join(", ")}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-20">Unit:</span>
                    <span className="text-[#FF5722] font-medium">{product.unit}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Section (Category Sidebar - Hidden on mobile) */}
            <div className="hidden lg:block w-full lg:w-[280px] shrink-0">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Category</h3>
                <div className="flex flex-col">
                  {categories.map((cat, index) => (
                    <Link
                      href={`/category/${cat.slug}`}
                      key={index}
                      className={`flex items-center gap-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors px-2 rounded-lg ${index === categories.length - 1 ? 'border-none' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl shadow-sm border border-gray-100">
                        {cat.icon}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section (Tabs) */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100 p-4 gap-2 md:gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
              {["Description", "Delivery Policy", "Reviews(0)"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-colors shrink-0 ${activeTab === tab
                      ? "border border-[#FF5722] text-[#FF5722]"
                      : "border border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-6 md:p-8 min-h-[250px]">
              {activeTab === "Description" && (
                <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed font-medium font-semibold text-gray-700">
                  {product.description}
                </div>
              )}
              {activeTab === "Delivery Policy" && (
                <div className="text-gray-700 text-sm font-semibold text-gray-700">
                  Standard delivery takes 3-5 business days. Inside Dhaka: 60 BDT, Outside Dhaka: 130 BDT.
                </div>
              )}
              {activeTab === "Reviews(0)" && (
                <div className="text-gray-500 text-sm italic font-semibold text-gray-500">
                  No reviews yet. Be the first to review this product!
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />

      {/* Sticky Bottom Bar for Mobile (Hidden on desktop) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2.5 flex items-center gap-3.5 z-[100] md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-safe-bottom">
        <Link href="/" className="flex flex-col items-center justify-center shrink-0 text-gray-500 active:scale-95 transition-transform px-2">
          <HugeiconsIcon icon={ShoppingBag02Icon} size={22} color="currentColor" />
          <span className="text-[10px] font-bold mt-1 text-gray-600">Store</span>
        </Link>
        <button
          onClick={handleAddToCart}
          className="flex-1 h-11 bg-[#FF5722] text-white rounded-lg font-bold flex items-center justify-center gap-1.5 text-[13px] active:scale-[0.98] transition-transform shadow-sm"
        >
          <HugeiconsIcon icon={ShoppingBasket01Icon} size={16} color="currentColor" strokeWidth={2} />
          যোগ করুন
        </button>
        <button
          onClick={handleOrderNow}
          className="flex-1 h-11 bg-[#1a80c2] text-white rounded-lg font-bold flex items-center justify-center gap-1.5 text-[13px] active:scale-[0.98] transition-transform shadow-sm"
        >
          <HugeiconsIcon icon={ShoppingBasket01Icon} size={16} color="currentColor" strokeWidth={2} />
          অর্ডার করুন
        </button>
      </div>
    </div>
  );
}
