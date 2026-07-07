"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const BottomNav = () => {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      path: "/",
    },
    {
      name: "Categories",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      ),
      path: "/categories",
    },
    {
      name: "Chat",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.598.598 0 0 1-.474-.065.598.598 0 0 1-.22-.35 1.293 1.293 0 0 1 .035-.521c.19-.73.357-1.476.5-2.231C3.787 16.316 3 14.242 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      ),
      path: "#",
      onClick: () => setIsChatOpen(true),
    },
    {
      name: "Account",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ),
      path: "/account",
    },
  ];

  return (
    <>
      {/* Chat Popup Overlay */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[101] md:hidden"
          onClick={() => setIsChatOpen(false)}
        ></div>
      )}

      {/* Chat Action Buttons */}
      <div className={`fixed bottom-20 right-[12.5%] flex flex-col items-center gap-4 z-[102] md:hidden transition-all duration-300 ${isChatOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
        {/* Call Button */}
        <a href="tel:01771680742" className="w-12 h-12 bg-[#00E676] rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </a>
        {/* WhatsApp Button */}
        <a href="https://wa.me/8801771680742" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.433 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
        {/* Messenger Button */}
        <a href="https://m.me/speedbazar" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#0084FF] rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.303 2.256.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.194l-3.076-3.281-5.995 3.281 6.592-7.003 3.156 3.281 5.915-3.281-6.592 7.003z" />
          </svg>
        </a>
        {/* Close Button */}
        <button 
          onClick={() => setIsChatOpen(false)}
          className="w-12 h-12 bg-[#FF5722] rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a80c2] text-white border-t border-white/10 z-[100] md:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Content = (
              <div className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                pathname === item.path ? "text-white" : "text-white/70"
              }`}>
                <div className="relative">
                  {item.icon}
                </div>
                <span className="text-[10px] font-medium">{item.name}</span>
              </div>
            );

            if (item.onClick) {
              return (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="w-full h-full"
                >
                  {Content}
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.path}
                className="w-full h-full"
              >
                {Content}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
