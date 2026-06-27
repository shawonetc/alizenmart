import { supabase } from "@/lib/supabase";
import CategoryClient from "./CategoryClient";
import type { Metadata } from "next";

async function getCategoryNameFromDb(slug: string) {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("name")
      .eq("slug", slug)
      .single();

    if (data && !error) {
      return data.name;
    }
  } catch (err) {
    console.error("Failed to fetch category name from database:", err);
  }

  // Fallback map
  const slugToNameMap: Record<string, string> = {
    "gadgets": "Gadgets",
    "smart-electronics": "Smart Electronics",
    "home-lifestyle": "Home & Lifestyle",
    "beauty-personal": "Beauty & Personal",
    "healthy-food": "Healthy Food",
    "fashion": "Fashion",
    "mom-baby": "Mom & Baby",
    "home-kitchen": "Home & Kitchen",
    "appliances": "Appliances",
    "fitness-health": "Fitness & Health",
    "smart-watch": "Smart Watch",
    "religious": "Religious",
    "peripherals": "Peripherals",
    "smart-furniture": "Smart Furniture",
    "books": "Books",
    "others": "Others",
  };

  if (slugToNameMap[slug]) return slugToNameMap[slug];
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Dynamic SEO metadata generator for Next.js 16 (using Promise parameters)
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = typeof slug === 'string' ? decodeURIComponent(slug) : "";
  const categoryName = await getCategoryNameFromDb(decodedSlug);

  return {
    title: `${categoryName} - Buy Online at Best Price in Bangladesh`,
    description: `Shop the latest ${categoryName} online at 1stopDokan. Discover premium quality clothing, fashion apparel, and accessories in Bangladesh.`,
    alternates: {
      canonical: `/category/${decodedSlug}`,
    },
    openGraph: {
      title: `${categoryName} | 1stopDokan`,
      description: `Shop the latest ${categoryName} online at 1stopDokan. Discover premium quality clothing and lifestyle items in Bangladesh.`,
      url: `https://1stopdokan.com/category/${decodedSlug}`,
    }
  };
}

import { cacheLife } from "next/cache";

async function getCategoryProducts(categoryName: string) {
  "use cache";
  cacheLife("minutes");
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", categoryName)
      .order("created_at", { ascending: false });

    if (data && !error) {
      return data;
    }
  } catch (err) {
    console.error("Failed to fetch products on server for category inside cached function:", err);
  }
  return [];
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = typeof slug === 'string' ? decodeURIComponent(slug) : "";
  const categoryName = await getCategoryNameFromDb(decodedSlug);

  const products = await getCategoryProducts(categoryName);

  // Schema Markup: ItemList and BreadcrumbList for categories
  const sitemapUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://1stopdokan.com";
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${sitemapUrl}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Categories",
        "item": `${sitemapUrl}/categories`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": `${sitemapUrl}/category/${decodedSlug}`
      }
    ]
  };

  const itemListSchema = products.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": products.length,
    "itemListElement": products.slice(0, 10).map((product, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": product.title,
      "url": `${sitemapUrl}/product-details/${encodeURIComponent(
        product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u0980-\u09FF-]+/g, '').replace(/-+/g, '-').replace(/(^-|-$)+/g, '')
      )}`
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <CategoryClient categoryName={categoryName} initialProducts={products} />
    </>
  );
}
