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
            settings?.hero_main_slider || "/images/hero/speedbazar.jpeg",
            settings?.hero_main_slider_2 || "/images/hero/speedbazar.jpeg",
            settings?.hero_main_slider_3 || "/images/hero/speedbazar.jpeg"
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
          <div className="relative h-32 md:h-40 rounded-lg md:rounded-md overflow-hidden bg-[#1a80c2] flex items-center justify-center text-white px-4">
            <div className="text-center">
              <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2 italic uppercase tracking-tighter">MEGA CAMPAIGN</h2>
              <p className="text-xs md:text-lg opacity-90">Enjoy up to 80% discount on all products!</p>
              <button className="mt-3 md:mt-4 bg-white text-[#1a80c2] px-6 md:px-8 py-1.5 md:py-2 rounded-full text-xs md:text-base font-bold hover:shadow-lg transition-shadow">Shop Now</button>
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
