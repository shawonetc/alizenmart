"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const Footer = () => {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full relative">
      {/* Main Footer Container */}
      <div className="bg-[#1a80c2] pt-12 pb-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            
            {/* Column 1 - Brand Info */}
            <div className="space-y-4">
              <div className="relative h-10 w-36">
                <Image 
                  src="/logo/logo2_sb.png" 
                  alt="Speed Bazar Logo" 
                  fill
                  sizes="144px"
                  className="object-contain object-left" 
                  priority
                />
              </div>
              <p className="text-[#0c4063] text-xs md:text-sm leading-relaxed font-medium pr-2">
                Speed Bazar is your trusted online shopping destination for premium apparel and accessories. We bring you high-quality products, smart fashion deals, and reliable service all in one place.
              </p>
              
              {/* Circular Social Icons */}
              <div className="flex gap-2.5 pt-2">
                <Link 
                  href="https://www.facebook.com/speedbazar" 
                  target="_blank"
                  className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:bg-[#FF5722] hover:scale-105 active:scale-95 transition-all shadow-sm"
                  title="Facebook"
                >
                  <svg className="w-5 h-5 text-[#FF5722] hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </Link>
                <Link 
                  href="https://wa.me/8801723523706" 
                  target="_blank"
                  className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:bg-[#FF5722] hover:scale-105 active:scale-95 transition-all shadow-sm"
                  title="WhatsApp"
                >
                  <svg className="w-5 h-5 text-[#FF5722] hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.989 3.3 1.572 4.975 1.573 5.485.001 9.948-4.407 9.95-9.82 0-2.623-1.026-5.09-2.89-6.956-1.864-1.865-4.343-2.892-6.965-2.893-5.49 0-9.953 4.41-9.956 9.823-.001 1.838.485 3.635 1.408 5.215l-1.02 3.722 3.82-1.002zM17.15 14.5c-.282-.14-.1.35-.4-.5-.15-.3-.55-.45-.85-.5-1.044-.22-1.838-.9-2.2-.6-.4-.3-.85-.15-1.25.15a13.3 13.3 0 0 1-2.95-2.95c-.3-.4-.45-.85-.15-1.25.3-.4.82-.95.6-2.2-.05-.3-.2-.7-.5-.85-.85-.3-.36-.118-.5-.4-.14-.282-.5.15-.5.45A3.85 3.85 0 0 0 9 7.5c.28.8 1.62 3.32 4.2 4.48.55.25 1.15.4 1.7.4.45 0 .9-.05 1.25-.2.55-.25 1-.6 1.15-.9.15-.3.15-.55.1-.65-.05-.1-.2-.25-.3-.3z"/>
                  </svg>
                </Link>
                <Link 
                  href="https://m.me/speedbazar" 
                  target="_blank"
                  className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:bg-[#FF5722] hover:scale-105 active:scale-95 transition-all shadow-sm"
                  title="Messenger (Speed Bazar)"
                >
                  <svg className="w-5 h-5 text-[#FF5722] hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.145 2 11.243a9.096 9.096 0 0 0 3.256 6.945V22l3.664-2.023A10.747 10.747 0 0 0 12 20.486c5.523 0 10-4.146 10-9.243S17.523 2 12 2zm1.096 11.968l-2.584-2.756-5.048 2.756 5.548-5.892 2.628 2.756 5.004-2.756-5.548 5.892z"/>
                  </svg>
                </Link>
              </div>
            </div>
 
            {/* Column 2 - Contact Us */}
            <div className="space-y-4">
              <h4 className="text-[#093554] font-bold text-base md:text-lg">Contact Us</h4>
              <ul className="space-y-3.5">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#0a3a5a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span className="text-[#0c4063] font-medium text-xs md:text-sm">speedbazar07@gmail.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#0a3a5a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.157-.44.009-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z" />
                  </svg>
                  <span className="text-[#0c4063] font-medium text-xs md:text-sm">01723-523706</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0a3a5a] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
                  </svg>
                  <span className="text-[#0c4063] font-medium text-xs md:text-sm leading-relaxed">
                    151/1 Zonaki road Ahmednagor Mirpur-1 Dhaka-1216
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#0a3a5a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[#0c4063] font-medium text-xs md:text-sm">Always open</span>
                </li>
              </ul>
            </div>
 
            {/* Column 3 - About Us */}
            <div className="space-y-4">
              <h4 className="text-[#093554] font-bold text-base md:text-lg">About Us</h4>
              <ul className="space-y-2.5 text-xs md:text-sm font-medium text-[#0c4063]">
                <li><Link href="/" className="hover:text-[#093554] hover:underline transition-colors block py-0.5">Return & Refund Policy</Link></li>
                <li><Link href="/" className="hover:text-[#093554] hover:underline transition-colors block py-0.5">Privacy Policy</Link></li>
                <li><Link href="/" className="hover:text-[#093554] hover:underline transition-colors block py-0.5">Terms and Conditions</Link></li>
                <li><Link href="/" className="hover:text-[#093554] hover:underline transition-colors block py-0.5">About us</Link></li>
              </ul>
            </div>
 
            {/* Column 4 - Useful Links */}
            <div className="space-y-4">
              <h4 className="text-[#093554] font-bold text-base md:text-lg">Useful Links</h4>
              <ul className="space-y-2.5 text-xs md:text-sm font-medium text-[#0c4063]">
                <li><Link href="/" className="hover:text-[#093554] hover:underline transition-colors block py-0.5">Why Shop Online with Us</Link></li>
                <li><Link href="/" className="hover:text-[#093554] hover:underline transition-colors block py-0.5">Online Payment Methods</Link></li>
                <li><Link href="/" className="hover:text-[#093554] hover:underline transition-colors block py-0.5">After Sales Support</Link></li>
                <li><Link href="/" className="hover:text-[#093554] hover:underline transition-colors block py-0.5">FAQ</Link></li>
              </ul>
            </div>
 
          </div>
        </div>
      </div>
 
      {/* Footer Bottom copyright Bar */}
      <div className="bg-[#eaeaea] py-4 border-t border-gray-200">
        <p className="text-center text-xs md:text-sm font-bold text-gray-700">
          Copyright © {year} Speed Bazar
        </p>
      </div>
 
      {/* Floating chat bubble on bottom right */}
      <div className="fixed bottom-28 md:bottom-6 right-6 z-40">
        <Link 
          href="https://wa.me/8801723523706" 
          target="_blank"
          className="w-12 h-12 md:w-14 md:h-14 bg-[#FF5722] hover:bg-[#E64A19] hover:scale-105 active:scale-95 transition-all text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
          aria-label="Chat with Us"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
          </svg>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
