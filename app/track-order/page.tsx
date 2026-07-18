"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-orange-100 text-orange-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("id") || "");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Auto-search if id is in URL
  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId) {
      setSearchInput(urlId);
      setOrderId(urlId);
      fetchOrder(urlId);
    }
  }, []);

  const fetchOrder = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .ilike("id", `%${id.trim()}%`)
      .limit(1)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setOrder(data);
    }
    setLoading(false);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchInput);
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header />

      <main className="flex-1 py-8 md:py-16">
        <div className="container-custom max-w-2xl">

          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
            <h1 className="text-xl font-bold text-gray-800 mb-1">অর্ডার ট্র্যাক করুন</h1>
            <p className="text-sm text-gray-400 mb-6">আপনার অর্ডার নম্বর লিখুন (যেমন: ORD-12345)</p>

            <form onSubmit={handleTrack} className="flex gap-3">
              <input
                type="text"
                placeholder="অর্ডার নম্বর লিখুন..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-[#FF5722] text-sm transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#FF5722] hover:bg-[#E64A19] text-white px-5 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                )}
                <span>খুঁজুন</span>
              </button>
            </form>
          </div>

          {/* Not Found */}
          {notFound && (
            <div className="bg-white rounded-2xl border border-red-100 p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-700 mb-1">অর্ডার পাওয়া যায়নি</h3>
              <p className="text-sm text-gray-400">"{searchInput}" নম্বরের কোনো অর্ডার খুঁজে পাওয়া যায়নি। সঠিক অর্ডার নম্বর দিন।</p>
            </div>
          )}

          {/* Order Found */}
          {order && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-[#FF5722] to-orange-400 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-orange-100 text-xs font-semibold uppercase tracking-widest mb-1">অর্ডার নম্বর</p>
                    <h2 className="text-2xl font-bold">#{String(order.id).substring(0, 8).toUpperCase()}</h2>
                    <p className="text-orange-100 text-xs mt-1">
                      {new Date(order.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase ${STATUS_COLOR[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Progress Bar (only if not cancelled) */}
                {order.status !== "Cancelled" && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">ডেলিভারি অগ্রগতি</p>
                    <div className="relative flex items-center justify-between">
                      {/* Background line */}
                      <div className="absolute left-0 right-0 h-1 bg-gray-100 top-4 z-0" />
                      {/* Progress line */}
                      <div
                        className="absolute left-0 h-1 bg-[#FF5722] top-4 z-0 transition-all duration-700"
                        style={{ width: currentStep >= 0 ? `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` : "0%" }}
                      />
                      {STATUS_STEPS.map((step, i) => (
                        <div key={step} className="flex flex-col items-center gap-2 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            i <= currentStep
                              ? "bg-[#FF5722] border-[#FF5722] text-white"
                              : "bg-white border-gray-200 text-gray-300"
                          }`}>
                            {i < currentStep ? (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                            ) : (
                              <div className={`w-2.5 h-2.5 rounded-full ${i === currentStep ? "bg-white" : "bg-gray-200"}`} />
                            )}
                          </div>
                          <span className={`text-[10px] font-bold uppercase whitespace-nowrap ${i <= currentStep ? "text-[#FF5722]" : "text-gray-300"}`}>
                            {step === "Pending" ? "অপেক্ষমাণ" :
                             step === "Processing" ? "প্রসেসিং" :
                             step === "Shipped" ? "পাঠানো হয়েছে" : "ডেলিভারি"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">গ্রাহক</p>
                    <p className="font-bold text-gray-800 text-sm">{order.customer_name}</p>
                    <p className="text-gray-500 text-xs">{order.phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">পেমেন্ট</p>
                    <p className="font-bold text-gray-800 text-sm uppercase">{order.payment_method === "cod" ? "Cash on Delivery" : "bKash"}</p>
                    <p className="text-[#FF5722] font-bold text-sm">৳ {order.total}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
                  </svg>
                  <div>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-0.5">ডেলিভারি ঠিকানা</p>
                    <p className="text-sm text-gray-700 font-medium">{order.address}</p>
                  </div>
                </div>

                {/* Items */}
                {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">অর্ডার করা পণ্য</p>
                    <div className="space-y-3">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-3 items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-12 h-12 relative bg-white rounded-lg border border-gray-100 p-1 flex-shrink-0">
                            {item.image ? (
                              <Image src={item.image} alt={item.title} fill className="object-contain p-0.5" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-700 text-sm truncate">{item.title}</p>
                            <p className="text-xs text-gray-400">৳{item.price} × {item.quantity}</p>
                          </div>
                          <p className="font-bold text-gray-800 text-sm">৳{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center py-4 border-t border-dashed border-gray-200">
                  <span className="font-bold text-gray-600">সর্বমোট</span>
                  <span className="text-xl font-bold text-[#FF5722]">৳ {order.total}</span>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!order && !notFound && !loading && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-orange-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-700 mb-2">অর্ডার ট্র্যাক করুন</h3>
              <p className="text-sm text-gray-400">আপনার অর্ডার নম্বর দিয়ে অর্ডারের সর্বশেষ অবস্থা জানুন</p>
              <Link href="/" className="inline-block mt-6 bg-[#FF5722] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#E64A19] transition-all">
                কেনাকাটা করুন
              </Link>
            </div>
          )}

        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
