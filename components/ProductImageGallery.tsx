"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
  discountPercent?: number;
}

export default function ProductImageGallery({
  images,
  title,
  discountPercent = 0,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Touch / swipe state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const validImages = images.filter(Boolean);
  const total = validImages.length;
  const current = validImages[activeIndex] ?? "/placeholder.png";

  /* ── Navigate ── */
  const goTo = useCallback(
    (idx: number, animate = true) => {
      if (idx === activeIndex) return;
      if (animate) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }
      setActiveIndex(((idx % total) + total) % total);
      setZoomed(false);
    },
    [activeIndex, total]
  );

  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  /* ── Scroll active thumbnail into view ── */
  useEffect(() => {
    const container = thumbsRef.current;
    if (!container) return;
    const activeThumb = container.children[activeIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    }
  }, [activeIndex]);

  /* ── Zoom: track mouse position ── */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleMouseLeave = () => {
    if (zoomed) setZoomed(false);
  };

  /* ── Touch swipe ── */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (total === 0) return null;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* ════════════════════════════════
          MAIN IMAGE
      ════════════════════════════════ */}
      <div
        ref={mainRef}
        className={`relative w-full aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm select-none
          ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}
        `}
        onClick={() => setZoomed((z) => !z)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-20 bg-[#e5ffe5] text-[#00b300] text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm">
            -{discountPercent}% OFF
          </div>
        )}

        {/* Image counter */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full">
            {activeIndex + 1} / {total}
          </div>
        )}

        {/* Zoom hint */}
        <div className={`absolute top-3 right-3 z-20 bg-black/30 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-opacity ${zoomed ? "opacity-0" : "opacity-80"}`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803zM10.5 7.5v6m3-3h-6" />
          </svg>
          Zoom
        </div>

        {/* Main image with zoom */}
        <div
          className={`w-full h-full transition-transform duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
          style={
            zoomed
              ? {
                  transform: `scale(2.2)`,
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transition: "transform-origin 0s",
                }
              : undefined
          }
        >
          <Image
            src={current}
            alt={`${title} — image ${activeIndex + 1}`}
            fill
            className="object-contain p-3"
            priority={activeIndex === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Prev / Next arrows (only if multiple images) */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-gray-100 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-gray-100 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              aria-label="Next image"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ════════════════════════════════
          THUMBNAIL STRIP (horizontal on mobile, vertical on desktop)
      ════════════════════════════════ */}
      {total > 1 && (
        <div
          ref={thumbsRef}
          className="flex flex-row gap-2 overflow-x-auto md:overflow-x-visible md:overflow-y-auto no-scrollbar pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`relative flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200
                w-[72px] h-[72px]
                ${idx === activeIndex
                  ? "border-[#FF5722] shadow-md shadow-orange-100 scale-105"
                  : "border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100"
                }
              `}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className="object-contain p-1.5 bg-white"
                sizes="80px"
              />
              {/* Primary badge on first thumbnail */}
              {idx === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-[#FF5722]/80 text-white text-[8px] font-black text-center py-0.5 leading-none">
                  PRIMARY
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ════════════════════════════════
          DOT INDICATORS (mobile only, shown when no thumbnails visible)
      ════════════════════════════════ */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 md:hidden">
          {validImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`rounded-full transition-all duration-300
                ${idx === activeIndex ? "w-5 h-2 bg-[#FF5722]" : "w-2 h-2 bg-gray-300"}
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}
