"use client";

import React, { useState, useRef, useCallback, useId } from "react";
import { supabase } from "@/lib/supabase";

/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */
interface ImageItem {
  id: string;
  url: string;
  file?: File;
  progress: number;
  error?: string;
  uploading: boolean;
}

interface MultiImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function formatBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/* ─────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────── */
export default function MultiImageUploader({
  images,
  onChange,
  maxImages = 10,
}: MultiImageUploaderProps) {
  const [items, setItems] = useState<ImageItem[]>(() =>
    images.map((url) => ({ id: uid(), url, progress: 100, uploading: false }))
  );
  const [zoneDragging, setZoneDragging] = useState(false);
  const dragIndexRef = useRef<number | null>(null);
  const inputId = useId();

  const syncParent = useCallback(
    (next: ImageItem[]) => {
      onChange(next.filter((i) => i.url && !i.uploading && !i.error).map((i) => i.url));
    },
    [onChange]
  );

  /* ── Upload ── */
  const uploadFile = useCallback(
    async (file: File, itemId: string) => {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `${Date.now()}-${uid()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const progressTimer = setInterval(() => {
        setItems((prev) =>
          prev.map((i) =>
            i.id === itemId && i.progress < 85 ? { ...i, progress: i.progress + 15 } : i
          )
        );
      }, 200);

      try {
        const { error } = await supabase.storage
          .from("images")
          .upload(filePath, file, { cacheControl: "3600", upsert: true });
        clearInterval(progressTimer);
        if (error) throw error;

        const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath);
        setItems((prev) => {
          const next = prev.map((i) =>
            i.id === itemId
              ? { ...i, url: urlData.publicUrl, progress: 100, uploading: false, file: undefined }
              : i
          );
          syncParent(next);
          return next;
        });
      } catch (err: any) {
        clearInterval(progressTimer);
        setItems((prev) => {
          const next = prev.map((i) =>
            i.id === itemId ? { ...i, uploading: false, progress: 0, error: err.message ?? "Upload failed" } : i
          );
          syncParent(next);
          return next;
        });
      }
    },
    [syncParent]
  );

  /* ── Add files ── */
  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArr = Array.from(files);
      const currentDone = items.filter((i) => i.url && !i.error).length;
      const slots = maxImages - currentDone;
      if (slots <= 0) return;

      const toProcess = fileArr.slice(0, slots);
      const newItems: ImageItem[] = [];
      const errors: string[] = [];

      for (const file of toProcess) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          errors.push(`"${file.name}" – শুধু JPG, PNG বা WEBP সমর্থিত`);
          continue;
        }
        if (file.size > MAX_SIZE_BYTES) {
          errors.push(`"${file.name}" – সাইজ বেশি (${formatBytes(file.size)} > 5 MB)`);
          continue;
        }
        newItems.push({ id: uid(), url: "", file, progress: 0, uploading: true });
      }

      if (errors.length) alert(errors.join("\n"));
      if (!newItems.length) return;

      setItems((prev) => [...prev, ...newItems]);
      for (const item of newItems) uploadFile(item.file!, item.id);
    },
    [items, maxImages, uploadFile]
  );

  /* ── Drop zone ── */
  const onZoneDragOver = (e: React.DragEvent) => { e.preventDefault(); setZoneDragging(true); };
  const onZoneDragLeave = () => setZoneDragging(false);
  const onZoneDrop = (e: React.DragEvent) => {
    e.preventDefault(); setZoneDragging(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  /* ── Remove ── */
  const handleRemove = (id: string) => {
    setItems((prev) => { const next = prev.filter((i) => i.id !== id); syncParent(next); return next; });
  };

  /* ── Set Primary (move to index 0) ── */
  const handleSetPrimary = (id: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === 0) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.unshift(item);
      syncParent(next);
      return next;
    });
  };

  /* ── DnD reorder ── */
  const onItemDragStart = (e: React.DragEvent, index: number) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    const ghost = document.createElement("div");
    ghost.style.position = "absolute";
    ghost.style.top = "-9999px";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const onItemDragEnter = (index: number) => {
    if (dragIndexRef.current === null || dragIndexRef.current === index) return;
    setItems((prev) => {
      const next = [...prev];
      const from = dragIndexRef.current!;
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      dragIndexRef.current = index;
      return next;
    });
  };

  const onItemDragEnd = () => {
    dragIndexRef.current = null;
    setItems((prev) => { syncParent(prev); return prev; });
  };

  /* ── Retry ── */
  const handleRetry = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item?.file) return prev;
      const next = prev.map((i) => i.id === id ? { ...i, uploading: true, progress: 0, error: undefined } : i);
      uploadFile(item.file, id);
      return next;
    });
  };

  const committedCount = items.filter((i) => i.url && !i.error).length;
  const canAddMore = committedCount < maxImages;

  return (
    <div className="space-y-5">

      {/* ══════════════════════════════════════════
          UPLOADED IMAGES GRID
      ══════════════════════════════════════════ */}
      {items.length > 0 && (
        <div className="space-y-3">

          {/* ── PRIMARY IMAGE (first slot — always bigger / highlighted) ── */}
          {items[0] && (
            <div>
              {/* Label */}
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-[#1a80c2] text-white text-[11px] font-black px-3 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  PRIMARY IMAGE
                </span>
                <span className="text-[11px] text-gray-400 font-medium">প্রোডাক্টের মূল ছবি — সবখানে এটি দেখাবে</span>
              </div>

              {/* Primary card */}
              <div
                draggable={!!items[0].url && !items[0].uploading}
                onDragStart={(e) => onItemDragStart(e, 0)}
                onDragEnter={() => onItemDragEnter(0)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={onItemDragEnd}
                className={`relative rounded-2xl overflow-hidden border-2 border-[#1a80c2] bg-white shadow-md shadow-blue-50 select-none
                  ${items[0].url && !items[0].uploading ? "cursor-grab active:cursor-grabbing" : ""}
                  ${items[0].error ? "border-red-300 bg-red-50" : ""}
                `}
                style={{ aspectRatio: "16/9" }}
              >
                {/* Blue corner ribbon */}
                <div className="absolute top-0 left-0 z-20 bg-[#1a80c2] text-white text-[9px] font-black px-3 py-1 rounded-br-xl flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  PRIMARY
                </div>

                {/* Uploading */}
                {items[0].uploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white">
                    <div className="w-10 h-10 border-4 border-blue-100 border-t-[#1a80c2] rounded-full animate-spin" />
                    <div className="w-48 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="h-2 bg-[#1a80c2] rounded-full transition-all duration-300" style={{ width: `${items[0].progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-400">{items[0].progress}% আপলোড হচ্ছে...</span>
                  </div>
                )}

                {/* Error */}
                {items[0].error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center bg-red-50">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                    <p className="text-xs text-red-500 font-bold">{items[0].error}</p>
                    <button type="button" onClick={() => handleRetry(items[0].id)} className="text-xs font-black text-[#1a80c2] hover:underline">Retry</button>
                  </div>
                )}

                {/* Image */}
                {items[0].url && !items[0].uploading && !items[0].error && (
                  <>
                    <img src={items[0].url} alt="Primary" className="w-full h-full object-contain p-4" draggable={false} />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all duration-200 opacity-0 hover:opacity-100 flex items-center justify-center gap-2">
                      <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" /></svg>
                        Drag to reorder
                      </span>
                      <button type="button" onClick={() => handleRemove(items[0].id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-all active:scale-95">
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── ADDITIONAL IMAGES (index 1+) ── */}
          {items.length > 1 && (
            <div>
              {/* Label */}
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-[11px] font-black px-3 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                  ADDITIONAL IMAGES
                </span>
                <span className="text-[11px] text-gray-400 font-medium">গ্যালারিতে দেখাবে — ক্লিক করে primary বানাতে পারবেন</span>
              </div>

              {/* Additional grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                {items.slice(1).map((item, i) => {
                  const realIndex = i + 1;
                  return (
                    <div
                      key={item.id}
                      draggable={!!item.url && !item.uploading}
                      onDragStart={(e) => onItemDragStart(e, realIndex)}
                      onDragEnter={() => onItemDragEnter(realIndex)}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnd={onItemDragEnd}
                      className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all select-none
                        ${item.uploading ? "bg-gray-50 border-gray-100" : "bg-white border-gray-100 hover:border-gray-300 cursor-grab active:cursor-grabbing"}
                        ${item.error ? "border-red-200 bg-red-50" : ""}
                      `}
                    >
                      {/* Uploading */}
                      {item.uploading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2">
                          <div className="w-6 h-6 border-3 border-blue-100 border-t-[#1a80c2] rounded-full animate-spin" />
                          <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                            <div className="h-1 bg-[#1a80c2] rounded-full transition-all duration-300" style={{ width: `${item.progress}%` }} />
                          </div>
                          <span className="text-[9px] font-bold text-gray-400">{item.progress}%</span>
                        </div>
                      )}

                      {/* Error */}
                      {item.error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2 text-center">
                          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                          <p className="text-[8px] text-red-400 font-bold leading-tight">{item.error}</p>
                          <button type="button" onClick={() => handleRetry(item.id)} className="text-[8px] font-black text-[#1a80c2]">Retry</button>
                        </div>
                      )}

                      {/* Image */}
                      {item.url && !item.uploading && !item.error && (
                        <>
                          <img src={item.url} alt={`Image ${realIndex + 1}`} className="w-full h-full object-cover" draggable={false} />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-200 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 p-1.5">
                            <button type="button" onClick={() => handleSetPrimary(item.id)}
                              className="bg-[#1a80c2] hover:bg-[#166ca5] text-white text-[9px] font-black px-2 py-1 rounded-lg shadow w-full text-center transition-all active:scale-95">
                              ⭐ Primary বানাও
                            </button>
                            <button type="button" onClick={() => handleRemove(item.id)}
                              className="bg-red-500 hover:bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow w-full text-center transition-all active:scale-95">
                              ✕ Remove
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {/* Add more tile */}
                {canAddMore && (
                  <label
                    onDragOver={onZoneDragOver}
                    onDragLeave={onZoneDragLeave}
                    onDrop={onZoneDrop}
                    className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all
                      ${zoneDragging ? "border-[#1a80c2] bg-blue-50/40 scale-95" : "border-gray-200 hover:border-[#1a80c2] hover:bg-blue-50/20"}
                    `}
                  >
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <span className="text-[9px] font-bold text-gray-400">Add More</span>
                    <span className="text-[8px] text-gray-300 font-medium">{committedCount}/{maxImages}</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
                      onChange={(e) => e.target.files && handleFiles(e.target.files)} />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* If only 1 image uploaded and can add more — show add-more button below primary */}
          {items.length === 1 && canAddMore && (
            <label
              onDragOver={onZoneDragOver}
              onDragLeave={onZoneDragLeave}
              onDrop={onZoneDrop}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all
                ${zoneDragging ? "border-[#1a80c2] bg-blue-50/30" : "border-gray-200 hover:border-[#1a80c2] hover:bg-blue-50/10"}
              `}
            >
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </div>
              <span className="text-xs font-bold text-gray-400">আরও ছবি যোগ করুন</span>
              <span className="text-[10px] text-gray-300 font-medium">({committedCount}/{maxImages})</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            </label>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          EMPTY STATE (no images yet)
      ══════════════════════════════════════════ */}
      {items.length === 0 && (
        <div
          onDragOver={onZoneDragOver}
          onDragLeave={onZoneDragLeave}
          onDrop={onZoneDrop}
          className={`relative rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 py-12 px-6
            ${zoneDragging ? "border-[#1a80c2] bg-blue-50/30 scale-[0.99]" : "border-gray-200 bg-gray-50 hover:border-gray-300"}
          `}
        >
          {/* Decorative stack */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute w-12 h-12 bg-gray-200 rounded-xl rotate-6 opacity-60" />
            <div className="absolute w-12 h-12 bg-gray-200 rounded-xl -rotate-6 opacity-40" />
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-300 relative z-10">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          </div>

          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-gray-700">
              <label htmlFor={`${inputId}-main`} className="text-[#1a80c2] hover:underline cursor-pointer">
                Click to upload
              </label>
              {" "}or drag &amp; drop
            </p>
            <p className="text-xs text-gray-400 font-medium">JPG, PNG or WEBP · Max 5MB each · Up to {maxImages} images</p>
          </div>

          <input id={`${inputId}-main`} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        </div>
      )}

      {/* ── Bottom info row ── */}
      <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium px-1">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
          Drag করে ছবির order পরিবর্তন করুন · প্রথমটি Primary হবে
        </span>
        <span className={committedCount >= maxImages ? "text-amber-500 font-bold" : ""}>
          {committedCount}/{maxImages} images
        </span>
      </div>
    </div>
  );
}
