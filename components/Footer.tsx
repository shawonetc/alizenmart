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
      <div className="bg-[#008080] pt-12 pb-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">

            {/* Column 1 - Brand Info */}
            <div className="space-y-4">
              <div className="relative h-14 w-14">
                <Image
                  src="/logo/logo4.png"
                  alt="1stopDokan Logo"
                  fill
                  sizes="56px"
                  className="object-contain object-left"
                  priority
                />
              </div>
              <p className="text-white/90 text-xs md:text-sm leading-relaxed font-medium pr-2">
                1stopdokan.com is your trusted online shopping destination for premium apparel and accessories. We bring you high-quality products, smart fashion deals, and reliable service all in one place.
              </p>

              {/* Circular Social Icons */}
              <div className="flex gap-2.5 pt-2">
                {/* Facebook */}
                <Link
                  href="https://www.facebook.com/share/1L1BdJrBEc/"
                  target="_blank"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
                  style={{ backgroundColor: '#1877F2' }}
                  title="Facebook"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Link>
                {/* WhatsApp */}
                <Link
                  href="https://wa.me/8801940401901"
                  target="_blank"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
                  style={{ backgroundColor: '#25D366' }}
                  title="WhatsApp"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12.05 2C6.495 2 2.003 6.484 2 12.03c-.001 1.853.49 3.66 1.42 5.256L2 22l4.846-1.387A10.02 10.02 0 0 0 12.05 22c5.557 0 10.048-4.485 10.05-10.03C22.102 6.49 17.61 2.002 12.05 2zm0 18.354a8.333 8.333 0 0 1-4.254-1.164l-.305-.181-3.155.904.899-3.09-.198-.317A8.294 8.294 0 0 1 3.698 12.03C3.7 7.503 7.514 3.698 12.05 3.698c2.198 0 4.263.856 5.816 2.41a8.172 8.172 0 0 1 2.407 5.82c-.002 4.528-3.816 8.426-8.223 8.426z" />
                  </svg>
                </Link>
                {/* Messenger */}
                <Link
                  href="https://www.facebook.com/share/1L1BdJrBEc/"
                  target="_blank"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
                  style={{ background: 'linear-gradient(45deg, #0099FF, #A033FF, #FF5C87)' }}
                  title="Messenger"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.145 2 11.243a9.096 9.096 0 0 0 3.256 6.945V22l3.664-2.023A10.747 10.747 0 0 0 12 20.486c5.523 0 10-4.146 10-9.243S17.523 2 12 2zm1.096 11.968-2.584-2.756-5.048 2.756 5.548-5.892 2.628 2.756 5.004-2.756-5.548 5.892z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Column 2 - Contact Us */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-base md:text-lg">Contact Us</h4>
              <ul className="space-y-3.5">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-white/80 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span className="text-white/90 font-medium text-xs md:text-sm">stopdokan@gmail.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-white/80 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.157-.44.009-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z" />
                  </svg>
                  <span className="text-white/90 font-medium text-xs md:text-sm">01534694518</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-white/80 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
                  </svg>
                  <span className="text-white/90 font-medium text-xs md:text-sm leading-relaxed">
                    Paharpur, Badalgachi, Naogaon
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-white/80 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white/90 font-medium text-xs md:text-sm">Always open</span>
                </li>
              </ul>
            </div>

            {/* Column 3 - About Us */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-base md:text-lg">About Us</h4>
              <ul className="space-y-2.5 text-xs md:text-sm font-medium text-white/90">
                <li><Link href="/" className="hover:text-white hover:underline transition-colors block py-0.5">Return & Refund Policy</Link></li>
                <li><Link href="/" className="hover:text-white hover:underline transition-colors block py-0.5">Privacy Policy</Link></li>
                <li><Link href="/" className="hover:text-white hover:underline transition-colors block py-0.5">Terms and Conditions</Link></li>
                <li><Link href="/" className="hover:text-white hover:underline transition-colors block py-0.5">About us</Link></li>
              </ul>
            </div>

            {/* Column 4 - Useful Links */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-base md:text-lg">Useful Links</h4>
              <ul className="space-y-2.5 text-xs md:text-sm font-medium text-white/90">
                <li><Link href="/" className="hover:text-white hover:underline transition-colors block py-0.5">Why Shop Online with Us</Link></li>
                <li><Link href="/" className="hover:text-white hover:underline transition-colors block py-0.5">Online Payment Methods</Link></li>
                <li><Link href="/" className="hover:text-white hover:underline transition-colors block py-0.5">After Sales Support</Link></li>
                <li><Link href="/" className="hover:text-white hover:underline transition-colors block py-0.5">FAQ</Link></li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Bottom copyright Bar */}
      <div className="bg-[#006d6d] py-4 border-t border-white/20">
        <p className="text-center text-xs md:text-sm font-bold text-white">
          Copyright © 2026 1stopdokan.com · Developed by{" "}
          <Link href="https://demo-shawon.vercel.app/" target="_blank" className="hover:underline text-yellow-300">
            Shawon
          </Link>
        </p>
      </div>

      {/* Floating chat bubble on bottom right */}
      <div className="fixed bottom-28 md:bottom-6 right-6 z-40">
        <Link
          href="https://wa.me/8801940401901"
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
