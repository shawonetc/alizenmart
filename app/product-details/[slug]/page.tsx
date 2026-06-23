import { supabase } from "@/lib/supabase";
import ProductDetailsClient from "./ProductDetailsClient";
import type { Metadata } from "next";

// Dummy product list for fallback
const fallbackProducts = [
  { id: 1, title: "Airpods Case", price: 160, oldPrice: 180, image: "/airpods_case.png", category: "Gadgets" },
  { id: 2, title: "৭টি গুরুত্বপূর্ণ ইসলামিক বইয়ের কম্বো প্যাকেজ", price: 980, oldPrice: 1755, image: "/islamic_books.png", category: "Books" },
  { id: 3, title: "ঈদ আয়োজনে ১০% ডিসকাউন্টে বাবা/ছেলে ম্যাচিং পাঞ্জাবী", price: 1040, image: "/matching_panjabi.png", category: "Fashion" },
  { id: 4, title: "বড়দের শীতের আরামদায়ক সফট কাতান কাপড়ে পাঞ্জাবী", price: 1030, image: "/soft_katan_panjabi.png", category: "Fashion" },
  { id: 5, title: "ছোটদের শীতের আরামদায়ক সফট কাতান কাপড়ে ম্যাচিং-কটি পাঞ্জাবী", price: 1962, oldPrice: 2180, image: "/kids_koti_panjabi.png", category: "Fashion" },
  { id: 6, title: "বড়দের শীতের আরামদায়ক সফট কাতান কাপড়ে ম্যাচিং-কটি পাঞ্জাবী", price: 2990, oldPrice: 3320, image: "/soft_katan_panjabi.png", category: "Fashion" },
  { id: 7, title: "প্রিমিয়াম সিজন ফ্রেশ মিক্স খেজুর কম্বো প্যাকেজ", price: 1760, image: "/fresh_dates.png", category: "Healthy Food" },
  { id: 8, title: "আকর্ষণীয় এম্ব্রয়ডারী ডিজাইনের নতুন কালেকশন", price: 690, image: "/embroidery_dress.png", category: "Fashion" },
  { id: 9, title: "প্রিমিয়াম কটন ফেব্রিক পাঞ্জাবী", price: 1380, image: "/soft_katan_panjabi.png", category: "Fashion" },
  { id: 10, title: "কাফ হাতা ডিজাইনে প্রিমিয়াম ব্ল্যাক পাঞ্জাবী", price: 1150, image: "/black_panjabi_cuff.png", category: "Fashion" },
  { id: 11, title: "ফ্যামিলি ম্যাচিং থ্রি পিস/টু-পিস", price: 1490, image: "/family_matching.png", category: "Fashion" },
  { id: 12, title: "প্রিমিয়াম কোয়ালিটির বাবা ছেলের ম্যাচিং পাঞ্জাবী", price: 880, image: "/matching_panjabi.png", category: "Fashion" },
  { id: 13, title: "ফ্যামিলি ম্যাচিং থ্রি পিস এবং পাঞ্জাবি", price: 1520, image: "/family_matching.png", category: "Fashion" },
  { id: 14, title: "ফ্যামিলি ম্যাচিং আধুনিক ডিজাইনে ঈদ কালেকশন", price: 980, image: "/family_matching.png", category: "Fashion" },
  { id: 15, title: "কিউট ও স্টাইলিশ ইয়ারমাফ", price: 250, image: "/earmuffs.png", category: "Fashion" },
  { id: 16, title: "ঈদের আনন্দে বাবা ছেলে একসাথে আকর্ষণীয় ডিজাইনের ম্যাচিং পাঞ্জাবী", price: 980, image: "/matching_panjabi.png", category: "Fashion" }
];

const generateSlug = (str: string) => {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u0980-\u09FF-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

import { cacheLife } from "next/cache";

async function getProductBySlug(slug: string) {
  "use cache";
  cacheLife("minutes");
  const decodedSlug = typeof slug === 'string' ? decodeURIComponent(slug) : '';
  
  try {
    // 1. Try to query database
    const { data: dbProducts } = await supabase
      .from('products')
      .select('*');

    if (dbProducts && dbProducts.length > 0) {
      const matched = dbProducts.find(p => generateSlug(p.title) === decodedSlug);
      if (matched) {
        const mainImg = matched.image || "/placeholder.png";
        return {
          title: matched.title,
          price: matched.price,
          oldPrice: matched.oldPrice,
          images: [mainImg, mainImg, mainImg, mainImg, mainImg],
          category: matched.category || "General",
          tags: ["Featured Products", "Flash Sale"],
          unit: "Pieces",
          description: matched.description || `Buy ${matched.title} online at Speed Bazar. Discover premium quality products with fast delivery in Bangladesh.`,
        };
      }
    }
  } catch (err) {
    console.error("Failed to query products from Supabase on server details:", err);
  }

  // 2. Try static fallbacks
  const matchedFallback = fallbackProducts.find(p => generateSlug(p.title) === decodedSlug);
  const matched = matchedFallback || fallbackProducts[0];
  const fallbackImg = matched.image || "/placeholder.png";
  return {
    title: matched.title,
    price: matched.price,
    oldPrice: matched.oldPrice,
    images: [fallbackImg, fallbackImg, fallbackImg, fallbackImg, fallbackImg],
    category: matched.category,
    tags: ["Featured Products", "Flash Sale"],
    unit: "Pieces",
    description: `Buy ${matched.title} online at Speed Bazar. Discover premium quality clothing and apparel with fast delivery in Bangladesh.`,
  };
}

// Next.js 16 generateMetadata (await params)
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://speedbazar.com";

  return {
    title: `Buy ${product.title} - Price ৳${product.price} | Speed Bazar`,
    description: product.description.substring(0, 155),
    alternates: {
      canonical: `/product-details/${slug}`,
    },
    openGraph: {
      title: `${product.title} | Speed Bazar`,
      description: product.description.substring(0, 155),
      url: `${siteUrl}/product-details/${slug}`,
      type: "website",
      images: [
        {
          url: product.images[0] || "/og-image.png",
          width: 800,
          height: 800,
          alt: product.title,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Speed Bazar`,
      description: product.description.substring(0, 155),
      images: [product.images[0] || "/og-image.png"],
    }
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://speedbazar.com";

  // Inject Product JSON-LD Schema
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.images.map(img => img.startsWith('http') ? img : `${siteUrl}${img}`),
    "description": product.description,
    "sku": `FF-${product.category.substring(0, 3).toUpperCase()}-${generateSlug(product.title).substring(0, 8).toUpperCase()}`,
    "brand": {
      "@type": "Brand",
      "name": "Speed Bazar"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/product-details/${slug}`,
      "priceCurrency": "BDT",
      "price": product.price,
      "priceValidUntil": new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Speed Bazar"
      }
    }
  };

  // Inject Breadcrumb JSON-LD Schema
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
        "name": product.category,
        "item": `${siteUrl}/category/${product.category.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": `${siteUrl}/product-details/${slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailsClient product={product} />
    </>
  );
}
