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
  BodySoapIcon,
  ThreadIcon,
  PaintBrush01Icon,
  Agreement01Icon,
  Location01Icon,
  CreditCardIcon,
  ShoppingBag01Icon,
  TruckDeliveryIcon,
  CustomerSupportIcon,
  CrownIcon,
  Shield01Icon,
  Briefcase01Icon,
  Award01Icon
} from "@hugeicons/core-free-icons";

// Shirt Product Variants
const SHIRT_VARIANTS = [
  { id: "grey", name: "গ্রে চেক (Grey Check)", color: "bg-slate-500", border: "border-slate-600", image: "/images/shirt/shirt_grey.png" },
  { id: "beige", name: "বাদামি চেক (Beige Check)", color: "bg-amber-200", border: "border-amber-400", image: "/images/shirt/shirt_beige.png" },
  { id: "green", name: "সবুজ চেক (Green Check)", color: "bg-emerald-600", border: "border-emerald-800", image: "/images/shirt/shirt_green.png" },
];

const SHIRT_SIZES = [
  { id: "m", name: "M (Chest 38, Length 27)" },
  { id: "l", name: "L (Chest 40, Length 28)" },
  { id: "xl", name: "XL (Chest 42, Length 29)" },
  { id: "xxl", name: "2XL (Chest 44, Length 30)" },
];

export default function ShirtLandingPage() {
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
  const [selectedVariant, setSelectedVariant] = useState(SHIRT_VARIANTS[0]);
  const [selectedSizes, setSelectedSizes] = useState<typeof SHIRT_SIZES>([SHIRT_SIZES[1]]); // Default L
  const [quantity, setQuantity] = useState(1);

  const toggleSize = (size: typeof SHIRT_SIZES[0]) => {
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

  // Check if user is logged in
  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || "");
        setPhone(user.user_metadata?.mobile_number || "");
        setAddress(user.user_metadata?.address || "");
      }
    };
    getUserData();
  }, []);

  // Price Calculations
  const unitPrice = 550;
  const oldUnitPrice = 850;
  const totalQuantity = quantity * selectedSizes.length;
  const subtotal = unitPrice * totalQuantity;
  const deliveryCharge = deliveryOption === "inside" ? 70 : 120;

  // Free delivery for 2 or more shirts!
  const isFreeDelivery = totalQuantity >= 2;
  const finalDeliveryCharge = isFreeDelivery ? 0 : deliveryCharge;
  const total = subtotal + finalDeliveryCharge;

  // Scroll to Order Form
  const scrollToOrderForm = () => {
    orderFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Variant selector click
  const selectVariant = (variant: typeof SHIRT_VARIANTS[0]) => {
    setSelectedVariant(variant);
    scrollToOrderForm();
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
        notes: `Sizes: ${selectedSizes.map(sz => sz.name.split(" ")[0]).join(", ")} | ${orderNote}` +
          (paymentMethod !== "cod" && paymentMethod !== "bkash" ? ` [${paymentMethod.toUpperCase()} Pay: ${bkashNumber}, TrxID: ${transactionId}]` : ""),
        items: selectedSizes.map(sz => ({
          id: `shirt-${selectedVariant.id}-${sz.id}`,
          title: `EASY MAN শার্ট - ${selectedVariant.name} (Size: ${sz.name.split(" ")[0]})`,
          price: unitPrice,
          quantity: quantity,
          image: selectedVariant.image
        })),
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

      // Track Purchase in Meta Pixel
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Purchase", {
          content_ids: orderPayload.items.map((item) => item.id?.toString() || ""),
          content_type: "product",
          value: total,
          currency: "BDT",
          num_items: totalQuantity,
        });
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
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-center py-2.5 px-4 font-black text-xs md:text-sm tracking-wide shadow-md flex items-center justify-center gap-2 relative overflow-hidden">
        <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[10px] animate-pulse">স্পেশাল অফার</span>
        <span>২টি শার্ট একসাথে অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি! প্রতিটি প্রিমিয়াম শার্ট মাত্র ৫৫০ টাকা!</span>
      </div>

      {/* Navigation Header */}
      <header className="bg-slate-950 border-b border-slate-800 py-4 sticky top-0 z-40 backdrop-blur-md bg-slate-950/95">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-black text-2xl tracking-wider text-white uppercase group-hover:text-amber-400 transition-colors">
              SPEED <span className="text-amber-400">BAZAR</span>
            </span>
          </Link>
          <button
            onClick={scrollToOrderForm}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-6 py-2.5 rounded-full font-black text-xs md:text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-400/20 flex items-center gap-1.5"
          >
            <HugeiconsIcon icon={ShoppingCart01Icon} size={18} strokeWidth={2.5} /> এখনই কিনুন
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-10 md:py-16 bg-slate-950 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                👑 PREMIUM MAN'S FASHION SHIRT
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none uppercase tracking-tight">
                EASY MAN <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">COLLECTION</span>
              </h1>
              <p className="text-base md:text-lg text-slate-350 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                প্রিমিয়াম মানের ডাবল পকেট কটন চেক শার্ট। স্মার্ট ও রুচিশীল ক্যাজুয়াল লুকের জন্য প্রতিটি ফ্যাশন সচেতন পুরুষের প্রথম পছন্দ।
              </p>

              {/* Highlight Features list */}
              <div className="grid grid-cols-2 gap-3 pt-2 max-w-md mx-auto lg:mx-0 text-left">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2">
                  <div className="text-amber-400 flex items-center justify-center">
                    <HugeiconsIcon icon={FeatherIcon} size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">১০০% সুতি কাপড়</p>
                    <p className="text-[10px] text-slate-400">গরমে অত্যন্ত আরামদায়ক</p>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2">
                  <div className="text-amber-400 flex items-center justify-center">
                    <HugeiconsIcon icon={Shirt01Icon} size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">ডাবল পকেট ডিজাইন</p>
                    <p className="text-[10px] text-slate-400">স্মার্ট ক্যাজুয়াল ফিটিং</p>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2">
                  <div className="text-amber-400 flex items-center justify-center">
                    <HugeiconsIcon icon={Settings01Icon} size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">প্রিমিয়াম ফিনিশিং</p>
                    <p className="text-[10px] text-slate-400">নিখুঁত সেলাই ও বোতাম</p>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2">
                  <div className="text-amber-400 flex items-center justify-center">
                    <HugeiconsIcon icon={SparklesIcon} size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">রং ও সুতা গ্যারান্টি</p>
                    <p className="text-[10px] text-slate-400">কালার ফেইড হবে না</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={scrollToOrderForm}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-8 py-4 rounded-xl font-black text-base md:text-lg transition-all duration-300 transform hover:scale-[1.03] active:scale-95 shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 group"
                >
                  <span>অর্ডার করতে এখানে ক্লিক করুন</span>
                  <HugeiconsIcon icon={ArrowRight02Icon} size={20} className="group-hover:translate-x-1 transition-transform stroke-[3]" />
                </button>
                <div className="text-slate-400 font-bold text-sm flex items-center gap-1.5">
                  <HugeiconsIcon icon={CallIcon} size={18} className="text-amber-400" />
                   <span>হটলাইন: <a href="tel:01771680742" className="text-white hover:text-amber-400">01771680742</a></span>
                </div>
              </div>
            </div>

            {/* Right Showcase Image Viewer */}
            <div className="lg:col-span-6 relative flex flex-col gap-4">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 group">
                <Image
                  src={selectedVariant.image}
                  alt={selectedVariant.name}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                  <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase inline-block w-fit">New Arrival</span>
                  <p className="text-white font-extrabold text-lg">{selectedVariant.name}</p>
                </div>
              </div>

              {/* Tiny color selector row for hero view */}
              <div className="flex justify-center gap-3">
                {SHIRT_VARIANTS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`w-12 h-16 rounded-lg border-2 overflow-hidden relative transition-all ${selectedVariant.id === v.id ? "border-amber-400 scale-105 shadow-md shadow-amber-400/20" : "border-slate-800 hover:border-slate-700"
                      }`}
                  >
                    <Image src={v.image} alt={v.name} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Spotlight Product Section */}
      <section className="py-12 md:py-16 bg-slate-900 border-y border-slate-800">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

            {/* Spotlight Image grid or slide */}
            <div className="relative aspect-[3/4] max-w-sm mx-auto w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-xl group">
              <Image
                src={selectedVariant.image}
                alt="Easy Man Premium Checked Shirt"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="bg-slate-950/80 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Premium Finish</span>
              </div>
            </div>

            {/* Product Offer Details */}
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white leading-tight uppercase">
                ইজি ম্যান প্রিমিয়াম ডাবল পকেট শার্ট
              </h2>

              {/* Pricing Tag */}
              <div className="flex items-baseline gap-4">
                <span className="text-3xl md:text-4xl font-black text-amber-400">৳৫৫০</span>
                <span className="text-lg text-slate-500 line-through">৳৮৫০</span>
                <span className="bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs px-2.5 py-1 rounded-md font-bold">৳৩০০ সাশ্রয়</span>
              </div>

              <div className="border-t border-slate-850 pt-4 space-y-4">
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  আমাদের প্রিমিয়াম সুতি কাপড়ের চেক শার্টগুলো আরামদায়ক ফ্যাব্রিকে তৈরি, যা সব ঋতুতে পরার জন্য উপযোগী। সুতি ফেব্রিক ব্যবহারে শরীরে কোনো অস্বস্তি বা ঘাম জমবে না, আর দীর্ঘ ব্যবহারে রং ওঠার কোনো ভয় নেই।
                </p>

                <ul className="space-y-2.5 text-sm font-semibold text-slate-200">
                  <li className="flex items-center gap-2">
                    <HugeiconsIcon icon={Tick01Icon} size={16} className="text-amber-400" /> ১০০% প্রিমিয়াম সুতি কমফোর্ট কটন ফেব্রিক
                  </li>
                  <li className="flex items-center gap-2">
                    <HugeiconsIcon icon={Tick01Icon} size={16} className="text-amber-400" /> আভিজাত্যপূর্ণ ক্যাজুয়াল ডাবল পকেট ডিজাইন
                  </li>
                  <li className="flex items-center gap-2">
                    <HugeiconsIcon icon={Tick01Icon} size={16} className="text-amber-400" /> স্লিম ফিট কাটিং ও কালার গ্যারান্টি
                  </li>
                  <li className="flex items-center gap-2">
                    <HugeiconsIcon icon={Tick01Icon} size={16} className="text-amber-400" /> ২টি বা তার বেশি কিনলে সম্পূর্ণ ফ্রি ডেলিভারি!
                  </li>
                </ul>
              </div>

              {/* Sizes overview */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">উপলব্ধ সাইজসমূহ (Size Range)</p>
                <div className="flex gap-2">
                  {SHIRT_SIZES.map((sz) => (
                    <span key={sz.id} className="bg-slate-950 border border-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg text-slate-300">
                      {sz.name.split(" ")[0]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={scrollToOrderForm}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 py-4 rounded-xl font-black text-base md:text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
                >
                  <HugeiconsIcon icon={ArrowRight02Icon} size={20} className="animate-pulse" />
                  <span>এখনই সাইজ সিলেক্ট করে অর্ডার করুন</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Benefits Section */}
      <section className="py-12 md:py-20 bg-slate-950">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 uppercase">
            শার্টটির সেরা বৈশিষ্ট্যসমূহ
          </h2>
          <p className="text-slate-400 font-medium max-w-lg mx-auto mb-10 md:mb-14 text-xs md:text-sm">
            কাপড়, বোতাম এবং সেলাই প্রতিটি জায়গায় প্রিমিয়াম কোয়ালিটি নিশ্চিত করা হয়েছে। এটি দীর্ঘস্থায়ী ও স্টাইলিশ।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Benefit 1 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left space-y-3 group hover:border-amber-400/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
                <HugeiconsIcon icon={Shirt01Icon} size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">এক্সক্লুসিভ প্রিমিয়াম ফ্যাব্রিক</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                আমাদের এই শার্টগুলোতে ব্যবহৃত হয়েছে উন্নতমানের ১০০% কটন ফেব্রিক, যা অতুলনীয় আরাম ও দীর্ঘস্থায়ী স্থায়িত্ব নিশ্চিত করে।
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left space-y-3 group hover:border-amber-400/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
                <HugeiconsIcon icon={CrownIcon} size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">সফিস্টিকেটেড ডিজাইন ও ফিটিং</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                আধুনিক এবং রুচিশীল কাট যা আপনার ব্যক্তিত্বকে করবে আরও আকর্ষণীয় এবং স্মার্ট।
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left space-y-3 group hover:border-amber-400/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
                <HugeiconsIcon icon={Leaf01Icon} size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">সর্বোচ্চ কমফোর্ট ও ব্রিদেবল টেক্সচার</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                কাপড়গুলো অত্যন্ত হালকা ও বাতাস চলাচলের উপযোগী, যা সারাদিনের কর্মব্যস্ততায় আপনাকে রাখবে সতেজ ও স্বাচ্ছন্দ্যময়।
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left space-y-3 group hover:border-amber-400/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
                <HugeiconsIcon icon={Shield01Icon} size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">স্কিন-ফ্রেন্ডলি ফিনিশিং</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                ত্বকের সুরক্ষায় বিশেষভাবে প্রক্রিয়াজাত কাপড়, যা সংবেদনশীল ত্বকের জন্যও সম্পূর্ণ নিরাপদ ও আরামদায়ক।
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left space-y-3 group hover:border-amber-400/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
                <HugeiconsIcon icon={SparklesIcon} size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">কালার ও শেপ রিটেনশন</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                বারবার ব্যবহারের পরেও কাপড়ের কালার এবং পারফেক্ট ফিটিং অটুট থাকে, যা আপনার স্মার্ট লুক বজায় রাখে।
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left space-y-3 group hover:border-amber-400/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
                <HugeiconsIcon icon={Briefcase01Icon} size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">বহুমুখী ব্যবহার</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                অফিস মিটিং, ফরমাল ইভেন্ট কিংবা ক্যাজুয়াল আড্ডা—যেকোনো পরিবেশের সাথে মানিয়ে নেওয়ার মতো প্রিমিয়াম কালেকশন।
              </p>
            </div>

            {/* Benefit 7 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left space-y-3 group hover:border-amber-400/30 transition-all duration-300 sm:col-span-2 lg:col-span-1 lg:col-start-2">
              <div className="w-12 h-12 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
                <HugeiconsIcon icon={Award01Icon} size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">কোয়ালিটি অ্যাসিউরেন্স</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                প্রতিটি শার্টে সূক্ষ্ম কারুকার্য ও প্রিমিয়াম সেলাইয়ের নিশ্চয়তা, যা আপনার রুচির এক অনন্য প্রতিফলন।
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Specialty Grid Section */}
      <section className="py-12 md:py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-[1100px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-white mb-10 md:mb-16 uppercase">
            প্রিমিয়াম শার্টের ডিজাইন ডিটেইলিং
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left Column Features */}
            <div className="lg:col-span-4 space-y-6 md:space-y-10 text-center lg:text-right order-2 lg:order-1">
              <div className="space-y-2">
                <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">COLLAR</span>
                <h3 className="text-lg font-bold text-white">ক্ল্যাসিক কলার স্টাইল</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  কলার নরম অথচ শক্ত বকরম দিয়ে তৈরি হওয়ায় দীর্ঘ ব্যবহারে কলারের শেপ নষ্ট হবে না।
                </p>
              </div>
              <div className="space-y-2">
                <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">POCKETS</span>
                <h3 className="text-lg font-bold text-white">ডাবল ফ্রন্ট পকেট</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  স্টাইলিশ ফ্ল্যাপ ডাবল পকেট ডিজাইন শার্টটিকে আরও আকর্ষণীয় ও ক্যাজুয়াল করে তোলে।
                </p>
              </div>
            </div>

            {/* Center Image */}
            <div className="lg:col-span-4 relative aspect-[3/4] max-w-sm mx-auto w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md order-1 lg:order-2">
              <Image
                src={selectedVariant.image}
                alt="Easy Man Checked Shirt Detail"
                fill
                className="object-cover"
              />
            </div>

            {/* Right Column Features */}
            <div className="lg:col-span-4 space-y-6 md:space-y-10 text-center lg:text-left order-3">
              <div className="space-y-2">
                <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">BUTTONS</span>
                <h3 className="text-lg font-bold text-white">প্রিমিয়াম ফিনিশ বোতাম</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  ম্যাচিং কালারের মজবুত বোতাম নিখুঁত সেলাই দিয়ে লাগানো, যা দেখতে খুবই প্রিমিয়াম লাগে।
                </p>
              </div>
              <div className="space-y-2">
                <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">HEM</span>
                <h3 className="text-lg font-bold text-white">কার্ভ হেম ফিটিং</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  কার্ভ হেম ডিজাইন হওয়ায় শার্টটি ইন (Tuck in) বা আউট দুই ভাবেই স্টাইলিশ ভাবে পরা যায়।
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-12 md:py-20 bg-slate-950">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-white mb-10 md:mb-16">
            ক্রেতাদের মূল্যবান মতামতসমূহ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Review 1 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-850 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                ★★★★★
              </div>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed italic">
                "শার্টের কাপড় অনেক সফট। কটন হওয়ায় গরমে বেশ আরাম লাগে। পকেট ডিজাইনটা ইউনিক এবং ফিটিং অনেক সুন্দর হয়েছে। সেলার ব্যবহারও খুব ভালো ছিল।"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                  T
                </div>
                <div>
                  <p className="text-xs font-bold text-white">তানভীর আহমেদ</p>
                  <p className="text-[10px] text-slate-400">Verified Buyer</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-850 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                ★★★★★
              </div>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed italic">
                "আমি গ্রে আর বাদামি দুইটা চেক শার্ট নিয়েছি অফারে। সত্যি বলতে শার্ট দুটোর কালার কম্বিনেশন ছবিতে যেমন দেখেছি বাস্তবে তার থেকেও সুন্দর। ডেলিভারিও ২ দিনে পেয়েছি।"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                  R
                </div>
                <div>
                  <p className="text-xs font-bold text-white">রাশেদুল ইসলাম</p>
                  <p className="text-[10px] text-slate-400">Verified Buyer</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-850 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                ★★★★★
              </div>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed italic">
                "ধোয়ার পর শার্টের ফিটিং আগের মতোই আছে এবং কোনো রং ওঠেনি। সেলাই অত্যন্ত নিখুঁত। যারা ভালো সুতি ক্যাজুয়াল শার্ট খুঁজছেন তারা অফারে চোখ বুজে নিতে পারেন।"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <div>
                  <p className="text-xs font-bold text-white">সাকিব হাসান</p>
                  <p className="text-[10px] text-slate-400">Verified Buyer</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Product Variants (Color Selection Grid) */}
      <section className="py-12 md:py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 uppercase">
            আপনার পছন্দের কালার সিলেক্ট করুন
          </h2>
          <p className="text-slate-400 font-medium text-xs md:text-sm mb-10 max-w-md mx-auto">
            নিচের যেকোনো কালারে ক্লিক করলে সেটি অটোমেটিক অর্ডারে সেট হয়ে যাবে।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {SHIRT_VARIANTS.map((variant) => {
              const isSelected = selectedVariant.id === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => selectVariant(variant)}
                  className={`bg-slate-950 p-4 rounded-2xl border-2 text-center transition-all cursor-pointer relative group flex flex-col items-center gap-4 ${isSelected ? "border-amber-400 bg-amber-400/5 shadow-md scale-[1.02]" : "border-slate-800 hover:border-slate-700"
                    }`}
                >
                  {/* Selected Tick Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 rounded-full p-1 shadow flex items-center justify-center">
                      <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={3} />
                    </div>
                  )}

                  {/* Colored Circle swatch or thumb */}
                  <div className="w-32 h-44 rounded-xl border border-slate-850 overflow-hidden relative group-hover:scale-105 transition-transform duration-300 bg-slate-900">
                    <Image src={variant.image} alt={variant.name} fill className="object-cover" />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-white text-sm md:text-base">{variant.name}</h3>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-1">{variant.id} plaid</p>
                  </div>

                  <span className={`px-4 py-2 rounded-xl text-xs font-black w-full border ${isSelected ? "bg-amber-400 text-slate-950 border-transparent" : "bg-slate-900 text-slate-300 border-slate-800 group-hover:bg-slate-850"
                    }`}>
                    {isSelected ? "সিলেক্ট করা হয়েছে" : "সিলেক্ট করুন"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Checkout Section & Order Form */}
      <section ref={orderFormRef} className="py-12 md:py-20 bg-slate-950 border-t border-slate-800 scroll-mt-24">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-10 md:mb-14">
            <span className="bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase">Order Form</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2 uppercase">
              অর্ডার সম্পন্ন করতে ফর্মটি পূরণ করুন
            </h2>
            <p className="text-slate-400 font-medium text-xs md:text-sm mt-1">
              সঠিক নাম, মোবাইল নম্বর এবং ঠিকানা দিয়ে অর্ডারটি নিশ্চিত করুন। প্যাকেট খুলে দেখে পেমেন্ট করার সুযোগ রয়েছে।
            </p>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Shipping Address & Payment */}
            <div className="lg:col-span-7 bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-850 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 mb-5 flex items-center gap-2">
                  <HugeiconsIcon icon={Location01Icon} size={20} className="text-amber-400" /> ডেলিভারির ঠিকানা (Billing & Shipping)
                </h3>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs md:text-sm font-bold text-slate-350">সম্পূর্ণ নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm outline-none focus:border-amber-400 transition-all text-slate-100"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs md:text-sm font-bold text-slate-350">মোবাইল নম্বর *</label>
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
                      className={`w-full bg-slate-950 border rounded-xl p-3.5 text-sm outline-none transition-all text-slate-100 ${phone && (phone.length !== 11 || !phone.startsWith("01"))
                          ? "border-red-500 focus:border-red-500"
                          : "border-slate-800 focus:border-amber-400"
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
                    <label className="text-xs md:text-sm font-bold text-slate-350">সম্পূর্ণ ঠিকানা * (বাসা নং, রোড, থানা, জেলা)</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="বাসা নং, রোড নং, থানা, জেলা সহ সম্পূর্ণ ঠিকানা লিখুন"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm outline-none focus:border-amber-400 transition-all text-slate-100 resize-none"
                    ></textarea>
                  </div>

                  {/* Order Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs md:text-sm font-bold text-slate-400">অর্ডারের অতিরিক্ত নোট (ঐচ্ছিক)</label>
                    <textarea
                      rows={2}
                      placeholder="যেমন: কোনো বিশেষ রোড বা ডেলিভারি নির্দেশনা থাকলে লিখুন"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm outline-none focus:border-amber-400 transition-all text-slate-100 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="border-t border-slate-800 pt-6">
                <h3 className="text-base md:text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <HugeiconsIcon icon={CreditCardIcon} size={20} className="text-amber-400" /> একটি পেমেন্ট পদ্ধতি নির্বাচন করুন
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === "cod" ? "border-amber-400 bg-amber-400/5 font-bold" : "border-slate-800 hover:border-slate-700"
                      }`}
                  >
                    <HugeiconsIcon icon={Agreement01Icon} size={24} className="mb-1 text-amber-400" />
                    <span className="text-xs text-slate-300">ক্যাশ অন ডেলিভারি</span>
                  </button>

                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === "bkash" ? "border-pink-500 bg-pink-50/10 font-bold" : "border-slate-800 hover:border-slate-700"
                      }`}
                  >
                    <div className="w-10 h-6 relative mb-1">
                      <Image src="/bkash_logo.png" alt="bKash" fill className="object-contain" />
                    </div>
                    <span className="text-xs text-slate-300">বিকাশ (Bkash)</span>
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === "nagad" ? "border-orange-500 bg-orange-50/10 font-bold" : "border-slate-800 hover:border-slate-700"
                      }`}
                  >
                    <div className="w-10 h-6 relative mb-1">
                      <Image src="/nagad_logo.png" alt="Nagad" fill className="object-contain" />
                    </div>
                    <span className="text-xs text-slate-300">নগদ (Nagad)</span>
                  </button>

                  {/* Rocket */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("rocket")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === "rocket" ? "border-purple-600 bg-purple-50/10 font-bold" : "border-slate-800 hover:border-slate-700"
                      }`}
                  >
                    <div className="w-10 h-6 relative mb-1">
                      <Image src="/rocket_logo.png" alt="Rocket" fill className="object-contain" />
                    </div>
                    <span className="text-xs text-slate-300">রকেট (Rocket)</span>
                  </button>
                </div>

                {/* Bkash / Nagad / Rocket transaction details */}
                {paymentMethod !== "cod" && (
                  <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 mt-5 space-y-4 text-xs md:text-sm animate-fade-in">
                    <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {paymentMethod.toUpperCase()} Personal Number
                        </p>
                        <p className="text-sm font-extrabold text-amber-400 mt-0.5">01723523706</p>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">Active</span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                      👉 অনুগ্রহ করে প্রথমে আপনার বিকাশ/নগদ/রকেট একাউন্ট থেকে উপরে দেওয়া নাম্বারে <span className="text-amber-400 font-bold">৳{total}</span> সেন্ড মানি করুন। তারপর পেমেন্ট নাম্বার ও ট্রানজেকশন আইডি নিচে দিয়ে ফর্মটি সাবমিট করুন।
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Sender Payment Number */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-350">যে নাম্বার থেকে টাকা পাঠিয়েছেন *</label>
                        <input
                          type="text"
                          required
                          placeholder="01XXXXXXXXX"
                          value={bkashNumber}
                          onChange={(e) => setBkashNumber(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-amber-400 text-slate-100"
                        />
                      </div>

                      {/* Transaction ID */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-350">পেমেন্ট ট্রানজেকশন আইডি (TrxID) *</label>
                        <input
                          type="text"
                          required
                          placeholder="TrxID (যেমন: 9J83K2L4)"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-amber-400 text-slate-100"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Details & Pricing */}
            <div className="lg:col-span-5 bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-850 shadow-sm space-y-6 lg:sticky lg:top-28">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <HugeiconsIcon icon={ShoppingBag01Icon} size={20} className="text-amber-400" /> অর্ডারের বিবরণ (Your Order)
              </h3>

              <div className="space-y-4">
                {/* Product Info Row */}
                <div className="flex gap-4 pb-4 border-b border-slate-800">
                  <div className="w-16 h-20 bg-slate-950 rounded-xl border border-slate-850 overflow-hidden relative flex-shrink-0">
                    <Image src={selectedVariant.image} alt={selectedVariant.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-extrabold text-white text-sm md:text-base leading-snug">
                      ইজি ম্যান প্রিমিয়াম শার্ট
                    </h4>
                    <p className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md inline-block">
                      কালার: {selectedVariant.name.split(" ")[0]}
                    </p>

                    {/* Quantity Adjustment Selector */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs text-slate-400 font-bold">পরিমাণ:</span>
                      <div className="flex items-center border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-2 py-1 text-slate-400 hover:bg-slate-900 font-extrabold text-sm"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold text-xs text-white bg-slate-950 border-x border-slate-800 min-w-[24px] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-2 py-1 text-slate-400 hover:bg-slate-900 font-extrabold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="py-2 space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">সাইজ নির্বাচন করুন (Size)*</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {SHIRT_SIZES.map((sz) => {
                      const isSzSelected = selectedSizes.some((s) => s.id === sz.id);
                      return (
                        <button
                          key={sz.id}
                          type="button"
                          onClick={() => toggleSize(sz)}
                          className={`py-2 px-1 text-xs font-black rounded-lg border text-center transition-all ${isSzSelected ? "border-amber-400 bg-amber-400/10 text-amber-400 font-bold" : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                            }`}
                        >
                          {sz.name.split(" ")[0]}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-400 italic font-semibold">
                    {selectedSizes.length > 0
                      ? `নির্বাচিত সাইজসমূহ: ${selectedSizes.map((s) => s.name).join(", ")}`
                      : "কোনো সাইজ সিলেক্ট করা হয়নি"}
                  </p>
                </div>

                {/* Delivery Location Selection */}
                <div className="py-2 space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">ডেলিভারি এরিয়া নির্বাচন করুন</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${deliveryOption === "inside" ? "border-amber-400 bg-amber-400/5 font-bold" : "border-slate-800 bg-slate-950 hover:border-slate-750"
                      }`}>
                      <input
                        type="radio"
                        name="delivery_loc"
                        checked={deliveryOption === "inside"}
                        onChange={() => setDeliveryOption("inside")}
                        className="accent-amber-400"
                      />
                      <span className="text-xs text-slate-200">ঢাকার ভিতরে (৳৭০)</span>
                    </label>

                    <label className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${deliveryOption === "outside" ? "border-amber-400 bg-amber-400/5 font-bold" : "border-slate-800 bg-slate-950 hover:border-slate-750"
                      }`}>
                      <input
                        type="radio"
                        name="delivery_loc"
                        checked={deliveryOption === "outside"}
                        onChange={() => setDeliveryOption("outside")}
                        className="accent-amber-400"
                      />
                      <span className="text-xs text-slate-200">ঢাকার বাইরে (৳১২০)</span>
                    </label>
                  </div>
                </div>

                {/* Invoice Breakdown */}
                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 text-xs md:text-sm font-semibold space-y-3">
                  <div className="flex justify-between text-slate-400">
                    <span>প্রোডাক্টের মূল্য:</span>
                    <span className="text-white">৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>ডেলিভারি চার্জ:</span>
                    <span className={`text-white ${isFreeDelivery ? "line-through text-slate-500" : ""}`}>
                      ৳{deliveryCharge}
                    </span>
                  </div>
                  {isFreeDelivery && (
                    <div className="flex justify-between text-[11px] text-emerald-400 font-bold">
                      <span>ডেলিভারি ডিসকাউন্ট:</span>
                      <span>ফ্রি ডেলিভারি (৳০)</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black border-t border-dashed border-slate-800 pt-3 text-white">
                    <span>সর্বমোট পরিশোধযোগ্য:</span>
                    <span className="text-amber-400">৳{total}</span>
                  </div>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:bg-slate-700 text-slate-950 py-4 rounded-xl font-black text-sm md:text-base transition-all transform hover:scale-[1.01] shadow-lg shadow-amber-400/10 flex items-center justify-center gap-2 select-none"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <HugeiconsIcon icon={Tick01Icon} size={20} strokeWidth={3} />
                  )}
                  <span>{isSubmitting ? "অর্ডার প্রসেস হচ্ছে..." : "অর্ডার সম্পন্ন করুন"}</span>
                </button>
              </div>
            </div>

          </form>
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="py-10 bg-slate-950 text-slate-400 text-xs md:text-sm text-center border-t border-slate-900">
        <div className="max-w-[800px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 font-semibold">
          <div className="flex flex-col items-center">
            <HugeiconsIcon icon={TruckDeliveryIcon} size={28} className="text-amber-400 mb-1" />
            <span>১০০% ক্যাশ অন ডেলিভারি</span>
          </div>
          <div className="flex flex-col items-center">
            <HugeiconsIcon icon={SparklesIcon} size={28} className="text-amber-400 mb-1" />
            <span>প্যাকেট খুলে দেখে পেমেন্ট</span>
          </div>
          <div className="flex flex-col items-center">
            <HugeiconsIcon icon={Agreement01Icon} size={28} className="text-amber-400 mb-1" />
            <span>৭ দিনের এক্সচেঞ্জ গ্যারান্টি</span>
          </div>
          <div className="flex flex-col items-center">
            <HugeiconsIcon icon={CustomerSupportIcon} size={28} className="text-amber-400 mb-1" />
            <span>২৪/৭ কাস্টমার সাপোর্ট</span>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="bg-slate-950 text-slate-500 py-10 border-t border-slate-900 text-center text-xs space-y-4">
        <p className="font-extrabold text-sm text-white">SPEED BAZAR</p>
        <p className="max-w-md mx-auto leading-relaxed">
          আমাদের প্রোডাক্টের সাইজ পরিবর্তন বা পলিসি সম্পর্কে যেকোনো সাহায্য পেতে সরাসরি যোগাযোগ করুন আমাদের হটলাইন নম্বরে।
        </p>
        <p>Copyright © 2026 Speed Bazar. All Rights Reserved.</p>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 rounded-2xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl border border-slate-850 relative overflow-hidden transform scale-100 transition-all duration-300">
            {/* Elegant Header Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500"></div>

            {/* Glowing Success Check */}
            <div className="w-16 h-16 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-5 relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping opacity-75"></div>
              <HugeiconsIcon icon={Tick01Icon} size={32} className="text-amber-400 relative z-10" strokeWidth={3} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!</h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6">
              ইজি ম্যান শার্ট অর্ডারের জন্য আপনাকে ধন্যবাদ। আমাদের একজন রিপ্রেজেন্টেটিভ খুব শীঘ্রই আপনার মোবাইল নাম্বারে কল করে অর্ডারটি কনফার্ম করে নেবেন।
            </p>

            {/* Order Brief Summary Card */}
            <div className="bg-slate-950 rounded-xl p-4 mb-6 border border-slate-850 text-left space-y-2.5 text-xs md:text-sm font-semibold">
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-400">অর্ডার ট্র্যাকিং নম্বর:</span>
                <span className="text-amber-400">#{placedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">কালার ও সাইজ:</span>
                <span className="text-white">
                  {selectedVariant.name.split(" ")[0]} Plaid (Size: {selectedSizes.map((s) => s.name.split(" ")[0]).join(", ")})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">পেমেন্ট পদ্ধতি:</span>
                <span className="text-white uppercase">{paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-slate-850 pt-2 font-bold text-white">
                <span className="text-slate-400">সর্বমোট পরিশোধযোগ্য:</span>
                <span className="text-amber-400">৳{total}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/");
                }}
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors"
              >
                হোম পেজে ফিরে যান
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                }}
                className="w-full border border-slate-800 hover:bg-slate-900 text-slate-400 py-2.5 rounded-xl font-bold text-xs transition-colors"
              >
                ক্লোজ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Minimalist Custom Alert Modal (Dark Theme) */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 rounded-xl p-6 max-w-sm w-full text-center border border-slate-800 relative transform scale-100 transition-all duration-300">
            {/* Minimalist Warning Icon */}
            <div className="text-amber-400 mb-3 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>

            <h3 className="text-base font-bold text-white mb-1.5">{errorModal.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              {errorModal.message}
            </p>

            <button
              onClick={() => setErrorModal({ ...errorModal, show: false })}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 py-2.5 rounded-lg font-bold text-xs transition-colors active:scale-[0.98]"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
