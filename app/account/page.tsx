"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("My Account");
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        fetchUserData(user.id);
      }
      setLoading(false);
    };

    getUser();
  }, [router]);

  const fetchUserData = async (userId: string) => {
    // Fetch orders (Assume table exists, handle error gracefully)
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!ordersError && ordersData) {
      setOrders(ordersData as any);
    } else {
      // Fallback to localStorage if table doesn't exist in Supabase
      const localOrders = JSON.parse(localStorage.getItem("local_orders") || "[]");
      const userLocalOrders = localOrders.filter((o: any) => o.user_id === userId);
      setOrders(userLocalOrders as any);
    }

    // Fetch wishlist
    const { data: wishlistData, error: wishlistError } = await supabase
      .from('wishlist')
      .select('*, products(*)')
      .eq('user_id', userId);
    
    if (!wishlistError && wishlistData) setWishlist(wishlistData as any);
  };

  const handleLogout = async () => {
    setIsSignOutLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    { name: "My Account", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    )},
    { name: "My Orders", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ), count: orders.length },
    { name: "My Wishlists", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.780 9-12z" />
      </svg>
    ), count: wishlist.length },
    { name: "My Address", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    )},
    { name: "My Reviews", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    )},
    { name: "Setting", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#1a80c2]/30 border-t-[#1a80c2] rounded-full animate-spin"></div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!user) return null;

  const fullName = user.user_metadata?.full_name || "shawon";
  const email = user.email || "blackrisebd@gmail.com";
  const phone = user.user_metadata?.mobile_number || "-";
  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header />
      
      <main className="flex-1 py-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar Menu */}
          <div className="lg:col-span-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-bold text-sm transition-all border ${
                  activeTab === item.name 
                    ? "bg-[#FF5722] text-white border-[#FF5722] shadow-lg shadow-orange-100" 
                    : "bg-white text-gray-600 border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.name}
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === item.name ? "bg-white text-orange-600" : "bg-gray-100 text-gray-500"}`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={handleLogout}
              disabled={isSignOutLoading}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm bg-white text-gray-500 border border-gray-100 hover:border-red-100 hover:text-red-500 transition-all mt-4 disabled:opacity-50"
            >
              {isSignOutLoading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              )}
              {isSignOutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>

          {/* Middle Content Section */}
          <div className="lg:col-span-2 space-y-6">
            {(activeTab === "My Account" || activeTab === "My Orders") && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 flex justify-between items-center border-b border-gray-50">
                  <h2 className="font-bold text-gray-800 text-lg">My Order</h2>
                  <Link href="/" className="text-[#FF5722] border border-[#FF5722] px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-orange-50 transition-colors">
                    Create Order
                  </Link>
                </div>
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                  {orders.length > 0 ? (
                    <div className="w-full space-y-4">
                      {orders.map((order: any) => (
                        <div key={order.id} className="p-4 border border-gray-50 rounded-xl text-left">
                           <div className="flex justify-between items-center mb-2">
                             <span className="font-bold text-sm">Order #{String(order.id).substring(0,8)}</span>
                             <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</span>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-sm font-bold text-orange-600">৳ {order.total || order.total_amount || 0}</span>
                             <span className="text-[10px] uppercase font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{order.status}</span>
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="relative w-20 h-20 opacity-20">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gray-400">
                          <path d="M19 11V17C19 18.8856 19 19.8284 18.4142 20.4142C17.8284 21 16.8856 21 15 21H9C7.11438 21 6.17157 21 5.58579 20.4142C5 19.8284 5 18.8856 5 17V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M21 7V9C21 9.94281 21 10.4142 20.7071 10.7071C20.4142 11 19.9428 11 19 11H5C4.05719 11 3.58579 11 3.29289 10.7071C3 10.4142 3 9.94281 3 9V7C3 6.05719 3 5.58579 3.29289 5.29289C3.58579 5 4.05719 5 5 5H19C19.9428 5 20.4142 5 20.7071 5.29289C21 5.58579 21 6.05719 21 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M12 15L12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p className="font-bold text-gray-800">Your Order List is Empty!</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {(activeTab === "My Account" || activeTab === "My Wishlists") && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 flex justify-between items-center border-b border-gray-50">
                  <h2 className="font-bold text-gray-800 text-lg">My Wishlists</h2>
                  <Link href="/" className="text-[#FF5722] border border-[#FF5722] px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-orange-50 transition-colors">
                    Add Wishlist
                  </Link>
                </div>
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                  {wishlist.length > 0 ? (
                    <div className="w-full grid grid-cols-2 gap-4">
                      {/* Wishlist items rendering */}
                    </div>
                  ) : (
                    <>
                      <div className="relative w-20 h-20 opacity-20">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gray-400">
                          <path d="M12 21L10.55 19.705C5.4 15.04 2 12 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12 18.6 15.04 13.45 19.71L12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p className="font-bold text-gray-800">Your Wish List is Empty!</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col items-center">
              <div className="relative w-30 h-30 mb-6 ring-4 ring-orange-50 rounded-full flex items-center justify-center p-0.5">
                <div className="w-28 h-28 bg-gradient-to-tr from-[#FF5722] to-orange-400 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
              </div>
              
              <div className="w-full space-y-1 text-left">
                <h3 className="font-bold text-gray-900 text-lg">Name: {fullName}</h3>
                <p className="text-gray-500 text-sm">Phone No: {phone}</p>
                <p className="text-gray-500 text-sm break-all">Email: {email}</p>
                <p className="text-gray-400 text-xs mt-2">Member Since: {memberSince}</p>
              </div>

              <div className="w-full mt-6 bg-orange-50/50 rounded-2xl p-4 flex items-center justify-between border border-orange-100/50 group cursor-pointer hover:bg-orange-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF5722" className="w-6 h-6">
                      <path d="M9.375 3a1.875 1.875 0 000 3.75h.375v4.5H9.375a1.875 1.875 0 000 3.75h.375v4.5H9.375a1.875 1.875 0 100 3.75h5.25a1.875 1.875 0 100-3.75h-.375v-4.5h.375a1.875 1.875 0 100-3.75h-.375v-4.5h.375a1.875 1.875 0 100-3.75h-5.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reward Points</p>
                    <p className="text-lg font-bold text-orange-600">0 points</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>

              <button className="w-full mt-6 py-2.5 border border-orange-200 text-[#FF5722] rounded-xl font-bold text-sm hover:bg-[#FF5722] hover:text-white transition-all shadow-sm active:scale-[0.98]">
                Edit
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
