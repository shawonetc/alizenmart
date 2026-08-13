import { cacheLife } from "next/cache";
import { supabase } from "@/lib/supabase";
import HomeClient from "../HomeClient";

// Metadata for homepage
export const metadata = {
  title: "1Stop Dokan – আপনার দৈনন্দিন কেনাকাটার একমাত্র ঠিকানা!",
  description: "Explore 1stopDokan for premium clothing, high-quality panjabi, embroidery designs, gadgets, smart electronics, home & lifestyle products in Bangladesh.",
};

// Server-side cached query with "use cache" directive
async function getCachedHomeData() {
  "use cache";
  cacheLife("minutes");

  try {
    // Parallel Server-side fetching from Supabase
    const [productsResult, settingsResult] = await Promise.all([
      supabase
        .from('products')
        .select('id, title, price, oldPrice, image, is_featured, slug, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single()
    ]);

    return {
      products: productsResult.data || [],
      settings: settingsResult.data || null
    };
  } catch (err) {
    console.error("Error fetching homepage data on server inside cached function:", err);
    return { products: [], settings: null };
  }
}

export default async function Home() {
  const { products, settings } = await getCachedHomeData();

  // Structured schemas for Organization and WebSite
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "1stopDokan",
      "url": "https://1stopdokan.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://1stopdokan.com/categories?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "1stopDokan",
      "url": "https://1stopdokan.com",
      "logo": "https://1stopdokan.com/favicon.ico",
      "sameAs": [
        "https://www.facebook.com/fabricofashion"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+8801534694518",
        "contactType": "customer service"
      }
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient initialProducts={products} initialSettings={settings} />
    </>
  );
}
