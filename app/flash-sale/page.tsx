import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flash Sale - Limited Time Deals & Discounts | Speed Bazar",
  description: "Shop Speed Bazar's exclusive Flash Sale! Save big on high-quality premium clothing, panjabi, embroidery designs, and lifestyle items with special deals in Bangladesh.",
  alternates: {
    canonical: "/flash-sale",
  },
};

import { cacheLife } from "next/cache";

async function getFlashSaleProducts() {
  "use cache";
  cacheLife("minutes");
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && !error) {
      // Filter products on discount (having an oldPrice > price)
      return data.filter(p => p.oldPrice && p.oldPrice > p.price);
    }
  } catch (err) {
    console.error("Failed to fetch flash sale products on server inside cached function:", err);
  }
  return [];
}

export default async function FlashSalePage() {
  const products = await getFlashSaleProducts();

  // Fallback static flash sale products if DB is empty
  const defaultFlashSale = [
    { id: 1, title: "Airpods Case", price: 160, oldPrice: 180, image: "/airpods_case.png" },
    { id: 2, title: "৭টি গুরুত্বপূর্ণ ইসলামিক বইয়ের কম্বো প্যাকেজ", price: 980, oldPrice: 1755, image: "/islamic_books.png" },
    { id: 3, title: "ঈদ আয়োজনে ১০% ডিসকাউন্টে বাবা/ছেলে ম্যাচিং পাঞ্জাবী", price: 1040, image: "/matching_panjabi.png" },
    { id: 4, title: "বড়দের শীতের আরামদায়ক সফট কাতান কাপড়ে পাঞ্জাবী", price: 1030, image: "/soft_katan_panjabi.png" },
    { id: 5, title: "ছোটদের শীতের আরামদায়ক সফট কাতান কাপড়ে ম্যাচিং-কটি পাঞ্জাবী", price: 1962, oldPrice: 2180, image: "/kids_koti_panjabi.png" },
    { id: 6, title: "বড়দের শীতের আরামদায়ক সফট কাতান কাপড়ে ম্যাচিং-কটি পাঞ্জাবী", price: 2990, oldPrice: 3320, image: "/soft_katan_panjabi.png" },
  ];

  const flashSaleList = products.length > 0 ? products : defaultFlashSale;

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
        "name": "Flash Sale",
        "item": `${siteUrl}/flash-sale`
      }
    ]
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": flashSaleList.length,
    "itemListElement": flashSaleList.slice(0, 20).map((product, idx) => ({
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
            <span className="text-gray-800 font-medium">Flash Sale</span>
          </div>

          <div className="bg-white rounded-md p-4 md:p-6 shadow-sm border border-gray-100 min-h-[450px] flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-100 pb-4 md:pb-6 mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Flash Sale</h1>
              <p className="text-xs md:text-sm text-gray-400 mt-1">
                Grab these limited time discounts before they sell out!
              </p>
            </div>

            {/* Grid list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {flashSaleList.map((product) => (
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
