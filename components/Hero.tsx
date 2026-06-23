"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface HeroProps {
  mainSliders?: string[];
  sideBanner1?: string;
  sideBanner2?: string;
}

const Hero = ({
  mainSliders = ["/images/hero/speedbazar.jpeg", "/images/hero/speedbazar.jpeg", "/images/hero/speedbazar.jpeg"],
  sideBanner1 = "/images/hero/ads.png",
  sideBanner2 = "/images/hero/ads2.png",
}: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!mainSliders || mainSliders.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mainSliders.length);
    }, 4000); // Slide every 4 seconds

    return () => clearInterval(timer);
  }, [mainSliders]);

  return (
    <section className="bg-white py-4 md:py-6">
      <div className="container-custom grid grid-cols-12 gap-4 md:gap-6">
        {/* Main Slider Carousel */}
        <div className="col-span-12 lg:col-span-9 relative aspect-[2.1/1] md:aspect-[2.2/1] bg-gray-150 rounded-lg md:rounded-2xl overflow-hidden shadow-sm">
          {mainSliders.map((slide, index) => (
            <div 
              key={index} 
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={slide}
                alt={`Hero Banner ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 75vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          
          {/* Slider indicators (Dots) */}
          {mainSliders.length > 1 && (
            <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
              {mainSliders.map((_, i) => (
                <button 
                  type="button"
                  key={i} 
                  onClick={() => setCurrentSlide(i)}
                  className={`w-1.5 h-1.5 md:w-6 md:h-1.5 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'bg-[#FF5722] w-3 md:w-8' : 'bg-white/80 hover:bg-white shadow-sm'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Side Banners */}
        <div className="col-span-12 lg:col-span-3 flex flex-row lg:flex-col gap-3 md:gap-6">
          <div className="relative flex-1 aspect-[1.2/1] lg:aspect-auto rounded-lg md:rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <Image
              src={sideBanner1}
              alt="Side Banner 1"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="relative flex-1 aspect-[1.2/1] lg:aspect-auto rounded-lg md:rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <Image
              src={sideBanner2}
              alt="Side Banner 2"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
