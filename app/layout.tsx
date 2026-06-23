import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://speedbazar.com"),
  title: {
    default: "Speed Bazar - Best Premium Fashion & Lifestyle in Bangladesh",
    template: "%s | Speed Bazar",
  },
  description: "Explore Speed Bazar for premium clothing, high-quality panjabi, embroidery designs, gadgets, smart electronics, home & lifestyle products in Bangladesh.",
  keywords: ["e-commerce", "online shopping", "Bangladesh", "fashion", "lifestyle", "panjabi", "premium clothing", "Speed Bazar"],
  authors: [{ name: "Speed Bazar Team" }],
  creator: "Speed Bazar",
  publisher: "Speed Bazar",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://speedbazar.com",
    siteName: "Speed Bazar",
    title: "Speed Bazar - Best Premium Fashion & Lifestyle in Bangladesh",
    description: "Explore Speed Bazar for premium clothing, high-quality panjabi, embroidery designs, gadgets, and lifestyle items in Bangladesh.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Speed Bazar - Premium Shopping Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Speed Bazar - Best Premium Fashion & Lifestyle in Bangladesh",
    description: "Explore Speed Bazar for premium clothing, high-quality panjabi, embroidery designs, gadgets, and lifestyle items.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

import { CartProvider } from "@/context/CartContext";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <CartProvider>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}
