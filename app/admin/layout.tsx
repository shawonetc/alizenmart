"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  DashboardCircleIcon, 
  PackageIcon, 
  ShoppingCart01Icon, 
  Folder01Icon, 
  UserGroupIcon, 
  Settings03Icon,
  Logout01Icon,
  Menu01Icon,
  Notification03Icon,
  UserIcon
} from "@hugeicons/core-free-icons";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    setCheckingAuth(true);
    try {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      if (error || !currentUser) {
        window.location.href = "/login?redirect=/admin";
        return;
      }

      const adminEmails = [
        "blackrisebd@gmail.com",
        "admin@1stopdokan.com",
        "1stopdokan@gmail.com",
      ];
      const email = String(currentUser.email || "").toLowerCase();
      const isWhitelisted = 
        adminEmails.includes(email) || 
        email.startsWith("admin@") || 
        email.includes("admin") || 
        email.includes("shawon") ||
        email.includes("banik");
      const hasAdminMeta = currentUser.user_metadata?.role === "admin" || currentUser.user_metadata?.is_admin === true;

      if (!isWhitelisted && !hasAdminMeta) {
        alert("Access Denied: You do not have administrator privileges.");
        window.location.href = "/";
        return;
      }

      setUser(currentUser);
    } catch (err) {
      console.error("Admin authentication check failed:", err);
      window.location.href = "/login?redirect=/admin";
    } finally {
      setCheckingAuth(false);
    }
  };

  const menuItems = [
    { name: "Overview", href: "/admin", icon: DashboardCircleIcon },
    { name: "Products", href: "/admin/products", icon: PackageIcon },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart01Icon },
    { name: "Categories", href: "/admin/categories", icon: Folder01Icon },
    { name: "Users", href: "/admin/users", icon: UserGroupIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings03Icon },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-[#1a80c2] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-bold text-gray-600 animate-pulse">Verifying Administrator Access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/45 z-40 md:hidden transition-opacity duration-300 backdrop-blur-[1px]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:fixed md:left-0 md:top-0 md:bottom-0 h-full md:h-screen z-50 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isSidebarOpen ? "w-64 md:w-64" : "w-64 md:w-20"}
        `}
      >
        <div className="p-6 flex items-center gap-2 border-b border-gray-50 h-20">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="relative h-12 w-12">
                <Image 
                  src="/logo/logo3.jpeg" 
                  alt="1stopDokan Admin Logo" 
                  fill
                  sizes="48px"
                  className="object-contain object-left" 
                  priority
                />
              </div>
              <span className="bg-orange-50 text-[#FF5722] text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                Admin
              </span>
            </div>
          ) : (
            <div className="w-9 h-9 bg-gradient-to-tr from-[#FF5722] to-orange-400 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md mx-auto">
              F
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-[#1a80c2] text-white shadow-lg shadow-blue-100" 
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <HugeiconsIcon 
                  icon={item.icon} 
                  size={20} 
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-gray-50">
          <Link href="/" className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
            <HugeiconsIcon icon={Logout01Icon} size={20} />
            {isSidebarOpen && <span className="font-medium">Exit Admin</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarOpen ? "md:pl-64" : "md:pl-20"
      }`}>
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
           <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} className="text-gray-600" />
          </button>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              <HugeiconsIcon icon={Notification03Icon} size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3 border-l pl-4 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin"}
                </p>
                <p className="text-[10px] text-green-600 font-extrabold uppercase tracking-wider">
                  {user?.user_metadata?.role || "Administrator"}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-[#1a80c2] to-blue-400 text-white rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden font-black text-sm uppercase">
                {user?.user_metadata?.full_name ? user.user_metadata.full_name.substring(0, 2) : "AD"}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 flex-1">
          <React.Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-[#1a80c2] rounded-full animate-spin" />
              <p className="text-gray-500 font-medium text-sm">Loading...</p>
            </div>
          }>
            {children}
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
