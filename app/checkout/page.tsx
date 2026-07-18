"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [deliveryOption, setDeliveryOption] = useState("outside");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const { cart, totalPrice, removeFromCart, updateQuantity, totalItems, clearCart } = useCart();

  // Shipping details state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [bkashNumber, setBkashNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Error Modal state
  const [errorModal, setErrorModal] = useState({ show: false, message: "", title: "সতর্কতা" });

  const showError = (message: string, title: string = "সতর্কতা") => {
    setErrorModal({ show: true, message, title });
  };

  // Prefill user details if logged in
  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        setFullName(user.user_metadata?.full_name || "");
        setPhone(user.user_metadata?.mobile_number || "");
        setAddress(user.user_metadata?.address || "");
      }
    };
    getUserData();
  }, []);

  const subtotal = totalPrice;
  const deliveryCharge = deliveryOption === "inside" ? 60 : 130;
  const total = totalPrice + deliveryCharge;
  const discount = cart.reduce((acc, item) => acc + (item.oldPrice ? (item.oldPrice - item.price) * item.quantity : 0), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      showError("আপনার কার্টটি খালি! অনুগ্রহ করে অর্ডার করার জন্য প্রডাক্ট যোগ করুন।");
      return;
    }

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

    if (paymentMethod === "bkash") {
      if (!bkashNumber.trim() || !transactionId.trim()) {
        showError("বিকাশ পেমেন্টের জন্য অনুগ্রহ করে বিকাশ নম্বর এবং ট্রানজেকশন আইডি প্রদান করুন।");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

      // Prepare order details for database insert
      const orderPayload = {
        user_id: user?.id || null,
        customer_name: fullName,
        phone: cleanedPhone,
        address: address,
        total: total,
        status: "Pending",
        payment_method: paymentMethod,
        bkash_number: paymentMethod === "bkash" ? bkashNumber : null,
        transaction_id: paymentMethod === "bkash" ? transactionId : null,
        items: cart,
      };

      const { data, error } = await supabase
        .from("orders")
        .insert([orderPayload])
        .select();

      let finalOrderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

      if (error) {
        console.error("Supabase order insert failed:", error);
        // Show meaningful error to user
        showError(`অর্ডার সংরক্ষণ করতে সমস্যা হয়েছে: ${error.message}`);
        return;
      } else if (data && data[0]) {
        finalOrderId = String(data[0].id).substring(0, 8).toUpperCase();
      }

      setPlacedOrderId(finalOrderId);
      setShowSuccessModal(true);
      clearCart();
    } catch (error: any) {
      console.error("Order placement failed:", error);
      showError(`অর্ডার করতে সমস্যা হয়েছে: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
      <Header />

      <main className="flex-1 py-4 md:py-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-md p-4 md:p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">ডেলিভারির ঠিকানা</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">সম্পূর্ণ নাম*</label>
                    <input
                      type="text"
                      placeholder="সম্পূর্ণ নাম*"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border border-gray-200 rounded-sm p-3 outline-none focus:border-[#1a80c2] text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">মোবাইল নম্বর *</label>
                    <input
                      type="text"
                      placeholder="মোবাইল নম্বর *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-sm p-3 outline-none focus:border-[#1a80c2] text-sm"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-600">সম্পূর্ণ ঠিকানা, বাসা, রোড, থানা, জেলা*</label>
                    <textarea
                      placeholder="সম্পূর্ণ ঠিকানা, বাসা, রোড, থানা, জেলা*"
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-gray-200 rounded-sm p-3 outline-none focus:border-[#1a80c2] text-sm resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">অনুগ্রহ করে একটি ডেলিভারি অপশন নির্বাচন করুন</h3>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="delivery"
                        className="w-4 h-4 accent-[#FF5722]"
                        checked={deliveryOption === "inside"}
                        onChange={() => setDeliveryOption("inside")}
                      />
                      <span className="text-sm text-gray-700 group-hover:text-[#FF5722] transition-colors">Inside Dhaka</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="delivery"
                        className="w-4 h-4 accent-[#FF5722]"
                        checked={deliveryOption === "outside"}
                        onChange={() => setDeliveryOption("outside")}
                      />
                      <span className="text-sm text-gray-700 group-hover:text-[#FF5722] transition-colors">Outside Dhaka</span>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <textarea
                    placeholder="আপনার অর্ডারের নোট লিখুন"
                    rows={2}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full border border-gray-200 rounded-sm p-3 outline-none focus:border-[#1a80c2] text-sm resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Payment Option */}
              <div className="bg-white rounded-md p-4 md:p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">একটি পেমেন্ট অপশন নির্বাচন করুন</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all relative group ${paymentMethod === "cod" ? "border-[#1a80c2] bg-blue-50/30 shadow-sm" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                      }`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="absolute top-2 left-2 bg-[#1a80c2] text-white rounded-full p-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                    )}
                    <div className="w-12 h-12 mb-2 relative group-hover:scale-105 transition-transform duration-300">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-emerald-500 drop-shadow-sm">
                        {/* Soft backdrop background decoration */}
                        <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                        
                        {/* Stacked Back Banknote */}
                        <rect x="4" y="6.5" width="11" height="7" rx="1.5" transform="rotate(-12 4 6.5)" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" />
                        
                        {/* Stacked Front Banknote */}
                        <rect x="5.5" y="8" width="12" height="7.5" rx="1.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />
                        
                        {/* Elegant circle and emblem on front banknote */}
                        <circle cx="11.5" cy="11.75" r="1.75" stroke="currentColor" strokeWidth="1.2" fill="none" />
                        <path d="M10.5 11.75h2M11.5 10.75v2" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
                        <circle cx="7.5" cy="10" r="0.6" fill="currentColor" />
                        <circle cx="15.5" cy="13.5" r="0.6" fill="currentColor" />

                        {/* Hand receiving cash or secure badge */}
                        <circle cx="16.5" cy="15" r="4.25" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" />
                        
                        {/* Checkmark to represent secure Cash on Delivery hand-off */}
                        <path d="M15 15l1 1 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        
                        {/* Delicate sparkles representing cash freshness/security */}
                        <circle cx="4" cy="16" r="0.75" fill="currentColor" fillOpacity="0.6" />
                        <circle cx="19" cy="7" r="0.75" fill="currentColor" fillOpacity="0.6" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-gray-700">Cash on Delivery</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("bkash")}
                    className={`flex flex-col items-center justify-center p-4 rounded-md border-2 transition-all relative ${paymentMethod === "bkash" ? "border-[#1a80c2] bg-blue-50/50" : "border-gray-100 hover:border-gray-200"
                      }`}
                  >
                    {paymentMethod === "bkash" && (
                      <div className="absolute top-2 left-2 bg-[#1a80c2] text-white rounded-full p-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                    )}
                    <div className="w-16 h-8 relative mb-2">
                      <Image src="/bkash_logo.png" alt="bKash" fill className="object-contain" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">Bkash</span>
                  </button>
                </div>

                {paymentMethod === "bkash" && (
                  <div className="bg-gray-50 rounded-md p-4 md:p-6 border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 bg-white p-3 rounded border border-gray-100 w-full max-w-sm">
                      <div className="w-8 h-8 relative">
                        <Image src="/bkash_logo.png" alt="bKash" fill className="object-contain" />
                      </div>
                      <span className="text-sm font-bold text-gray-800 flex-1">01534694518</span>
                      <button className="text-gray-400 hover:text-[#1a80c2]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium text-gray-700">Please save the message</p>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <span className="text-sm text-gray-600 min-w-[120px]">Bkash Number:</span>
                          <input
                            type="text"
                            placeholder="017XXXXXXXX*"
                            value={bkashNumber}
                            onChange={(e) => setBkashNumber(e.target.value)}
                            className="flex-1 bg-white border border-gray-200 rounded-sm p-3 outline-none focus:border-[#1a80c2] text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <span className="text-sm text-gray-600 min-w-[120px]">Transaction ID:</span>
                        <input
                          type="text"
                          placeholder="Transaction Id*"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="flex-1 bg-white border border-gray-200 rounded-sm p-3 outline-none focus:border-[#1a80c2] text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-md p-4 md:p-6 shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">অর্ডার আইটেম ({totalItems} Items)</h2>

                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 relative pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute -top-1 -right-1 text-gray-300 hover:text-red-500 transition-colors z-10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="w-20 h-20 relative bg-gray-50 rounded-md border border-gray-100 p-2 flex-shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-sm font-bold text-gray-700 leading-tight pr-4 line-clamp-2">{item.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-500"
                            >-</button>
                            <span className="px-3 py-1 text-xs font-bold text-gray-700 border-x border-gray-200">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-500"
                            >+</button>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-gray-800">৳ {item.price * item.quantity}</span>
                            {item.oldPrice && <p className="text-[10px] text-gray-400 line-through">৳ {item.oldPrice * item.quantity}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {cart.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-500 text-sm mb-4">আপনার কার্টটি খালি</p>
                      <Link href="/" className="text-[#1a80c2] font-bold text-sm hover:underline">কেনাকাটা করুন</Link>
                    </div>
                  )}

                  <div className="pt-6 space-y-3 border-t border-gray-100 mt-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">সাব টোটাল:</span>
                      <span className="font-bold text-gray-800">৳ {subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ডিসকাউন্ট:</span>
                      <span className="font-bold text-gray-800">-৳ {discount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ডেলিভারি চার্জ:</span>
                      <span className="font-bold text-gray-800">৳ {deliveryCharge}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-dashed border-gray-200">
                      <span className="text-gray-800">সর্বমোট:</span>
                      <span className="text-[#1a80c2]">৳ {total}</span>
                    </div>
                  </div>

                  <div className="pt-4 text-center">
                    <button className="text-xs font-medium text-gray-500 hover:text-[#1a80c2] transition-colors">আপনার কাছে কি কোনো কুপন কোড আছে?</button>
                  </div>

                  <div className="space-y-3 pt-6">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting || cart.length === 0}
                      className="w-full bg-[#FF5722] text-white py-3.5 rounded-sm font-bold text-sm md:text-base hover:bg-[#E64A19] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                      <span>{isSubmitting ? "অর্ডার প্রসেস হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}</span>
                    </button>
                    <Link href="/" className="w-full py-2 flex items-center justify-center text-gray-500 text-sm font-medium hover:text-[#1a80c2] transition-colors gap-2 group">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                      <span>কার্টে ফিরে যান</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />

      {/* Premium Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl border border-gray-100 transform scale-100 transition-all duration-300 relative overflow-hidden">
            {/* Success Glowing Gradient Header */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400"></div>

            {/* Animated Glowing Success Icon */}
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 relative">
              <div className="absolute inset-0 bg-green-100/60 rounded-full animate-ping opacity-75"></div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 text-green-500 relative z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">অর্ডার সফল হয়েছে!</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে। আমাদের কাস্টমার প্রতিনিধি শীঘ্রই আপনার ঠিকানায় ডেলিভারি নিশ্চিত করতে ফোনে যোগাযোগ করবেন।
            </p>

            {/* Order Brief Summary Card */}
            <div className="bg-gray-50 rounded-xl p-4 my-6 border border-gray-100 text-left space-y-2.5 text-xs md:text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">অর্ডার নম্বর:</span>
                <span className="font-bold text-gray-800">#{placedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">পেমেন্ট পদ্ধতি:</span>
                <span className="font-bold text-gray-800 uppercase">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'bKash'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">সর্বমোট মূল্য:</span>
                <span className="font-bold text-green-600">৳ {total}</span>
              </div>
            </div>

            {/* Modern Premium Actions */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  if (isLoggedIn) {
                    router.push("/account");
                  } else {
                    router.push(`/track-order?id=${placedOrderId}`);
                  }
                }}
                className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white py-3 rounded-lg font-bold text-sm shadow-md shadow-orange-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>অর্ডার ট্র্যাক করুন</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/");
                }}
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-lg font-bold text-sm transition-all active:scale-[0.98]"
              >
                কেনাকাটা চালিয়ে যান
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Minimalist Custom Alert Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center border border-gray-200 relative transform scale-100 transition-all duration-300">
            {/* Minimalist Error Icon */}
            <div className="text-red-550 mb-3 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-1.5">{errorModal.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              {errorModal.message}
            </p>

            <button
              onClick={() => setErrorModal({ ...errorModal, show: false })}
              className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white py-2.5 rounded-lg font-bold text-xs transition-colors active:scale-[0.98]"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
