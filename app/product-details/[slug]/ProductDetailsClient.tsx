"use client";

import { useState, useEffect, useMemo } from "react";
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
    id?: string | number;
    title: string;
    price: number;
    oldPrice?: number;
    images: string[];
    category: string;
    tags: string[];
    unit: string;
    description: string;
    metadata?: any;
    videoUrl?: string;
    stock?: number;
  };
}



const getColorHex = (colorName: string) => {
  const name = colorName.toLowerCase().trim();
  const map: Record<string, string> = {
    black: "#1e1e1e",
    white: "#ffffff",
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    orange: "#ff5722",
    yellow: "#eab308",
    purple: "#a855f7",
    pink: "#ec4899",
    gray: "#6b7280",
    grey: "#6b7280",
    brown: "#78350f",
    navy: "#1e3a8a",
    gold: "#d97706",
    silver: "#cbd5e1",
  };
  return map[name] || null;
};

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart } = useCart();

  const hasVariants = product.metadata?.hasVariants && (
    (product.metadata.colors && product.metadata.colors.length > 0) ||
    (product.metadata.sizes && product.metadata.sizes.length > 0)
  );

  // State management
  const [selectedColor, setSelectedColor] = useState<string>(
    hasVariants && product.metadata.colors?.length > 0 ? product.metadata.colors[0].name : ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    hasVariants && product.metadata.sizes?.length > 0 ? product.metadata.sizes[0] : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");

  // Determine active images gallery
  const activeGallery = useMemo(() => {
    if (hasVariants && selectedColor && product.metadata.colors?.length > 0) {
      const colorObj = product.metadata.colors.find((c: any) => c.name === selectedColor);
      if (colorObj?.images && colorObj.images.length > 0) {
        return colorObj.images;
      }
    }
    return product.images && product.images.length > 0 ? product.images : ["/placeholder.png"];
  }, [hasVariants, selectedColor, product.images, product.metadata]);

  // Unified list of media (video first, then images)
  const mediaItems = useMemo(() => {
    const items: { type: "image" | "video"; url: string }[] = [];
    if (product.videoUrl) {
      items.push({ type: "video", url: product.videoUrl });
    }
    activeGallery.forEach((img: string) => {
      items.push({ type: "image", url: img });
    });
    return items;
  }, [activeGallery, product.videoUrl]);

  const [selectedMedia, setSelectedMedia] = useState<{ type: "image" | "video"; url: string }>(
    mediaItems[0] || { type: "image", url: "/placeholder.png" }
  );

  // Synchronize selected media when gallery/media items update
  useEffect(() => {
    setSelectedMedia(mediaItems[0] || { type: "image", url: "/placeholder.png" });
  }, [mediaItems]);

  // Look up current active variant item (combination)
  const currentVariant = useMemo(() => {
    if (!hasVariants) return null;
    return product.metadata.variants?.find(
      (v: any) => {
        const matchColor = selectedColor ? v.color === selectedColor : (!v.color || v.color === "");
        const matchSize = selectedSize ? v.size === selectedSize : (!v.size || v.size === "");
        return matchColor && matchSize;
      }
    ) || null;
  }, [hasVariants, selectedColor, selectedSize, product.metadata]);

  // Pricing, SKU, Stock, Out of Stock
  const displayPrice = currentVariant ? currentVariant.price : product.price;
  const displayOldPrice = currentVariant ? currentVariant.oldPrice : product.oldPrice;
  const displaySku = currentVariant ? currentVariant.sku : null;
  const isOutOfStock = hasVariants
    ? (currentVariant ? currentVariant.stock <= 0 : (product.stock !== undefined ? product.stock <= 0 : true))
    : (product.stock !== undefined ? product.stock <= 0 : true);

  const discountAmount = displayOldPrice ? displayOldPrice - displayPrice : 0;
  const discountPercent = displayOldPrice ? Math.round((discountAmount / displayOldPrice) * 100) : 0;

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    // Find first size for the new color that has stock
    if (product.metadata.variants) {
      const availableVariant = product.metadata.variants.find(
        (v: any) => v.color === colorName && v.stock > 0
      );
      if (availableVariant) {
        setSelectedSize(availableVariant.size);
      } else {
        const firstSize = product.metadata.variants.find((v: any) => v.color === colorName);
        if (firstSize) {
          setSelectedSize(firstSize.size);
        }
      }
    }
  };

  const isColorOutOfStock = (colorName: string) => {
    if (!product.metadata.variants) return false;
    const colorVariants = product.metadata.variants.filter((v: any) => v.color === colorName);
    return colorVariants.length > 0 && colorVariants.every((v: any) => v.stock <= 0);
  };

  const isSizeOutOfStockForSelectedColor = (sizeName: string) => {
    if (!product.metadata.variants) return false;
    const v = product.metadata.variants.find(
      (v: any) => v.color === selectedColor && v.size === sizeName
    );
    return v ? v.stock <= 0 : true;
  };

  const handleAddToCart = () => {
    const cartItemId = hasVariants
      ? `${product.id || "product"}-${selectedColor}-${selectedSize}`
      : String(product.id || "product");

    addToCart({
      id: cartItemId,
      title: product.title,
      price: displayPrice,
      oldPrice: displayOldPrice,
      image: activeGallery[0] || "/placeholder.png",
      color: selectedColor || null,
      size: selectedSize || null,
      sku: displaySku || null,
      quantity: quantity
    });
  };

  const handleOrderNow = () => {
    const cartItemId = hasVariants
      ? `${product.id || "product"}-${selectedColor}-${selectedSize}`
      : String(product.id || "product");

    addToCart({
      id: cartItemId,
      title: product.title,
      price: displayPrice,
      oldPrice: displayOldPrice,
      image: activeGallery[0] || "/placeholder.png",
      color: selectedColor || null,
      size: selectedSize || null,
      sku: displaySku || null,
      quantity: quantity
    });
    window.location.href = "/checkout"; // simple redirect
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
      <Header />

      <main className="flex-1 pb-20 md:pb-12 pt-6">
        <div className="container-custom">

          {/* Left and Middle Sections Container */}
          <div className="flex flex-col md:flex-row items-start gap-6">

            {/* Left Section (Gallery) */}
            <div className="w-full md:w-[45%] flex flex-col md:flex-row items-start gap-3">
              {/* Thumbnails (Hidden on mobile) */}
              <div className="hidden md:flex flex-col gap-2 w-16 md:w-20 shrink-0">
                {mediaItems.map((item, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMedia(item)}
                    className={`border rounded-lg p-1 transition-colors relative ${selectedMedia.url === item.url ? 'border-primary' : 'border-gray-200'}`}
                  >
                    <div className="relative aspect-square w-full bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
                      {item.type === "video" ? (
                        <>
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
                            <span className="text-xl">▶️</span>
                          </div>
                          <video src={item.url} className="object-contain w-full h-full p-1" muted playsInline />
                        </>
                      ) : (
                        <Image src={item.url} alt="Thumbnail" fill className="object-contain p-1" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Main Image/Video Container */}
              <div className="w-full flex-1">
                <div className="relative border border-gray-100 rounded-lg bg-white overflow-hidden shadow-sm aspect-square group w-full">
                  {discountPercent > 0 && (
                    <div className="absolute top-3 left-3 bg-[#e5ffe5] text-[#00b300] text-xs font-bold px-2 py-1 rounded-sm z-10">
                      -{discountPercent}% OFF
                    </div>
                  )}
                  <button className="absolute top-3 right-3 z-10 text-primary">
                    <HugeiconsIcon icon={FavouriteIcon} size={24} color="currentColor" />
                  </button>

                  {selectedMedia.type === "video" ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                      <video
                        src={selectedMedia.url}
                        controls
                        autoPlay
                        muted
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <Image
                      src={selectedMedia.url}
                      alt={product.title}
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
                      priority
                    />
                  )}

                  {/* Mobile Image Counter Badge */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full md:hidden">
                    1/{mediaItems.length}
                  </div>
                </div>

                {/* Horizontal Thumbnails (Visible only on mobile) */}
                <div className="flex md:hidden gap-2 overflow-x-auto py-2 w-full mt-2 scrollbar-none">
                  {mediaItems.map((item, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedMedia(item)}
                      className={`border rounded-lg p-1 transition-colors shrink-0 w-14 h-14 relative ${selectedMedia.url === item.url ? 'border-primary' : 'border-gray-200'}`}
                    >
                      <div className="relative w-full h-full bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
                        {item.type === "video" ? (
                          <>
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
                              <span className="text-sm">▶️</span>
                            </div>
                            <video src={item.url} className="object-contain w-full h-full p-0.5" muted playsInline />
                          </>
                        ) : (
                          <Image src={item.url} alt="Thumbnail" fill className="object-contain p-0.5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Middle Section (Product Info) */}
            <div className="w-full md:w-[55%] flex flex-col pt-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {product.title}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-1 mb-2">
                <div className="flex text-[#ffb000]">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <HugeiconsIcon key={i} icon={StarIcon} size={16} color="currentColor" />
                  ))}
                </div>
                <span className="text-gray-800 text-xs font-bold ml-2">4.8</span>
                <span className="text-gray-400 text-xs ml-1">(12 reviews)</span>
              </div>

              {/* Stock Status Badge */}
              <div className="flex items-center gap-2 mb-4">
                {isOutOfStock ? (
                  <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100 flex items-center gap-1.5 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    স্টক আউট (Out of Stock)
                  </span>
                ) : (
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1.5 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    স্টকে আছে (In Stock) - {hasVariants && currentVariant ? `${currentVariant.stock} টি অবশিষ্ট` : `${(product as any).stock || 0} টি অবশিষ্ট`}
                  </span>
                )}
              </div>

              {/* Pricing */}
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-[#FF5722]">৳ {displayPrice}</span>
                {displayOldPrice && displayOldPrice > displayPrice && (
                  <div className="flex flex-col">
                    <span className="text-[#ffb000] text-[10px] font-bold">৳ {displayOldPrice - displayPrice} Off</span>
                    <span className="text-gray-400 text-lg line-through font-medium">৳ {displayOldPrice}</span>
                  </div>
                )}
                {displaySku && (
                  <span className="text-xs text-gray-400 font-mono ml-auto bg-gray-50 border border-gray-150 rounded px-2 py-0.5 font-semibold">SKU: {displaySku}</span>
                )}
              </div>

              {/* Product Variants Selection Swatches */}
              {hasVariants && (
                <div className="space-y-5 mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  {/* Colors */}
                  {product.metadata.colors && product.metadata.colors.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span>Color</span>
                        <span className="text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 font-extrabold">{selectedColor}</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {product.metadata.colors.map((color: any, idx: number) => {
                          const isOut = isColorOutOfStock(color.name);
                          const hex = getColorHex(color.name);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleColorSelect(color.name)}
                              className={`relative w-9 h-9 rounded-full border-2 transition-all active:scale-95 flex items-center justify-center ${selectedColor === color.name
                                  ? "border-[#FF5722] ring-2 ring-[#FF5722]/20"
                                  : "border-gray-200 hover:border-gray-300"
                                } ${isOut ? "opacity-40" : ""}`}
                              style={{ backgroundColor: hex || "#f3f4f6" }}
                              title={color.name}
                            >
                              {!hex && (
                                <span className="text-[9px] font-bold text-gray-700 leading-none truncate px-0.5">
                                  {color.name.substring(0, 3)}
                                </span>
                              )}
                              {selectedColor === color.name && (
                                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/10">
                                  <svg className={`w-4 h-4 ${color.name.toLowerCase() === 'white' ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sizes */}
                  {product.metadata.sizes && product.metadata.sizes.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span>Size</span>
                        <span className="text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 font-extrabold">{selectedSize}</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {product.metadata.sizes.map((size: string, idx: number) => {
                          const isOut = isSizeOutOfStockForSelectedColor(size);
                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={isOut}
                              onClick={() => setSelectedSize(size)}
                              className={`min-w-[44px] h-10 px-3 text-xs font-bold rounded-lg border-2 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:line-through disabled:decoration-red-500 ${selectedSize === size
                                  ? "border-[#FF5722] bg-orange-50/50 text-[#FF5722] font-black"
                                  : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white font-bold"
                                }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                    disabled={isOutOfStock}
                    className="flex-1 h-11 bg-[#FF5722] text-white rounded-md font-bold flex items-center justify-center gap-2 hover:bg-[#E64A19] transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HugeiconsIcon icon={ShoppingBasket01Icon} size={20} color="currentColor" strokeWidth={2} />
                    {isOutOfStock ? "স্টক আউট" : "যোগ করুন"}
                  </button>

                  <button
                    onClick={handleOrderNow}
                    disabled={isOutOfStock}
                    className="flex-1 h-11 bg-[#1a80c2] text-white rounded-md font-bold flex items-center justify-center gap-2 hover:bg-[#156a9e] transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HugeiconsIcon icon={ShoppingBasket01Icon} size={20} color="currentColor" strokeWidth={2} />
                    {isOutOfStock ? "স্টক আউট" : "অর্ডার করুন"}
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

              {/* Delivery Information */}
              <div className="mt-6 border-t border-gray-150 pt-5 space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Delivery Information / ডেলিভারি বিবরণ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-xl">🛵</span>
                    <div>
                      <p className="font-bold text-gray-700">Inside Dhaka (ঢাকা সিটি)</p>
                      <p className="text-gray-400 font-semibold mt-0.5">1 - 2 Days (৳ ৬০)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-xl">🚚</span>
                    <div>
                      <p className="font-bold text-gray-700">Outside Dhaka (সারাদেশ)</p>
                      <p className="text-gray-400 font-semibold mt-0.5">3 - 5 Days (৳ ১২০)</p>
                    </div>
                  </div>
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
                  Standard delivery takes 3-5 business days. Inside Dhaka: 60 BDT, Outside Dhaka: 120 BDT.
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
          disabled={isOutOfStock}
          className="flex-1 h-11 bg-[#FF5722] text-white rounded-lg font-bold flex items-center justify-center gap-1.5 text-[13px] active:scale-[0.98] transition-transform shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HugeiconsIcon icon={ShoppingBasket01Icon} size={16} color="currentColor" strokeWidth={2} />
          {isOutOfStock ? "স্টক আউট" : "যোগ করুন"}
        </button>
        <button
          onClick={handleOrderNow}
          disabled={isOutOfStock}
          className="flex-1 h-11 bg-[#1a80c2] text-white rounded-lg font-bold flex items-center justify-center gap-1.5 text-[13px] active:scale-[0.98] transition-transform shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HugeiconsIcon icon={ShoppingBasket01Icon} size={16} color="currentColor" strokeWidth={2} />
          {isOutOfStock ? "স্টক আউট" : "অর্ডার করুন"}
        </button>
      </div>
    </div>
  );
}
