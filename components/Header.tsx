"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { TruckDeliveryIcon, ShoppingCart01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { supabase } from "@/lib/supabase";

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { totalItems } = useCart();
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchHeaderCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("sort_order", { ascending: true });

        if (data && !error && data.length > 0) {
          setDbCategories(data);
        }
      } catch (err) {
        console.error("Failed to load header categories:", err);
      }
    };
    fetchHeaderCategories();
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const fallbackCategories = [
    { id: "1", name: "Gadgets", slug: "gadgets", parent_id: null },
    { id: "2", name: "Smart Electronics", slug: "smart-electronics", parent_id: null },
    { id: "3", name: "Home & Lifestyle", slug: "home-lifestyle", parent_id: null },
    { id: "4", name: "Beauty & Personal", slug: "beauty-personal", parent_id: null },
    { id: "5", name: "Healthy Food", slug: "healthy-food", parent_id: null },
    { id: "6", name: "Fashion", slug: "fashion", parent_id: null },
    { id: "7", name: "Mom & Baby", slug: "mom-baby", parent_id: null },
    { id: "8", name: "Home & Kitchen", slug: "home-kitchen", parent_id: null },
    { id: "9", name: "Appliances", slug: "appliances", parent_id: null },
    { id: "10", name: "Fitness & Health", slug: "fitness-health", parent_id: null },
  ];

  const activeList = dbCategories.length > 0 ? dbCategories : fallbackCategories;

  // Separate root categories and map children under parents
  const rootCategories = activeList.filter((c) => !c.parent_id);
  const subCategoryMap: Record<string, any[]> = {};
  activeList.forEach((c) => {
    if (c.parent_id) {
      const pId = String(c.parent_id);
      if (!subCategoryMap[pId]) {
        subCategoryMap[pId] = [];
      }
      subCategoryMap[pId].push(c);
    }
  });

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 md:hidden ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      ></div>

      {/* Mobile Drawer */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-white z-[101] shadow-2xl transition-transform duration-300 md:hidden flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <button onClick={() => setIsDrawerOpen(false)} className="text-[#0B5A70] hover:text-[#FF5722] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <Link href="/" className="flex items-center" onClick={() => setIsDrawerOpen(false)}>
            <div className="relative h-8 w-28">
              <Image 
                src="/logo/logo1_sb.png" 
                alt="Speed Bazar Logo" 
                fill
                sizes="112px"
                className="object-contain" 
                priority
              />
            </div>
          </Link>
        </div>

        {/* Drawer Body - Categories */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {rootCategories.map((cat, index) => {
            const subs = subCategoryMap[cat.id] || [];
            const hasSubs = subs.length > 0;
            return (
              <div key={index} className="border-b border-gray-100">
                <Link 
                  href={`/category/${cat.slug}`} 
                  className="flex items-center justify-between p-3.5 hover:bg-gray-50 transition-colors font-semibold"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="text-sm text-gray-800">{cat.name}</span>
                </Link>
                {hasSubs && (
                  <div className="bg-gray-50/50 pl-6 pb-2">
                    {subs.map((sub: any, subIndex: number) => (
                      <Link
                        key={subIndex}
                        href={`/category/${sub.slug}`}
                        className="block py-2 text-xs font-medium text-gray-600 hover:text-[#FF5722]"
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        • {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            All Rights Reserved by Speed Bazar
          </p>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="bg-white border-b border-gray-100 py-2 md:py-3 shadow-sm transition-all duration-300">
        <div className="container-custom flex flex-col gap-3 md:gap-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Icon */}
            <button 
              className="md:hidden text-[#0B5A70] hover:text-[#FF5722] transition-colors"
              onClick={() => setIsDrawerOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 md:flex-none absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0">
              <div className="relative h-8 md:h-10 w-32 md:w-40 flex items-center">
                <Image 
                  src="/logo/logo1_sb.png" 
                  alt="Speed Bazar Logo" 
                  fill
                  sizes="(max-width: 768px) 128px, 160px"
                  className="object-contain object-left md:object-center" 
                  priority 
                />
              </div>
            </Link>

            {/* Search Bar - Desktop Only */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl relative mx-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search product, brand, and more..."
                className="w-full bg-gray-50 border border-[#0B5A70] px-4 py-2 rounded-sm outline-none text-sm pr-12 text-gray-800 placeholder-gray-400 focus:bg-white transition-colors"
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 bg-[#FF5722] hover:bg-[#e64a19] text-white rounded-r-sm flex items-center justify-center transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </form>

            {/* Action Icons */}
            <div className="flex items-center gap-3 md:gap-5 text-[#0B5A70]">
              <Link href="/track-order" className="hidden lg:flex items-center gap-1.5 hover:text-[#FF5722] transition-colors duration-200 text-[13px] font-semibold">
                 <HugeiconsIcon icon={TruckDeliveryIcon} size={20} color="currentColor" strokeWidth={2} />
                 <span>Track Order</span>
              </Link>
              
              <Link href="/checkout" className="relative flex items-center justify-center p-1 hover:text-[#FF5722] transition-colors duration-200">
                <div className="relative">
                  <HugeiconsIcon icon={ShoppingCart01Icon} size={24} color="currentColor" strokeWidth={2} />
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FF5722] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                    {totalItems}
                  </span>
                </div>
                <span className="hidden md:inline ml-2 text-[13px] font-semibold">Cart({totalItems})</span>
              </Link>

              <Link href="/account" className="hidden md:flex items-center gap-1.5 hover:text-[#FF5722] transition-colors duration-200 text-[13px] font-semibold">
                <HugeiconsIcon icon={UserIcon} size={20} color="currentColor" strokeWidth={2} />
                <span>Account</span>
              </Link>
            </div>
          </div>

          {/* Search Bar - Mobile Only */}
          <form onSubmit={handleSearchSubmit} className="md:hidden w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product, brand, and more..."
              className="w-full bg-gray-50 border border-[#0B5A70] px-4 py-2.5 rounded-sm outline-none text-sm pr-12 text-gray-800 placeholder-gray-400 focus:bg-white transition-colors shadow-sm"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 bg-[#FF5722] hover:bg-[#e64a19] text-white rounded-r-sm flex items-center justify-center transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Sub Navigation */}
      <div className="hidden md:block bg-white border-b border-gray-100 shadow-sm overflow-hidden">
        <div className="container-custom max-w-[1000px] overflow-hidden relative py-3 text-[14px] font-bold text-gray-700 select-none">
          <style>{`
            @keyframes marqueeRightToLeft {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-rtl {
              display: flex;
              width: max-content;
              gap: 3rem;
              animation: marqueeRightToLeft 80s linear infinite;
            }
            .animate-marquee-rtl:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="animate-marquee-rtl">
            {/* Set 1 */}
            {rootCategories.map((cat, index) => {
              const subs = subCategoryMap[cat.id] || [];
              const hasSubs = subs.length > 0;

              return (
                <div key={`s1-${cat.id || index}`} className="relative group py-1">
                  <Link 
                    href={`/category/${cat.slug}`} 
                    className="hover:text-[#FF5722] flex items-center gap-1 transition-colors py-1"
                  >
                    <span>{cat.name}</span>
                    {hasSubs && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-gray-400 group-hover:text-[#FF5722] transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    )}
                  </Link>

                  {hasSubs && (
                    <div className="absolute top-full left-0 bg-white border border-gray-100 rounded-xl shadow-xl py-3 px-4 w-max min-w-[180px] max-w-[250px] hidden group-hover:block z-50">
                      <div className="flex flex-col gap-2.5">
                        {subs.map((sub: any, subIndex: number) => (
                          <Link
                            key={subIndex}
                            href={`/category/${sub.slug}`}
                            className="text-xs text-gray-600 hover:text-[#FF5722] font-semibold transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Set 2 (Duplicate for Infinite loop) */}
            {rootCategories.map((cat, index) => {
              const subs = subCategoryMap[cat.id] || [];
              const hasSubs = subs.length > 0;

              return (
                <div key={`s2-${cat.id || index}`} className="relative group py-1">
                  <Link 
                    href={`/category/${cat.slug}`} 
                    className="hover:text-[#FF5722] flex items-center gap-1 transition-colors py-1"
                  >
                    <span>{cat.name}</span>
                    {hasSubs && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-gray-400 group-hover:text-[#FF5722] transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    )}
                  </Link>

                  {hasSubs && (
                    <div className="absolute top-full left-0 bg-white border border-gray-100 rounded-xl shadow-xl py-3 px-4 w-max min-w-[180px] max-w-[250px] hidden group-hover:block z-50">
                      <div className="flex flex-col gap-2.5">
                        {subs.map((sub: any, subIndex: number) => (
                          <Link
                            key={subIndex}
                            href={`/category/${sub.slug}`}
                            className="text-xs text-gray-600 hover:text-[#FF5722] font-semibold transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
