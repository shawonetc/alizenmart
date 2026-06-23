import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const queryText = q || "";
  return {
    title: queryText ? `Search results for "${queryText}" | Speed Bazar` : "Search Products | Speed Bazar",
    description: `Search premium clothing, apparel, gadgets, and lifestyle items at Speed Bazar Bangladesh.`,
  };
}

import { cacheLife } from "next/cache";

async function getAllProductsForSearch() {
  "use cache";
  cacheLife("minutes");
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data && !error) {
      return data;
    }
    if (error) {
      throw new Error(error.message);
    }
  } catch (err: any) {
    console.error("Failed to fetch products for search in cached function:", err);
    throw err;
  }
  return [];
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const queryText = (q || "").trim();

  let products: any[] = [];
  let errorMsg: string | null = null;

  if (queryText) {
    try {
      const data = await getAllProductsForSearch();
      const queryLower = queryText.toLowerCase();
      products = data.filter(
        p =>
          p.title?.toLowerCase().includes(queryLower) ||
          p.category?.toLowerCase().includes(queryLower) ||
          p.description?.toLowerCase().includes(queryLower)
      );
    } catch (err: any) {
      errorMsg = err.message || "Failed to search products";
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
      <Header />

      <main className="flex-1 py-6 md:py-10 pb-20 md:pb-12">
        <div className="container-custom">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6 px-1">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Search Results</span>
          </div>

          <div className="bg-white rounded-md p-4 md:p-6 shadow-sm border border-gray-100 min-h-[450px] flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-100 pb-4 md:pb-6 mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                {queryText ? `Search Results for "${queryText}"` : "Search Products"}
              </h1>
              <p className="text-xs md:text-sm text-gray-400 mt-1">
                {products.length} {products.length === 1 ? "product" : "products"} found
              </p>
            </div>

            {/* Error State */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                {errorMsg}
              </div>
            )}

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.title}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    image={product.image}
                  />
                ))}
              </div>
            ) : (
              /* No Results State */
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  {queryText ? "কোনো প্রোডাক্ট খুঁজে পাওয়া যায়নি" : "অনুগ্রহ করে কিছু সার্চ করুন"}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm max-w-sm mb-6 leading-relaxed">
                  {queryText 
                    ? `দুঃখিত, আমাদের স্টোরে "${queryText}" এর সাথে মিলে এমন কোনো প্রোডাক্ট পাওয়া যায়নি। অন্য কিছু লিখে চেষ্টা করুন।`
                    : "আমাদের স্টোরের প্রিমিয়াম প্রোডাক্টগুলো খুঁজে পেতে উপরে সার্চ বক্সে টাইপ করুন।"}
                </p>
                <div className="flex gap-3">
                  <Link href="/" className="bg-[#1a80c2] text-white px-6 py-2 rounded-md text-xs md:text-sm font-bold hover:bg-[#146ba3] transition-colors shadow-sm">
                    হোমপেজে ফিরে যান
                  </Link>
                  <Link href="/categories" className="border border-gray-200 text-gray-600 px-6 py-2 rounded-md text-xs md:text-sm font-bold hover:bg-gray-50 transition-colors">
                    ক্যাটাগরি ব্রাউজ করুন
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
