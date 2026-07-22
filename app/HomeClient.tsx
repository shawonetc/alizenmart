"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import FeaturedCategories from "@/components/FeaturedCategories";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

interface HomeClientProps {
  initialProducts: any[];
  initialSettings: any;
}

export default function HomeClient({ initialProducts, initialSettings }: HomeClientProps) {
  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [loading, setLoading] = useState(initialProducts ? false : true);
  const [settings, setSettings] = useState<any>(initialSettings || null);

  // Load initial cached data from localStorage on mount if server didn't provide it
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedProducts = localStorage.getItem("alizenmart_cached_products");
      const cachedSettings = localStorage.getItem("alizenmart_cached_settings");

      if ((!initialProducts || initialProducts.length === 0) && cachedProducts) {
        try {
          setProducts(JSON.parse(cachedProducts));
          setLoading(false);
        } catch (e) {
          console.error("Failed to parse cached products", e);
        }
      }
      if (!initialSettings && cachedSettings) {
        try {
          setSettings(JSON.parse(cachedSettings));
        } catch (e) {
          console.error("Failed to parse cached settings", e);
        }
      }
    }
  }, [initialProducts, initialSettings]);

  // Save products and settings to localStorage when they change (either from server or client fetch)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (products && products.length > 0) {
        localStorage.setItem("alizenmart_cached_products", JSON.stringify(products));
      }
      if (settings) {
        localStorage.setItem("alizenmart_cached_settings", JSON.stringify(settings));
      }
    }
  }, [products, settings]);

  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      fetchProducts();
    }
    if (!initialSettings) {
      fetchSettings();
    }
  }, [initialProducts, initialSettings]);

  const fetchProducts = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (data && !error) {
        setSettings(data);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  const defaultFlashSale = [
    { id: 1, title: "Airpods Case", price: 160, oldPrice: 180, image: "/airpods_case.png" },
    { id: 2, title: "৭টি গুরুত্বপূর্ণ ইসলামিক বইয়ের কম্বো প্যাকেজ", price: 980, oldPrice: 1755, image: "/islamic_books.png" },
    { id: 3, title: "ঈদ আয়োজনে ১০% ডিসকাউন্টে বাবা/ছেলে ম্যাচিং পাঞ্জাবী", price: 1040, image: "/matching_panjabi.png" },
    { id: 4, title: "বড়দের শীতের আরামদায়ক সফট কাতান কাপড়ে পাঞ্জাবী", price: 1030, image: "/soft_katan_panjabi.png" },
    { id: 5, title: "ছোটদের শীতের আরামদায়ক সফট কাতান কাপড়ে ম্যাচিং-কটি পাঞ্জাবী", price: 1962, oldPrice: 2180, image: "/kids_koti_panjabi.png" },
    { id: 6, title: "বড়দের শীতের আরামদায়ক সফট কাতান কাপড়ে ম্যাচিং-কটি পাঞ্জাবী", price: 2990, oldPrice: 3320, image: "/soft_katan_panjabi.png" },
  ];

  const defaultFeatured = [
    { id: 1, title: "প্রিমিয়াম সিজন ফ্রেশ মিক্স খেজুর কম্বো প্যাকেজ", price: 1760, image: "/fresh_dates.png" },
    { id: 2, title: "আকর্ষণীয় এম্ব্রয়ডারী ডিজাইনের নতুন কালেকশন", price: 690, image: "/embroidery_dress.png" },
    { id: 3, title: "ঈদের আনন্দে বাবা ছেলে একসাথে আকর্ষণীয় ডিজাইনের ম্যাচিং পাঞ্জাবী", price: 980, image: "/matching_panjabi.png" },
    { id: 4, title: "প্রিমিয়াম কটন ফেব্রিক পাঞ্জাবী", price: 1380, image: "/soft_katan_panjabi.png" },
    { id: 5, title: "কাফ হাতা ডিজাইনে প্রিমিয়াম ব্ল্যাক পাঞ্জাবী", price: 1150, image: "/black_panjabi_cuff.png" },
    { id: 6, title: "Airpods Case", price: 160, oldPrice: 180, image: "/airpods_case.png" },
    { id: 7, title: "ফ্যামিলি ম্যাচিং থ্রি পিস/টু-পিস", price: 1490, image: "/family_matching.png" },
    { id: 8, title: "প্রিমিয়াম কোয়ালিটির বাবা ছেলের ম্যাচিং পাঞ্জাবী", price: 880, image: "/matching_panjabi.png" },
    { id: 9, title: "ফ্যামিলি ম্যাচিং থ্রি পিস এবং পাঞ্জাবি", price: 1520, image: "/family_matching.png" },
    { id: 10, title: "ফ্যামিলি ম্যাচিং আধুনিক ডিজাইনে ঈদ কালেকশন", price: 980, image: "/family_matching.png" },
    { id: 11, title: "৭টি গুরুত্বপূর্ণ ইসলামিক বইয়ের কম্বো প্যাকেজ", price: 980, oldPrice: 1755, image: "/islamic_books.png" },
    { id: 12, title: "কিউট ও স্টাইলিশ ইয়ারমাফ", price: 250, image: "/earmuffs.png" },
  ];

  const dbFlashSale = products.filter(p => p.oldPrice && p.oldPrice > p.price);
  const flashSaleProducts = products.length > 0 ? dbFlashSale : defaultFlashSale;

  const dbFeatured = products.filter(p => p.is_featured === true);
  const featuredProducts = products.length > 0 ? dbFeatured : defaultFeatured;

  const SkeletonGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 border border-gray-100 flex flex-col h-full shadow-sm animate-pulse">
          <div className="aspect-square bg-gray-100 rounded-md mb-4" />
          <div className="w-full h-4 bg-gray-100 rounded mb-2" />
          <div className="w-2/3 h-4 bg-gray-100 rounded mb-4" />
          <div className="flex gap-2 mt-auto">
            <div className="w-10 h-10 bg-gray-100 rounded-lg" />
            <div className="flex-1 h-10 bg-gray-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
      <Header />

      <main className="flex-1 pb-20 md:pb-12">
        <Hero
          mainSliders={[
            settings?.hero_main_slider || "/hero_banner_1.png",
            settings?.hero_main_slider_2 || "/hero_banner_1.png",
            settings?.hero_main_slider_3 || "/hero_banner_1.png"
          ]}
          sideBanner1={settings?.hero_side_banner_1}
          sideBanner2={settings?.hero_side_banner_2}
        />

        {/* Flash Sale Section */}
        <section className="container-custom mb-6 md:mb-8">
          <div className="bg-white rounded-md p-3 md:p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 md:mb-6 pb-2 border-b border-gray-100">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">Flash Sale</h2>
              <Link href="/flash-sale" className="text-gray-500 text-xs md:text-sm font-medium hover:text-primary flex items-center gap-1">
                <span>View All</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>
            {loading ? (
              <SkeletonGrid />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {flashSaleProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    title={product.title}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    image={product.image}
                    slug={product.slug}
                    priority={index < 5}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <FeaturedCategories />

        {/* Campaigns Banner */}
        <section className="container-custom mb-6 md:mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A80C2] via-[#2392d7] to-[#0f679e] p-6 md:p-8 text-white shadow-xl hover:shadow-[0_20px_50px_rgba(26,128,194,0.3)] transition-all duration-500 group">
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-white/10 blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 rounded-full bg-white/10 blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 z-10">
              
              {/* Content text */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wider uppercase mb-3 animate-pulse border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  Limited Time Offer
                </div>
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tight mb-2 bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent drop-shadow-sm">
                  MEGA CAMPAIGN
                </h2>
                <p className="text-sm md:text-xl font-medium text-white/95 leading-relaxed">
                  Enjoy up to <span className="font-bold text-yellow-300 underline decoration-wavy decoration-2">80% discount</span> on all products!
                </p>
              </div>

              {/* Action and Tag */}
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                
                {/* Floating Tag */}
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-yellow-300 text-gray-900 font-extrabold text-sm uppercase tracking-tight shadow-lg border-4 border-white rotate-[-6deg] group-hover:rotate-[6deg] group-hover:scale-105 transition-all duration-500 shrink-0">
                  <div className="text-center leading-none">
                    <span className="block text-[11px] font-medium opacity-80 uppercase">Up To</span>
                    <span className="block text-2xl font-black">80%</span>
                    <span className="block text-[10px] font-bold">OFF</span>
                  </div>
                  {/* Tag shadow glow */}
                  <div className="absolute -inset-1 rounded-full bg-yellow-300/30 blur opacity-70 group-hover:opacity-100 transition-opacity -z-10" />
                </div>

                {/* Button */}
                <Link href="/flash-sale" className="bg-white text-gray-950 px-8 py-3.5 rounded-xl text-sm md:text-base font-bold shadow-lg hover:shadow-xl hover:bg-yellow-300 hover:text-gray-900 group-hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 shrink-0">
                  <span>Shop Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>

              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="container-custom">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Featured Products</h2>
            <Link href="/featured" className="text-gray-500 text-xs md:text-sm font-medium hover:text-primary flex items-center gap-1">
              <span>View All</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
          {loading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  image={product.image}
                  slug={product.slug}
                  priority={index < 5}
                />
              ))}
            </div>
          )}
          <div className="flex justify-center mt-8 md:mt-10">
            <button className="border border-[#1a80c2] text-[#1a80c2] px-10 md:px-12 py-2 md:py-2.5 rounded-sm font-bold hover:bg-[#1a80c2] hover:text-white transition-colors uppercase text-[12px] md:text-sm tracking-wide">
              Load More
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
