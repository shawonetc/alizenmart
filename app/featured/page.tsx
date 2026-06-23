import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Featured Products - Premium Deals & Top Picks | Speed Bazar",
  description: "Shop Speed Bazar's exclusive featured products. Discover premium-quality clothing, high-quality panjabi, embroidery designs, gadgets, and lifestyle items at unbeatable prices in Bangladesh.",
  alternates: {
    canonical: "/featured",
  },
};

import { cacheLife } from "next/cache";

async function getFeaturedProducts() {
  "use cache";
  cacheLife("minutes");
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    if (data && !error) {
      return data;
    }
  } catch (err) {
    console.error("Failed to fetch featured products on server inside cached function:", err);
  }
  return [];
}

export default async function FeaturedProductsPage() {
  const products = await getFeaturedProducts();

  // Fallback static featured products if DB is empty
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

  const featuredList = products.length > 0 ? products : defaultFeatured;

  // Breadcrumbs schema markup
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://speedbazar.com";
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Featured Products",
        "item": `${siteUrl}/featured`
      }
    ]
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": featuredList.length,
    "itemListElement": featuredList.slice(0, 20).map((product, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": product.title,
      "url": `${siteUrl}/product-details/${encodeURIComponent(
        product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u0980-\u09FF-]+/g, '').replace(/-+/g, '-').replace(/(^-|-$)+/g, '')
      )}`
    }))
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <Header />
      
      <main className="flex-1 py-6 md:py-10 pb-20 md:pb-12">
        <div className="container-custom">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6 px-1">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Featured Products</span>
          </div>

          <div className="bg-white rounded-md p-4 md:p-6 shadow-sm border border-gray-100 min-h-[450px] flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-100 pb-4 md:pb-6 mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Featured Products</h1>
              <p className="text-xs md:text-sm text-gray-400 mt-1">
                Explore our handpicked premium products for you
              </p>
            </div>

            {/* Grid list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {featuredList.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  image={product.image}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
