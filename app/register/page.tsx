"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Clean all non-digit characters
    let cleanedPhone = mobile.replace(/\D/g, "");
    if (cleanedPhone.length === 13 && cleanedPhone.startsWith("88")) {
      cleanedPhone = cleanedPhone.substring(2);
    }

    if (cleanedPhone.length !== 11 || !cleanedPhone.startsWith("01")) {
      setError("মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে (যেমন: 01XXXXXXXXX)।");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          mobile_number: cleanedPhone,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Auto-redirect after 3 seconds or keep success message
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-10 md:py-20 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-[#1a80c2] p-8 text-center flex flex-col items-center">
            <div className="relative h-16 w-16 mb-2">
              <Image 
                src="/logo/logo3.jpeg" 
                alt="1stopDokan Logo" 
                fill
                sizes="64px"
                className="object-contain" 
                priority
              />
            </div>
            <p className="text-white/80 text-sm font-medium mt-1">Create your account and start shopping today!</p>
          </div>

          <div className="p-8 space-y-6">
            {(process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url' || 
              !process.env.NEXT_PUBLIC_SUPABASE_URL || 
              process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-xs font-medium leading-relaxed">
                <p className="font-bold mb-1 underline">Action Required:</p>
                Please update your Supabase URL and Key in <code className="bg-amber-100 px-1 rounded">.env.local</code> and **restart your dev server** to enable authentication.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.401 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm font-medium flex flex-col items-center gap-2 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                </svg>
                <p>Registration successful! Please check your email to verify your account. Redirecting to login...</p>
              </div>
            )}

            {!success && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name" 
                    required
                    className="w-full border border-gray-200 rounded-lg p-3.5 outline-none focus:border-[#1a80c2] focus:ring-1 focus:ring-[#1a80c2]/20 transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Mobile Number</label>
                  <input 
                    type="text" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter mobile number" 
                    required
                    className="w-full border border-gray-200 rounded-lg p-3.5 outline-none focus:border-[#1a80c2] focus:ring-1 focus:ring-[#1a80c2]/20 transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    required
                    className="w-full border border-gray-200 rounded-lg p-3.5 outline-none focus:border-[#1a80c2] focus:ring-1 focus:ring-[#1a80c2]/20 transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password" 
                      required
                      className="w-full border border-gray-200 rounded-lg p-3.5 pr-12 outline-none focus:border-[#1a80c2] focus:ring-1 focus:ring-[#1a80c2]/20 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" required className="mt-1 accent-[#FF5722]" />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    I agree to the <Link href="#" className="text-[#1a80c2] font-bold">Terms of Service</Link> and <Link href="#" className="text-[#1a80c2] font-bold">Privacy Policy</Link>
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF5722] text-white py-3.5 rounded-lg font-bold text-sm md:text-base hover:bg-[#E64A19] transition-all shadow-lg shadow-orange-100 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : null}
                  {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
                </button>
              </form>
            )}


            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-[#1a80c2] hover:underline">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
