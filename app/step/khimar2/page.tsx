"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCart01Icon,
  FeatherIcon,
  Shirt01Icon,
  Settings01Icon,
  SparklesIcon,
  ArrowRight02Icon,
  CallIcon,
  Tick01Icon,
  Leaf01Icon,
  Agreement01Icon,
  Location01Icon,
  CreditCardIcon,
  ShoppingBag01Icon,
  TruckDeliveryIcon,
  CustomerSupportIcon,
  CrownIcon,
  Shield01Icon,
  Award01Icon
} from "@hugeicons/core-free-icons";
import ScrollReveal from "@/components/ScrollReveal";

// T-Shirt Product Variants (Combo options based on the folders under /images/products/)
const TSHIRT_VARIANTS = [
  {
    id: "cod-01",
    name: "Cod 01 Combo",
    code: "Cod 01",
    images: [
      "/images/products/Cod 01/WhatsApp Image 2026-06-19 at 11.50.01 PM (1).jpeg",
      "/images/products/Cod 01/WhatsApp Image 2026-06-19 at 11.50.01 PM.jpeg"
    ]
  },
  {
    id: "cod-03",
    name: "Cod 03 Combo",
    code: "Cod 03",
    images: [
      "/images/products/Cod 03/WhatsApp Image 2026-06-19 at 11.50.03 PM (1).jpeg",
      "/images/products/Cod 03/WhatsApp Image 2026-06-19 at 11.50.03 PM.jpeg"
    ]
  },
  {
    id: "cod-04",
    name: "Cod 04 Combo",
    code: "Cod 04",
    images: [
      "/images/products/Cod 04/WhatsApp Image 2026-06-19 at 11.50.05 PM.jpeg",
      "/images/products/Cod 04/WhatsApp Image 2026-06-19 at 11.50.06 PM.jpeg"
    ]
  },
  {
    id: "code-05",
    name: "Code 05 Combo",
    code: "Code 05",
    images: [
      "/images/products/Code 05/WhatsApp Image 2026-06-19 at 11.50.02 PM (1).jpeg",
      "/images/products/Code 05/WhatsApp Image 2026-06-19 at 11.50.02 PM.jpeg"
    ]
  },
  {
    id: "cod-06",
    name: "Cod 06 Combo",
    code: "Cod 06",
    images: [
      "/images/products/Cod 06/WhatsApp Image 2026-06-19 at 11.50.04 PM (1).jpeg",
      "/images/products/Cod 06/WhatsApp Image 2026-06-19 at 11.50.04 PM.jpeg",
      "/images/products/Cod 06/WhatsApp Image 2026-06-19 at 11.50.05 PM (1).jpeg",
      "/images/products/Cod 06/WhatsApp Image 2026-06-19 at 11.50.05 PM.jpeg"
    ]
  },
  {
    id: "cod-07",
    name: "Cod 07 Combo",
    code: "Cod 07",
    images: [
      "/images/products/Cod 07/WhatsApp Image 2026-06-19 at 11.50.02 PM.jpeg",
      "/images/products/Cod 07/WhatsApp Image 2026-06-19 at 11.50.03 PM.jpeg"
    ]
  }
];

const TSHIRT_SIZES = [
  { id: "M", name: "M (Chest 38, Length 27)" },
  { id: "L", name: "L (Chest 40, Length 28)" },
  { id: "XL", name: "XL (Chest 42, Length 29)" },
  { id: "2XL", name: "2XL (Chest 44, Length 30)" },
];

interface TShirtCardProps {
  variant: typeof TSHIRT_VARIANTS[0];
  isSelected: boolean;
  onSelect: (variant: typeof TSHIRT_VARIANTS[0]) => void;
}

function TShirtCard({ variant, isSelected, onSelect }: TShirtCardProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-slide for this card
  useEffect(() => {
    if (variant.images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % variant.images.length);
    }, 4500 + Math.random() * 1000); // stagger slightly so they don't slide simultaneously
    return () => clearInterval(timer);
  }, [variant]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % variant.images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + variant.images.length) % variant.images.length);
  };

  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all p-4 flex flex-col gap-4 relative shadow-sm hover:shadow-md h-full ${
        isSelected ? "border-[#FF5722] bg-[#FF5722]/5" : "border-slate-200"
      }`}
    >
      {/* Badge Code */}
      <span className="absolute top-4 left-4 bg-[#0B5A70] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
        Code: {variant.code}
      </span>

      {/* Tick Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 bg-[#FF5722] text-white rounded-full p-1 shadow flex items-center justify-center z-10">
          <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={3} />
        </div>
      )}

      {/* Main image viewer for the card */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-100 group">
        
        {/* Images slider */}
        <div className="absolute inset-0">
          {variant.images.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                activeIdx === idx ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={img}
                alt={`${variant.name} - ${idx}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* Left/Right Control Arrows */}
        {variant.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/30 hover:bg-slate-900/60 text-white flex items-center justify-center transition-all duration-200 z-20 shadow-md cursor-pointer border border-white/10 active:scale-95 opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/30 hover:bg-slate-900/60 text-white flex items-center justify-center transition-all duration-200 z-20 shadow-md cursor-pointer border border-white/10 active:scale-95 opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Sub-thumbnails (interactive row) */}
      <div className="flex gap-2 justify-center">
        {variant.images.map((img, imgIdx) => (
          <button
            key={imgIdx}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIdx(imgIdx);
            }}
            className={`w-10 h-12 rounded border overflow-hidden relative transition-all cursor-pointer ${
              activeIdx === imgIdx ? "border-[#FF5722] scale-105" : "border-slate-200 hover:border-slate-350"
            }`}
          >
            <Image src={img} alt={`Thumb ${imgIdx}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      <div>
        <h3 className="font-extrabold text-[#0B5A70] text-base md:text-lg">{variant.name}</h3>
        <div className="flex justify-center items-baseline gap-2 mt-1">
          <span className="text-[#FF5722] font-black text-lg">৳১,৪৫০</span>
          <span className="text-xs text-slate-400 line-through">৳১,৮০০</span>
        </div>
      </div>

      <button
        onClick={() => onSelect(variant)}
        className={`w-full py-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
          isSelected
            ? "bg-[#FF5722] hover:bg-[#e64a19] text-white border-transparent"
            : "bg-[#0B5A70]/10 hover:bg-[#0B5A70]/20 text-[#0B5A70] border-transparent"
        }`}
      >
        {isSelected ? "অর্ডার ফর্মে সিলেক্ট করা আছে" : "কম্বোটি নির্বাচন করুন"}
      </button>
    </div>
  );
}

export default function KhimarLandingPage() {
  const router = useRouter();

  // Checkout Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("outside"); // "inside" | "outside"
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" | "bkash" | "nagad" | "rocket"
  const [bkashNumber, setBkashNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Selected Product Configuration
  const [selectedVariants, setSelectedVariants] = useState<typeof TSHIRT_VARIANTS>([TSHIRT_VARIANTS[0]]);
  const [activeShowcaseVariant, setActiveShowcaseVariant] = useState<typeof TSHIRT_VARIANTS[0]>(TSHIRT_VARIANTS[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<typeof TSHIRT_SIZES>([TSHIRT_SIZES[1]]); // Default L
  const [quantity, setQuantity] = useState(1);

  const toggleSize = (size: typeof TSHIRT_SIZES[0]) => {
    if (selectedSizes.some((s) => s.id === size.id)) {
      setSelectedSizes(selectedSizes.filter((s) => s.id !== size.id));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  // Error Modal State
  const [errorModal, setErrorModal] = useState({ show: false, message: "", title: "সতর্কতা" });

  const showError = (message: string, title: string = "সতর্কতা") => {
    setErrorModal({ show: true, message, title });
  };

  // Refs for smooth scroll target
  const orderFormRef = useRef<HTMLDivElement>(null);

  // Reset active image index when active showcase variant changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeShowcaseVariant]);

  // Auto-slide for product showcase images
  useEffect(() => {
    if (activeShowcaseVariant.images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % activeShowcaseVariant.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeShowcaseVariant]);

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % activeShowcaseVariant.images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + activeShowcaseVariant.images.length) % activeShowcaseVariant.images.length);
  };

  // Check if user is logged in
  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setFullName(user.user_metadata?.full_name || "");
          setPhone(user.user_metadata?.mobile_number || "");
          setAddress(user.user_metadata?.address || "");
        }
      } catch (e) {
        console.warn("Could not load user data", e);
      }
    };
    getUserData();
  }, []);

  // Price Calculations
  const unitPrice = 1450;
  const oldUnitPrice = 1800;
  const totalQuantity = quantity * selectedSizes.length * selectedVariants.length;
  const subtotal = unitPrice * totalQuantity;
  const deliveryCharge = deliveryOption === "inside" ? 70 : 130;

  // Free delivery for 2 or more combos!
  const isFreeDelivery = totalQuantity >= 2;
  const finalDeliveryCharge = isFreeDelivery ? 0 : deliveryCharge;
  const total = subtotal + finalDeliveryCharge;

  // Scroll to Order Form
  const scrollToOrderForm = () => {
    orderFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Toggle variant selector click
  const toggleVariant = (variant: typeof TSHIRT_VARIANTS[0]) => {
    setSelectedVariants(prev => {
      const exists = prev.some(v => v.id === variant.id);
      if (exists) {
        if (prev.length <= 1) {
          showError("অবশ্যই অন্তত একটি কম্বো সিলেক্ট থাকতে হবে।");
          return prev;
        }
        return prev.filter(v => v.id !== variant.id);
      } else {
        return [...prev, variant];
      }
    });
    setActiveShowcaseVariant(variant);
  };

  // Submit Order Handler
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      showError("অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা পূরণ করুন।");
      return;
    }

    // Clean all non-digit characters
    let cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length === 13 && cleanedPhone.startsWith("88")) {
      cleanedPhone = cleanedPhone.substring(2);
    }

    if (cleanedPhone.length !== 11 || !cleanedPhone.startsWith("01")) {
      showError("মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে (যেমন: 01XXXXXXXXX)।");
      return;
    }

    if (selectedSizes.length === 0) {
      showError("অনুগ্রহ করে অন্তত একটি সাইজ নির্বাচন করুন।");
      return;
    }

    if (paymentMethod !== "cod") {
      if (!bkashNumber.trim() || !transactionId.trim()) {
        showError("পেমেন্ট ভেরিফাই করার জন্য অনুগ্রহ করে আপনার পেমেন্ট নম্বর এবং ট্রানজেকশন আইডি প্রদান করুন।");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

      // Build order details matching the database schema
      const orderPayload = {
        user_id: user?.id || null,
        customer_name: fullName,
        phone: cleanedPhone,
        address: address,
        total: total,
        total_amount: total,
        status: "Pending",
        payment_method: paymentMethod,
        bkash_number: paymentMethod !== "cod" ? bkashNumber : null,
        transaction_id: paymentMethod !== "cod" ? transactionId : null,
        notes: `T-Shirt Combo Codes: ${selectedVariants.map(v => v.code).join(", ")} | Sizes: ${selectedSizes.map(sz => sz.name.split(" ")[0]).join(", ")} | ${orderNote}` +
          (paymentMethod !== "cod" && paymentMethod !== "bkash" ? ` [${paymentMethod.toUpperCase()} Pay: ${bkashNumber}, TrxID: ${transactionId}]` : ""),
        items: selectedVariants.flatMap(variant => 
          selectedSizes.map(sz => ({
            id: `khimar-${variant.id}-${sz.id}`,
            title: `প্রিমিয়াম চায়না ফেব্রিক্স টি-শার্ট কম্বো - ${variant.code} (Size: ${sz.name.split(" ")[0]})`,
            price: unitPrice,
            quantity: quantity,
            image: variant.images[0]
          }))
        ),
      };

      let finalOrderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      let isInserted = false;

      try {
        // Create a 2.5 second timeout promise
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Supabase request timeout")), 2500)
        );

        // Perform Supabase insert with timeout
        const { data, error } = await Promise.race([
          supabase.from("orders").insert([orderPayload]).select(),
          timeoutPromise
        ]) as any;

        if (error) {
          console.warn("Supabase order insert failed with error response, falling back:", error);
        } else if (data && data[0]) {
          finalOrderId = String(data[0].id).substring(0, 8).toUpperCase();
          isInserted = true;
        }
      } catch (dbErr: any) {
        console.warn("Supabase order insert timed out or threw exception, falling back:", dbErr);
      }

      if (!isInserted) {
        // Fallback to local storage order tracking
        const localOrder = {
          id: finalOrderId,
          ...orderPayload,
          created_at: new Date().toISOString()
        };

        const existingLocalOrders = JSON.parse(localStorage.getItem("local_orders") || "[]");
        existingLocalOrders.unshift(localOrder);
        localStorage.setItem("local_orders", JSON.stringify(existingLocalOrders));
      }

      setPlacedOrderId(finalOrderId);
      setShowSuccessModal(true);

      // Reset form
      setFullName("");
      setPhone("");
      setAddress("");
      setOrderNote("");
      setBkashNumber("");
      setTransactionId("");
      setQuantity(1);

    } catch (err: any) {
      console.error("Critical order placement failure:", err);
      showError(`অর্ডার করতে সমস্যা হয়েছে: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Top Banner */}
      <div className="bg-[#0B5A70] text-white text-center py-2.5 px-4 font-bold text-xs md:text-sm tracking-wide shadow-md flex items-center justify-center gap-2 relative overflow-hidden">
        <span className="bg-[#FF5722] text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold animate-pulse">ধামাকা অফার</span>
        <span>২ বা তার বেশি কম্বো অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি! প্রিমিয়াম টি-শার্ট কম্বো মাত্র ১৪৫০ টাকা!</span>
      </div>

      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-100 py-4 sticky top-0 z-40 backdrop-blur-md bg-white/95 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-12 md:h-14 w-12 md:w-14">
              <Image 
                src="/logo/logo3.jpeg" 
                alt="1stopDokan Logo" 
                fill 
                sizes="(max-width: 768px) 48px, 56px"
                className="object-contain object-left" 
                priority 
              />
            </div>
          </Link>
          <button
            onClick={scrollToOrderForm}
            className="bg-[#FF5722] hover:bg-[#e64a19] text-white px-6 py-2.5 rounded-full font-bold text-xs md:text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <HugeiconsIcon icon={ShoppingCart01Icon} size={18} strokeWidth={2.5} /> এখনই অর্ডার করুন
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-10 md:py-16 bg-gradient-to-br from-white via-slate-50 to-[#0B5A70]/5 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0B5A70]/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF5722]/5 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Content */}
            <ScrollReveal animation="fade-right" duration={800} delay={100} className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 bg-[#0B5A70]/10 border border-[#0B5A70]/20 text-[#0B5A70] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                👑 PREMIUM CHINA FABRIC T-SHIRT
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0B5A70] leading-tight">
                কেন আমাদের টি-শার্টগুলো <br />
                <span className="text-[#FF5722]">সাধারণ লোকাল টি-শার্ট থেকে আলাদা?</span>
              </h1>
              <p className="text-sm md:text-base text-slate-650/80 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                হাই-কোয়ালিটি ইম্পোর্টেড চায়না ফেব্রিক্স কাপড়ে তৈরি আমাদের টি-শার্টগুলো আপনাকে দেবে রাজকীয় আরাম ও এলিট লুক। সহজে কুঁচকে যায় না, গরমে অত্যন্ত আরামদায়ক এবং সফট ফেব্রিক্সের নিশ্চয়তা।
              </p>

              {/* Price Tag */}
              <div className="flex items-center justify-center lg:justify-start gap-4 py-2">
                <span className="text-4xl font-extrabold text-[#FF5722]">৳১,৪৫০</span>
                <span className="text-xl text-slate-400 line-through">৳১,৮০০</span>
                <span className="bg-[#FF5722]/10 border border-[#FF5722]/20 text-[#FF5722] text-xs px-2.5 py-1 rounded-md font-bold">
                  ৳৩৫০ ডিসকাউন্ট
                </span>
              </div>

              {/* Highlight Features list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#FF5722] flex items-center justify-center mt-1">
                    <HugeiconsIcon icon={FeatherIcon} size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0B5A70]">প্রিমিয়াম মেটেরিয়াল</p>
                    <p className="text-xs text-slate-500 mt-0.5">আমরা ব্যবহার করেছি হাই-কোয়ালিটি ইম্পোর্টেড চায়না ফেব্রিক্স, যা সাধারণ কাপড়ের চেয়ে অনেক বেশি প্রিমিয়াম, রিঙ্কলেস (সহজে কুঁচকে যায় না) এবং সফট।</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#FF5722] flex items-center justify-center mt-1">
                    <HugeiconsIcon icon={Shield01Icon} size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0B5A70]">পারফেক্ট স্টিচিং ও ফিনিশিং</p>
                    <p className="text-xs text-slate-500 mt-0.5">প্রতিটি জয়েন্ট এবং সুইং নিখুঁতভাবে করা, যা আপনাকে দেবে একটি এলিট লুক।</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#FF5722] flex items-center justify-center mt-1">
                    <HugeiconsIcon icon={Award01Icon} size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0B5A70]">সব জায়গায় মানানসই</p>
                    <p className="text-xs text-slate-500 mt-0.5">ফ্রেন্ডদের আড্ডা, ট্রাভেলিং কিংবা ক্যাজুয়াল যেকোনো গেট-টুগেদারে পরার জন্য এটি একদম পারফেক্ট।</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-[#FF5722] flex items-center justify-center mt-1">
                    <HugeiconsIcon icon={Settings01Icon} size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0B5A70]">টাকার সঠিক মূল্যায়ন (Value for Money)</p>
                    <p className="text-xs text-slate-500 mt-0.5">আমরা অতিরিক্ত ব্র্যান্ড ভ্যালুর নামে কাস্টমারদের থেকে অতিরিক্ত টাকা নিই না। কোয়ালিটি অনুযায়ী সঠিক ও সাশ্রয়ী মূল্য নিশ্চিত করি।</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={scrollToOrderForm}
                  className="w-full sm:w-auto bg-[#FF5722] hover:bg-[#e64a19] text-white px-8 py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-[1.03] active:scale-95 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>অর্ডার করতে এখানে ক্লিক করুন</span>
                  <HugeiconsIcon icon={ArrowRight02Icon} size={20} className="group-hover:translate-x-1 transition-transform stroke-[3]" />
                </button>
                <div className="text-slate-500 font-bold text-sm flex items-center gap-1.5">
                  <HugeiconsIcon icon={CallIcon} size={18} className="text-[#0B5A70]" />
                  <span>হটলাইন: <a href="tel:01534694518" className="text-[#0B5A70] hover:text-[#FF5722] transition-colors">01534694518</a></span>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Showcase Image Viewer */}
            <ScrollReveal animation="fade-left" duration={900} delay={200} className="lg:col-span-5 relative flex flex-col gap-4">
              <div className="relative aspect-[3/4] w-full max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 group">
                
                {/* Image Slider Wrapper */}
                <div className="absolute inset-0">
                  {activeShowcaseVariant.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        activeImageIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${activeShowcaseVariant.name} - ${idx}`}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        priority={idx === 0}
                      />
                    </div>
                  ))}
                </div>

                {/* Left/Right Control Arrows */}
                {activeShowcaseVariant.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/30 hover:bg-slate-900/65 text-white flex items-center justify-center transition-all duration-200 z-20 shadow-md cursor-pointer border border-white/10 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/30 hover:bg-slate-900/65 text-white flex items-center justify-center transition-all duration-200 z-20 shadow-md cursor-pointer border border-white/10 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10 pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 flex flex-col gap-1 z-20 pointer-events-none">
                  <span className="bg-[#FF5722] text-white px-3 py-1 rounded-full text-xs font-bold uppercase inline-block w-fit shadow">Combo Promo</span>
                  <p className="text-white font-extrabold text-lg">{activeShowcaseVariant.name}</p>
                </div>
              </div>

              {/* Image thumbnail list inside variant */}
              <div className="flex justify-center gap-2.5">
                {activeShowcaseVariant.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-18 rounded-lg border-2 overflow-hidden relative transition-all ${
                      activeImageIndex === idx ? "border-[#FF5722] scale-105 shadow-md" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Risk-Free Shopping Guarantee Section */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="bg-[#0B5A70]/5 rounded-3xl p-6 md:p-10 border border-[#0B5A70]/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <ScrollReveal animation="fade-right" duration={800} className="w-full">
              <div>
                <span className="bg-[#FF5722] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  ১০০% রিস্ক-ফ্রি শপিং গ্যারান্টি
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B5A70] mt-3">
                  দেখে পেমেন্ট করার নিশ্চিন্ত সুযোগ!
                </h2>
                <p className="text-slate-600 text-sm md:text-base mt-3 leading-relaxed">
                  অনলাইনে শপিং মানেই অনেকেই দুশ্চিন্তায় থাকেন—ছবির সাথে মিল থাকবে তো? আমাদের সাথে শপিংয়ে এই চিন্তা একদম বাদ দিন!
                </p>
                
                <ul className="space-y-3.5 mt-5 font-bold text-[#0B5A70] text-sm">
                  <li className="flex items-start gap-2">
                    <div className="bg-[#FF5722]/10 text-[#FF5722] rounded-full p-0.5 mt-0.5">
                      <HugeiconsIcon icon={Tick01Icon} size={16} strokeWidth={3} />
                    </div>
                    <span>দেখে নেওয়ার সুযোগ: ডেলিভারি ম্যানের সামনে প্রোডাক্টটি লাইভ দেখে, ফেব্রিক্স চেক করে পছন্দ হলে তারপর টাকা পে করবেন।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-[#FF5722]/10 text-[#FF5722] rounded-full p-0.5 mt-0.5">
                      <HugeiconsIcon icon={Tick01Icon} size={16} strokeWidth={3} />
                    </div>
                    <span>সাইজ এক্সচেঞ্জ সুবিধা: সাইজ ছোট-বড় হলে কোনো চিন্তা নেই! আমাদের সাথে যোগাযোগ করলে দ্রুত সাইজ চেঞ্জ করে দেওয়া হবে।</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left" duration={800} delay={150} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2 text-center md:text-left">
                <div className="w-10 h-10 rounded-xl bg-[#0B5A70]/10 text-[#0B5A70] flex items-center justify-center mx-auto md:mx-0">
                  <HugeiconsIcon icon={Shield01Icon} size={22} />
                </div>
                <h3 className="font-bold text-[#0B5A70] text-sm md:text-base">দেখে নেওয়ার সুযোগ</h3>
                <p className="text-xs text-slate-500 leading-relaxed">ডেলিভারি ম্যানের সামনে প্রোডাক্টটি লাইভ দেখে, ফেব্রিক্স চেক করে পছন্দ হলে তারপর টাকা পে করবেন।</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2 text-center md:text-left">
                <div className="w-10 h-10 rounded-xl bg-[#0B5A70]/10 text-[#0B5A70] flex items-center justify-center mx-auto md:mx-0">
                  <HugeiconsIcon icon={Agreement01Icon} size={22} />
                </div>
                <h3 className="font-bold text-[#0B5A70] text-sm md:text-base">সাইজ এক্সচেঞ্জ সুবিধা</h3>
                <p className="text-xs text-slate-500 leading-relaxed">সাইজ ছোট-বড় হলে কোনো চিন্তা নেই! আমাদের সাথে যোগাযোগ করলে দ্রুত সাইজ চেঞ্জ করে দেওয়া হবে।</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Product Variants Catalog Grid */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <ScrollReveal animation="fade-up" duration={700}>
            <span className="text-[#0B5A70] font-extrabold text-xs uppercase tracking-wider bg-[#0B5A70]/10 px-3 py-1 rounded-full">
              T-Shirt Combo Codes
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B5A70] mt-3">
              আপনার পছন্দের টি-শার্ট কম্বো নির্বাচন করুন
            </h2>
            <p className="text-slate-500 font-medium text-xs md:text-sm mt-1 max-w-md mx-auto mb-10 md:mb-14">
              নিচের যেকোনো কোড সিলেক্ট করুন এবং এখনই অফার প্রাইসে নিজের টি-শার্ট সংগ্রহ করুন।
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TSHIRT_VARIANTS.map((variant, index) => {
              const isSelected = selectedVariants.some(v => v.id === variant.id);
              return (
                <ScrollReveal
                  key={variant.id}
                  animation="fade-up"
                  duration={750}
                  delay={(index % 3) * 100}
                >
                  <TShirtCard
                    variant={variant}
                    isSelected={isSelected}
                    onSelect={toggleVariant}
                  />
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Size Guide Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[700px] mx-auto px-4 text-center">
          <ScrollReveal animation="fade-up" duration={700}>
            <span className="text-[#FF5722] font-extrabold text-xs uppercase tracking-wider bg-[#FF5722]/10 px-3 py-1 rounded-full">
              Size Guide
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B5A70] mt-3">
              টি-শার্ট সাইজ গাইড
            </h2>
            <p className="text-slate-500 font-medium text-xs md:text-sm mt-1 mb-8">
              অর্ডার করার আগে আপনার উপযুক্ত সাইজটি দেখে নিন।
            </p>
          </ScrollReveal>

          <ScrollReveal animation="zoom-in" duration={800} delay={150}>
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[#0B5A70]">
                    <th className="py-3 px-4 text-xs md:text-sm font-black uppercase">সাইজ (Size)</th>
                    <th className="py-3 px-4 text-xs md:text-sm font-black uppercase">বুক (Chest)</th>
                    <th className="py-3 px-4 text-xs md:text-sm font-black uppercase">লম্বা (Length)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-650 text-xs md:text-sm">
                  <tr className="border-b border-slate-100 hover:bg-slate-100/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0B5A70]">M</td>
                    <td className="py-3.5 px-4">৩৮ ইঞ্চি</td>
                    <td className="py-3.5 px-4">২৭ ইঞ্চি</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-100/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0B5A70]">L</td>
                    <td className="py-3.5 px-4">৪০ ইঞ্চি</td>
                    <td className="py-3.5 px-4">২৮ ইঞ্চি</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-100/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0B5A70]">XL</td>
                    <td className="py-3.5 px-4">৪২ ইঞ্চি</td>
                    <td className="py-3.5 px-4">২৯ ইঞ্চি</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-100/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0B5A70]">2XL</td>
                    <td className="py-3.5 px-4">৪৪ ইঞ্চি</td>
                    <td className="py-3.5 px-4">৩০ ইঞ্চি</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 p-3 bg-[#0B5A70]/5 rounded-xl text-[11px] text-[#0B5A70] font-bold text-center leading-relaxed">
                💡 নোট: আমাদের টি-শার্টগুলো স্ট্যান্ডার্ড সাইজে তৈরি, যা আপনাকে দেবে কমফোর্টেবল ও স্টাইলিশ ফিটিং।
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Checkout Form & Order Summary */}
      <section ref={orderFormRef} className="py-12 md:py-20 bg-white border-t border-slate-100 scroll-mt-24">
        <div className="max-w-[1100px] mx-auto px-4">
          <ScrollReveal animation="fade-up" duration={700}>
            <div className="text-center max-w-xl mx-auto mb-10 md:mb-14">
              <span className="bg-[#0B5A70]/10 border border-[#0B5A70]/20 text-[#0B5A70] text-xs font-bold px-3.5 py-1 rounded-full uppercase">
                Order Form
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B5A70] mt-2">
                অর্ডার সম্পন্ন করতে নিচের ফর্মটি পূরণ করুন
              </h2>
              <p className="text-slate-500 font-medium text-xs md:text-sm mt-1">
                সঠিক নাম, মোবাইল নম্বর এবং ঠিকানা লিখুন। প্যাকেট খুলে প্রোডাক্ট কোয়ালিটি দেখে পেমেন্ট করার সুযোগ রয়েছে।
              </p>
            </div>
          </ScrollReveal>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Shipping Address & Payment */}
            <ScrollReveal animation="fade-right" duration={800} className="lg:col-span-7 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-base md:text-lg font-bold text-[#0B5A70] border-b border-slate-200 pb-3 mb-5 flex items-center gap-2">
                  <HugeiconsIcon icon={Location01Icon} size={20} className="text-[#FF5722]" /> ডেলিভারির ঠিকানা (Billing & Shipping)
                </h3>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs md:text-sm font-bold text-slate-650">সম্পূর্ণ নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-[#0B5A70] focus:ring-1 focus:ring-[#0B5A70] transition-all text-slate-800"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs md:text-sm font-bold text-slate-650">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      placeholder="১১ ডিজিটের মোবাইল নম্বর"
                      value={phone}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, "");
                        if (val.startsWith("8801")) {
                          val = val.substring(2);
                        }
                        setPhone(val.slice(0, 11));
                      }}
                      className={`w-full bg-white border rounded-xl p-3.5 text-sm outline-none transition-all text-slate-800 ${
                        phone && (phone.length !== 11 || !phone.startsWith("01"))
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-200 focus:border-[#0B5A70]"
                      }`}
                    />
                    {phone && (phone.length !== 11 || !phone.startsWith("01")) && (
                      <p className="text-[10px] text-red-500 font-semibold mt-1">
                        সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 01XXXXXXXXX)।
                      </p>
                    )}
                  </div>

                  {/* Full Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs md:text-sm font-bold text-slate-650">সম্পূর্ণ ঠিকানা * (বাসা নং, রোড, থানা, জেলা)</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="বাসা নং, রোড নং, থানা, জেলা সহ সম্পূর্ণ ঠিকানা লিখুন"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-[#0B5A70] focus:ring-1 focus:ring-[#0B5A70] transition-all text-slate-800 resize-none"
                    ></textarea>
                  </div>

                  {/* Order Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs md:text-sm font-bold text-slate-500">অর্ডারের অতিরিক্ত নোট (ঐচ্ছিক)</label>
                    <textarea
                      rows={2}
                      placeholder="যেমন: কোনো বিশেষ রোড বা ডেলিভারি নির্দেশনা থাকলে লিখুন"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-[#0B5A70] focus:ring-1 focus:ring-[#0B5A70] transition-all text-slate-800 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-base md:text-lg font-bold text-[#0B5A70] mb-4 flex items-center gap-2">
                  <HugeiconsIcon icon={CreditCardIcon} size={20} className="text-[#FF5722]" /> একটি পেমেন্ট পদ্ধতি নির্বাচন করুন
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === "cod" ? "border-[#FF5722] bg-[#FF5722]/5 font-bold" : "border-slate-250 hover:border-slate-350"
                    }`}
                  >
                    <HugeiconsIcon icon={Agreement01Icon} size={24} className="mb-1 text-[#FF5722]" />
                    <span className="text-[11px] text-slate-700">ক্যাশ অন ডেলিভারি</span>
                  </button>

                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === "bkash" ? "border-pink-500 bg-pink-50/20 font-bold" : "border-slate-250 hover:border-slate-350"
                    }`}
                  >
                    <div className="w-10 h-6 relative mb-1">
                      <Image src="/bkash_logo.png" alt="bKash" fill className="object-contain" />
                    </div>
                    <span className="text-[11px] text-slate-700">বিকাশ (Bkash)</span>
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === "nagad" ? "border-orange-500 bg-orange-50/20 font-bold" : "border-slate-250 hover:border-slate-350"
                    }`}
                  >
                    <div className="w-10 h-6 relative mb-1">
                      <Image src="/nagad_logo.png" alt="Nagad" fill className="object-contain" />
                    </div>
                    <span className="text-[11px] text-slate-700">নগদ (Nagad)</span>
                  </button>

                  {/* Rocket */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("rocket")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === "rocket" ? "border-purple-650 bg-purple-50/20 font-bold" : "border-slate-250 hover:border-slate-350"
                    }`}
                  >
                    <div className="w-10 h-6 relative mb-1">
                      <Image src="/rocket_logo.png" alt="Rocket" fill className="object-contain" />
                    </div>
                    <span className="text-[11px] text-slate-700">রকেট (Rocket)</span>
                  </button>
                </div>

                {/* Bkash / Nagad / Rocket transaction details */}
                {paymentMethod !== "cod" && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 mt-5 space-y-4 text-xs md:text-sm shadow-inner">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {paymentMethod.toUpperCase()} Personal Number
                        </p>
                        <p className="text-sm font-extrabold text-[#0B5A70] mt-0.5">01534694518</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2.5 py-0.5 rounded">Active</span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      👉 অনুগ্রহ করে প্রথমে আপনার বিকাশ/নগদ/রকেট একাউন্ট থেকে উপরে দেওয়া নাম্বারে <span className="text-[#FF5722] font-bold">৳{total}</span> সেন্ড মানি করুন। তারপর পেমেন্ট নাম্বার ও ট্রানজেকশন আইডি নিচে দিয়ে ফর্মটি সাবমিট করুন।
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Sender Payment Number */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">যে নাম্বার থেকে টাকা পাঠিয়েছেন *</label>
                        <input
                          type="text"
                          required
                          placeholder="01XXXXXXXXX"
                          value={bkashNumber}
                          onChange={(e) => setBkashNumber(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-[#0B5A70] text-slate-800"
                        />
                      </div>

                      {/* Transaction ID */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">পেমেন্ট ট্রানজেকশন আইডি (TrxID) *</label>
                        <input
                          type="text"
                          required
                          placeholder="TrxID (যেমন: 9J83K2L4)"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-[#0B5A70] text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Right Column: Order Details & Pricing */}
            <ScrollReveal animation="fade-left" duration={800} delay={150} className="lg:col-span-5 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 lg:sticky lg:top-28">
              <h3 className="text-base md:text-lg font-bold text-[#0B5A70] border-b border-slate-200 pb-3 flex items-center gap-2">
                <HugeiconsIcon icon={ShoppingBag01Icon} size={20} className="text-[#FF5722]" /> অর্ডারের বিবরণ (Your Order)
              </h3>

              <div className="space-y-4">
                {/* Product Info Rows for selected combos */}
                <div className="space-y-3 pb-4 border-b border-slate-200">
                  <h4 className="text-xs font-bold text-slate-550 uppercase tracking-wider">নির্বাচিত কম্বো সমূহ:</h4>
                  {selectedVariants.map((variant) => (
                    <div key={variant.id} className="flex gap-3 items-center bg-white p-2.5 rounded-xl border border-slate-150 relative">
                      <div className="w-10 h-12 bg-slate-50 rounded-lg overflow-hidden relative flex-shrink-0">
                        <Image src={variant.images[0]} alt={variant.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-[#0B5A70] text-xs md:text-sm truncate">
                          {variant.name}
                        </h5>
                        <p className="text-[10px] font-bold text-[#FF5722]">
                          কোড: {variant.code}
                        </p>
                      </div>
                      {selectedVariants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => toggleVariant(variant)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="বাদ দিন"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Quantity Adjustment Selector */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-slate-500 font-bold">পরিমাণ (প্রতিটির জন্য):</span>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 py-1 text-slate-500 hover:bg-slate-50 font-extrabold text-sm cursor-pointer select-none"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-bold text-xs text-slate-800 bg-white border-x border-slate-150 min-w-[24px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 py-1 text-slate-500 hover:bg-slate-50 font-extrabold text-sm cursor-pointer select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="py-2 space-y-2">
                  <h4 className="text-xs font-bold text-slate-650 uppercase tracking-wider">সাইজ নির্বাচন করুন * (এক বা একাধিক সিলেক্ট করতে পারেন)</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {TSHIRT_SIZES.map((sz) => {
                      const isSzSelected = selectedSizes.some((s) => s.id === sz.id);
                      return (
                        <button
                          key={sz.id}
                          type="button"
                          onClick={() => toggleSize(sz)}
                          className={`py-3 px-1 text-xs font-black rounded-lg border text-center transition-all cursor-pointer relative ${
                            isSzSelected
                              ? "border-[#FF5722] bg-[#FF5722]/10 text-[#FF5722] font-extrabold shadow-sm"
                              : "border-slate-200 bg-white text-slate-650 hover:border-slate-350"
                          }`}
                        >
                          {sz.name.split(" ")[0]}
                          {isSzSelected && (
                            <span className="absolute -top-1.5 -right-1.5 bg-[#FF5722] text-white rounded-full p-0.5 shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">
                    {selectedSizes.length > 0
                      ? `নির্বাচিত সাইজ: ${selectedSizes.map(s => s.name.split(" ")[0]).join(", ")}`
                      : "কোনো সাইজ সিলেক্ট করা হয়নি *"}
                  </p>
                </div>

                {/* Delivery Location Selection */}
                <div className="py-2 space-y-2">
                  <h4 className="text-xs font-bold text-slate-550 uppercase tracking-wider">ডেলিভারি এরিয়া নির্বাচন করুন</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      deliveryOption === "inside" ? "border-[#FF5722] bg-[#FF5722]/5 font-bold" : "border-slate-200 bg-white hover:border-slate-300"
                    }`}>
                      <input
                        type="radio"
                        name="delivery_loc"
                        checked={deliveryOption === "inside"}
                        onChange={() => setDeliveryOption("inside")}
                        className="accent-[#FF5722]"
                      />
                      <span className="text-xs text-slate-700 font-bold">ঢাকার ভিতরে (৳৭০)</span>
                    </label>

                    <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      deliveryOption === "outside" ? "border-[#FF5722] bg-[#FF5722]/5 font-bold" : "border-slate-200 bg-white hover:border-slate-300"
                    }`}>
                      <input
                        type="radio"
                        name="delivery_loc"
                        checked={deliveryOption === "outside"}
                        onChange={() => setDeliveryOption("outside")}
                        className="accent-[#FF5722]"
                      />
                      <span className="text-xs text-slate-700 font-bold">ঢাকার বাইরে (৳১৩০)</span>
                    </label>
                  </div>
                </div>

                {/* Invoice Breakdown */}
                <div className="bg-white rounded-2xl p-4 border border-slate-150 text-xs md:text-sm font-semibold space-y-3 shadow-inner">
                  <div className="flex justify-between text-slate-500">
                    <span>প্রোডাক্টের মূল্য:</span>
                    <span className="text-slate-800 font-extrabold">৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>ডেলিভারি চার্জ:</span>
                    <span className={`text-slate-800 font-extrabold ${isFreeDelivery ? "line-through text-slate-400" : ""}`}>
                      ৳{deliveryCharge}
                    </span>
                  </div>
                  {isFreeDelivery && (
                    <div className="flex justify-between text-[11px] text-emerald-600 font-bold">
                      <span>ডেলিভারি ডিসকাউন্ট:</span>
                      <span>ফ্রি ডেলিভারি (৳০)</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black border-t border-dashed border-slate-200 pt-3 text-slate-800">
                    <span>সর্বমোট পরিশোধযোগ্য:</span>
                    <span className="text-[#FF5722] text-lg font-black">৳{total}</span>
                  </div>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF5722] hover:bg-[#e64a19] disabled:bg-slate-400 text-white py-4 rounded-xl font-bold text-sm md:text-base transition-all transform hover:scale-[1.01] shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2 select-none cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <HugeiconsIcon icon={Tick01Icon} size={20} strokeWidth={3} />
                  )}
                  <span>{isSubmitting ? "অর্ডার প্রসেস হচ্ছে..." : "অর্ডার সম্পন্ন করুন"}</span>
                </button>
              </div>
            </ScrollReveal>

          </form>
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="py-10 bg-white text-slate-500 text-xs md:text-sm text-center border-t border-slate-100">
        <div className="max-w-[800px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 font-semibold">
          <ScrollReveal animation="fade-up" duration={600} delay={0} className="flex flex-col items-center animate-fade-in">
            <HugeiconsIcon icon={TruckDeliveryIcon} size={28} className="text-[#FF5722] mb-1" />
            <span>১০০% ক্যাশ অন ডেলিভারি</span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" duration={600} delay={100} className="flex flex-col items-center animate-fade-in">
            <HugeiconsIcon icon={SparklesIcon} size={28} className="text-[#FF5722] mb-1" />
            <span>প্যাকেট খুলে দেখে পেমেন্ট</span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" duration={600} delay={200} className="flex flex-col items-center animate-fade-in">
            <HugeiconsIcon icon={Agreement01Icon} size={28} className="text-[#FF5722] mb-1" />
            <span>সাইজ এক্সচেঞ্জ সুবিধা</span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" duration={600} delay={300} className="flex flex-col items-center animate-fade-in">
            <HugeiconsIcon icon={CustomerSupportIcon} size={28} className="text-[#FF5722] mb-1" />
            <span>২৪/৭ কাস্টমার সাপোর্ট</span>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center text-xs space-y-4">
        <div className="relative h-8 w-32 mx-auto">
          <Image 
            src="/logo/logo2.png" 
            alt="Fabrico Fashion Logo" 
            fill 
            className="object-contain brightness-0 invert" 
          />
        </div>
        <p className="max-w-md mx-auto leading-relaxed text-slate-550">
          আমাদের প্রোডাক্টের সাইজ পরিবর্তন বা পলিসি সম্পর্কে যেকোনো সাহায্য পেতে সরাসরি যোগাযোগ করুন আমাদের হটলাইন নম্বরে।
        </p>
        <p className="text-slate-600">Copyright © 2026 Fabrico Fashion. All Rights Reserved.</p>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl border border-slate-100 relative overflow-hidden transform scale-100 transition-all duration-300">
            {/* Elegant Header Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF5722]"></div>

            {/* Glowing Success Check */}
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 relative">
              <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
              <HugeiconsIcon icon={Tick01Icon} size={32} className="text-emerald-600 relative z-10" strokeWidth={3} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!</h3>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-6">
              আমাদের প্রিমিয়াম টি-শার্ট কম্বো অর্ডারের জন্য আপনাকে ধন্যবাদ। খুব শীঘ্রই আমাদের একজন রিপ্রেজেন্টেটিভ আপনার মোবাইল নাম্বারে কল করে অর্ডারটি কনফার্ম করবেন।
            </p>

            {/* Order Brief Summary Card */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-150 text-left space-y-2.5 text-xs md:text-sm font-semibold text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">অর্ডার ট্র্যাকিং নম্বর:</span>
                <span className="text-[#0B5A70] font-bold">#{placedOrderId}</span>
              </div>
              <div className="flex justify-between flex-col sm:flex-row gap-1">
                <span className="text-slate-500">সিলেক্টেড কম্বো:</span>
                <span className="text-slate-900 text-right font-bold">
                  {selectedVariants.map(v => v.code).join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">টি-শার্ট সাইজ:</span>
                <span className="text-slate-900">{selectedSizes.map(s => s.name.split(" ")[0]).join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">পেমেন্ট পদ্ধতি:</span>
                <span className="text-slate-900 uppercase">{paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                <span className="text-slate-500">সর্বমোট পরিশোধযোগ্য:</span>
                <span className="text-[#FF5722] text-base">৳{total}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/");
                }}
                className="w-full bg-[#0B5A70] hover:bg-[#073c4b] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                হোম পেজে ফিরে যান
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                }}
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-500 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                ক্লোজ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Minimalist Custom Alert Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center border border-slate-100 shadow-xl relative transform scale-100 transition-all duration-300">
            {/* Minimalist Warning Icon */}
            <div className="text-[#FF5722] mb-3 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 animate-bounce">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>

            <h3 className="text-base font-bold text-slate-800 mb-1.5">{errorModal.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              {errorModal.message}
            </p>

            <button
              onClick={() => setErrorModal({ ...errorModal, show: false })}
              className="w-full bg-[#FF5722] hover:bg-[#e64a19] text-white py-2.5 rounded-lg font-bold text-xs transition-colors active:scale-[0.98] cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
