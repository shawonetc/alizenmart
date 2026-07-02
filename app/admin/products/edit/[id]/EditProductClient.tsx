"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ImageAdd01Icon } from "@hugeicons/core-free-icons";
import { supabase } from "@/lib/supabase";
import { parseProductMetadata, serializeProductMetadata } from "@/lib/metadataHelper";

interface EditProductClientProps {
  id: string;
}

export default function EditProductClient({ id }: EditProductClientProps) {
  const router = useRouter();

  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    oldPrice: "",
    category: "",
    stock: "10",
    image: "",
    description: "",
    is_featured: false,
  });

  const [categories, setCategories] = useState<string[]>([]);

  // Variants States
  const [variantsEnabled, setVariantsEnabled] = useState(false);
  const [generalImages, setGeneralImages] = useState<string[]>([]);
  const [colors, setColors] = useState<{ name: string; images: string[] }[]>([]);
  const [newColorName, setNewColorName] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSizeName, setNewSizeName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [combinations, setCombinations] = useState<{
    color: string;
    size: string;
    price: string;
    oldPrice: string;
    stock: string;
    sku: string;
    enabled: boolean;
  }[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Update combinations when colors/sizes change
  useEffect(() => {
    if (!variantsEnabled) return;
    setCombinations(prev => {
      const newCombinations: typeof combinations = [];
      const titleSlug = formData.title.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 5);

      if (colors.length > 0 && sizes.length > 0) {
        colors.forEach(color => {
          sizes.forEach(size => {
            const existing = prev.find(c => c.color === color.name && c.size === size);
            if (existing) {
              newCombinations.push(existing);
            } else {
              const colorSlug = color.name.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 3);
              const sizeSlug = size.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 3);
              const autoSku = `SKU-${titleSlug}-${colorSlug}-${sizeSlug}`;
              
              newCombinations.push({
                color: color.name,
                size: size,
                price: "",
                oldPrice: "",
                stock: "10",
                sku: autoSku,
                enabled: true,
              });
            }
          });
        });
      } else if (colors.length > 0) {
        colors.forEach(color => {
          const existing = prev.find(c => c.color === color.name && c.size === "");
          if (existing) {
            newCombinations.push(existing);
          } else {
            const colorSlug = color.name.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 3);
            const autoSku = `SKU-${titleSlug}-${colorSlug}`;
            
            newCombinations.push({
              color: color.name,
              size: "",
              price: "",
              oldPrice: "",
              stock: "10",
              sku: autoSku,
              enabled: true,
            });
          }
        });
      } else if (sizes.length > 0) {
        sizes.forEach(size => {
          const existing = prev.find(c => c.color === "" && c.size === size);
          if (existing) {
            newCombinations.push(existing);
          } else {
            const sizeSlug = size.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 3);
            const autoSku = `SKU-${titleSlug}-${sizeSlug}`;
            
            newCombinations.push({
              color: "",
              size: size,
              price: "",
              oldPrice: "",
              stock: "10",
              sku: autoSku,
              enabled: true,
            });
          }
        });
      }
      return newCombinations;
    });
  }, [colors, sizes, variantsEnabled, formData.title]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("name")
        .order("name", { ascending: true });

      if (data && !error && data.length > 0) {
        setCategories(data.map((c: any) => c.name));
      } else {
        setCategories([
          "Gadgets", "Smart Electronics", "Home & Lifestyle", "Beauty & Personal", 
          "Healthy Food", "Fashion", "Mom & Baby", "Home & Kitchen", "Appliances", 
          "Fitness & Health", "Smart Watch", "Religious", "Peripherals", 
          "Smart Furniture", "Books", "Others"
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchProduct = useCallback(async () => {
    try {
      setInitialLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        // Parse metadata
        const { description, metadata } = parseProductMetadata(data.description || "");

        setFormData({
          title: data.title || "",
          price: data.price ? data.price.toString() : "",
          oldPrice: data.oldPrice ? data.oldPrice.toString() : "",
          category: data.category || "Gadgets",
          stock: data.stock ? data.stock.toString() : "10",
          image: data.image || "",
          description: description || "",
          is_featured: data.is_featured === true,
        });

        if (metadata) {
          setVideoUrl(metadata.videoUrl || "");
          if (metadata.hasVariants) {
            setVariantsEnabled(true);
            setGeneralImages(metadata.images || []);
            setColors(metadata.colors || []);
            setSizes(metadata.sizes || []);
            
            // Pre-populate combinations from metadata
            const hasColors = metadata.colors && metadata.colors.length > 0;
            const hasSizes = metadata.sizes && metadata.sizes.length > 0;
            const titleSlug = data.title ? data.title.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 5) : "PROD";
            
            if (hasColors || hasSizes) {
              const loadedCombinations: typeof combinations = [];
              
              if (hasColors && hasSizes) {
                metadata.colors.forEach((color: any) => {
                  metadata.sizes.forEach((size: string) => {
                    const matching = metadata.variants?.find(
                      (v: any) => v.color === color.name && v.size === size
                    );
                    const colorSlug = color.name.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 3);
                    const sizeSlug = size.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 3);
                    
                    loadedCombinations.push({
                      color: color.name,
                      size: size,
                      price: matching ? matching.price.toString() : "",
                      oldPrice: matching && matching.oldPrice ? matching.oldPrice.toString() : "",
                      stock: matching ? matching.stock.toString() : "10",
                      sku: matching ? matching.sku : `SKU-${titleSlug}-${colorSlug}-${sizeSlug}`,
                      enabled: !!matching
                    });
                  });
                });
              } else if (hasColors) {
                metadata.colors.forEach((color: any) => {
                  const matching = metadata.variants?.find(
                    (v: any) => v.color === color.name && (!v.size || v.size === "")
                  );
                  const colorSlug = color.name.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 3);
                  
                  loadedCombinations.push({
                    color: color.name,
                    size: "",
                    price: matching ? matching.price.toString() : "",
                    oldPrice: matching && matching.oldPrice ? matching.oldPrice.toString() : "",
                    stock: matching ? matching.stock.toString() : "10",
                    sku: matching ? matching.sku : `SKU-${titleSlug}-${colorSlug}`,
                    enabled: !!matching
                  });
                });
              } else if (hasSizes) {
                metadata.sizes.forEach((size: string) => {
                  const matching = metadata.variants?.find(
                    (v: any) => (!v.color || v.color === "") && v.size === size
                  );
                  const sizeSlug = size.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 3);
                  
                  loadedCombinations.push({
                    color: "",
                    size: size,
                    price: matching ? matching.price.toString() : "",
                    oldPrice: matching && matching.oldPrice ? matching.oldPrice.toString() : "",
                    stock: matching ? matching.stock.toString() : "10",
                    sku: matching ? matching.sku : `SKU-${titleSlug}-${sizeSlug}`,
                    enabled: !!matching
                  });
                });
              }
              setCombinations(loadedCombinations);
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Failed to load product details for editing:", err);
      alert(`Error loading product: ${err.message}. Redirecting to product list.`);
      router.push("/admin/products");
    } finally {
      setInitialLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadProductImage(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadProductImage(file);
    }
  };

  const uploadProductImage = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: urlData.publicUrl }));
      if (variantsEnabled) {
        setGeneralImages(prev => [...prev, urlData.publicUrl]);
      }
    } catch (err: any) {
      alert(`Upload failed: ${err.message}. Make sure the 'images' storage bucket is created in Supabase.`);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Helper to upload images for color variants
  const handleUploadImageForColor = async (file: File, colorIndex: number) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const updatedColors = [...colors];
      updatedColors[colorIndex].images.push(urlData.publicUrl);
      setColors(updatedColors);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    }
  };

  // Helper to upload general images
  const handleUploadGeneralImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setGeneralImages(prev => [...prev, urlData.publicUrl]);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    }
  };

  const handleAddColor = () => {
    const trimmed = newColorName.trim();
    if (!trimmed) return;
    if (colors.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      alert("Color already exists.");
      return;
    }
    setColors([...colors, { name: trimmed, images: [] }]);
    setNewColorName("");
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleAddSize = () => {
    const trimmed = newSizeName.trim();
    if (!trimmed) return;
    if (sizes.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      alert("Size already exists.");
      return;
    }
    setSizes([...sizes, trimmed]);
    setNewSizeName("");
  };

  const handleQuickAddSize = (quickSize: string) => {
    if (sizes.includes(quickSize)) return;
    setSizes([...sizes, quickSize]);
  };

  const handleRemoveSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleCombinationChange = (index: number, field: string, value: any) => {
    const updated = [...combinations];
    updated[index] = { ...updated[index], [field]: value };
    setCombinations(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const basePrice = parseFloat(formData.price);
    const baseOldPrice = formData.oldPrice ? parseFloat(formData.oldPrice) : null;
    const baseStock = parseInt(formData.stock);

    const activeCombos = variantsEnabled ? combinations.filter(c => c.enabled) : [];
    
    const metadata = {
      hasVariants: variantsEnabled,
      images: variantsEnabled ? (generalImages.length > 0 ? generalImages : (formData.image ? [formData.image] : [])) : [],
      colors: variantsEnabled ? colors.map(c => ({ name: c.name, images: c.images })) : [],
      sizes: variantsEnabled ? sizes : [],
      variants: variantsEnabled ? activeCombos.map(c => ({
        color: c.color,
        size: c.size,
        price: c.price ? parseFloat(c.price) : basePrice,
        oldPrice: c.oldPrice ? parseFloat(c.oldPrice) : baseOldPrice,
        stock: c.stock ? parseInt(c.stock) : baseStock,
        sku: c.sku,
      })) : [],
      videoUrl: videoUrl.trim() || undefined
    };

    let mainImageUrl = formData.image;
    const serializedDescription = serializeProductMetadata(formData.description, metadata);
    
    if (variantsEnabled && !mainImageUrl && colors.length > 0 && colors[0].images.length > 0) {
      mainImageUrl = colors[0].images[0];
    }

    try {
      const productData = {
        title: formData.title,
        price: basePrice,
        oldPrice: baseOldPrice,
        category: formData.category,
        stock: baseStock,
        image: mainImageUrl,
        description: serializedDescription,
        is_featured: formData.is_featured,
      };

      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id);

      if (error) throw error;

      alert("Product updated successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      console.error('Error updating product:', err);
      alert(`Error updating product: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-[#1a80c2] rounded-full animate-spin" />
        <p className="text-gray-500 font-bold text-sm">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-gray-500 text-sm font-medium">Modify details and variant options for your product.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Product Title*</label>
              <input 
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text" 
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Price (৳)*</label>
                <input 
                  required
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number" 
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Old Price (৳)</label>
                <input 
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  type="number" 
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-405"
                />
              </div>
            </div>
          </div>

          {/* Variants Management Panel */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div>
                <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  ⚙️ Product Variants
                </h2>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Define variant choices (Colors, Sizes) and pricing overrides.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={variantsEnabled}
                  onChange={(e) => setVariantsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a80c2]"></div>
                <span className="ml-2.5 text-xs font-black text-gray-600 uppercase tracking-widest">Enable</span>
              </label>
            </div>

            {variantsEnabled && (
              <div className="space-y-8">
                {/* 1. General Images Gallery */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    🖼️ General Product Images Gallery
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {generalImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square bg-gray-50 rounded-xl border border-gray-100 overflow-hidden group">
                        <img src={img} alt="General" className="w-full h-full object-contain p-1" />
                        <button
                          type="button"
                          onClick={() => setGeneralImages(generalImages.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-red-500/80 text-white font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square bg-gray-50 hover:bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors flex flex-col items-center justify-center cursor-pointer">
                      <HugeiconsIcon icon={ImageAdd01Icon} size={20} className="text-gray-400" />
                      <span className="text-[10px] text-gray-500 font-bold mt-1">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadGeneralImage(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* 2. Color Swatches */}
                <div className="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700">🎨 Color Swatches</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add Color (e.g. Black)"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddColor(); } }}
                      className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all font-semibold flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="bg-[#1a80c2] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-3 mt-4">
                    {colors.map((color, cIdx) => (
                      <div key={cIdx} className="bg-white p-3 rounded-xl border border-gray-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-gray-700">{color.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(cIdx)}
                            className="text-red-500 hover:text-red-600 text-[10px] font-bold"
                          >
                            Remove Color
                          </button>
                        </div>

                        {/* Color gallery */}
                        <div className="grid grid-cols-6 gap-2">
                          {color.images.map((img, iIdx) => (
                            <div key={iIdx} className="relative aspect-square bg-gray-50 rounded border border-gray-150 overflow-hidden group">
                              <img src={img} alt="Color variant" className="w-full h-full object-contain p-1" />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...colors];
                                  updated[cIdx].images = updated[cIdx].images.filter((_, i) => i !== iIdx);
                                  setColors(updated);
                                }}
                                className="absolute inset-0 bg-red-500/80 text-white font-bold text-[9px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                          <label className="aspect-square bg-gray-50 hover:bg-gray-100 rounded border border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer">
                            <span className="text-[10px] text-gray-400 font-bold">+ File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadImageForColor(file, cIdx);
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Size Swatches */}
                <div className="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700">📏 Size Options</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add Size (e.g. M, XL or 42)"
                      value={newSizeName}
                      onChange={(e) => setNewSizeName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSize(); } }}
                      className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all font-semibold flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="bg-[#1a80c2] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex gap-2 mt-2">
                    {["S", "M", "L", "XL", "XXL"].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleQuickAddSize(s)}
                        className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 rounded px-2.5 py-1 text-[10px] font-bold active:scale-95 transition-all"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {sizes.map((size, idx) => (
                      <div key={idx} className="bg-[#1a80c2] text-white text-xs font-bold pl-3 pr-2 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                        <span>{size}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(idx)}
                          className="hover:bg-blue-600 w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Combinations Pricing / Stock Grids */}
                {combinations.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-700">📋 Variant Pricing, SKUs & Stock Level Grids</h3>
                    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                            <th className="p-3">Variant</th>
                            <th className="p-3">SKU</th>
                            <th className="p-3">Price (৳)</th>
                            <th className="p-3">Old Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {combinations.map((combo, idx) => (
                            <tr key={idx} className={combo.enabled ? "" : "opacity-40"}>
                              <td className="p-3 font-bold text-gray-700">
                                {combo.color} / {combo.size}
                              </td>
                              <td className="p-3">
                                <input
                                  type="text"
                                  value={combo.sku}
                                  onChange={(e) => handleCombinationChange(idx, "sku", e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-100 rounded p-1 text-[11px] font-semibold"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="number"
                                  placeholder={formData.price || "Base"}
                                  value={combo.price}
                                  onChange={(e) => handleCombinationChange(idx, "price", e.target.value)}
                                  className="w-20 bg-gray-50 border border-gray-100 rounded p-1 text-[11px] font-bold text-right"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="number"
                                  placeholder={formData.oldPrice || "None"}
                                  value={combo.oldPrice}
                                  onChange={(e) => handleCombinationChange(idx, "oldPrice", e.target.value)}
                                  className="w-20 bg-gray-50 border border-gray-100 rounded p-1 text-[11px] text-right text-gray-400"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="number"
                                  value={combo.stock}
                                  onChange={(e) => handleCombinationChange(idx, "stock", e.target.value)}
                                  className="w-16 bg-gray-50 border border-gray-100 rounded p-1 text-[11px] font-bold text-right"
                                />
                              </td>
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={combo.enabled}
                                  onChange={(e) => handleCombinationChange(idx, "enabled", e.target.checked)}
                                  className="w-3.5 h-3.5 accent-[#1a80c2] cursor-pointer"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <HugeiconsIcon icon={ImageAdd01Icon} size={18} className="text-gray-500" />
              Media & Assets
            </h2>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Product Image*</label>
              
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative aspect-[1.8/1] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 overflow-hidden bg-gray-50
                  ${dragging ? 'border-[#1a80c2] bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2 bg-white" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="bg-white/95 hover:bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-md transition-all active:scale-95 select-none">
                        Change Image
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 select-none"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-2 flex flex-col items-center">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-blue-100 border-t-[#1a80c2] rounded-full animate-spin" />
                        <span className="text-xs font-bold text-gray-500">Uploading image...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <HugeiconsIcon icon={ImageAdd01Icon} size={20} />
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          <label className="text-[#1a80c2] font-bold hover:underline cursor-pointer">
                            Click to upload
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                          </label>
                          {" or drag & drop"}
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">Square or vertical layout works best</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <input 
                required
                name="image"
                value={formData.image}
                onChange={handleChange}
                type="text" 
                placeholder="Or paste direct image URL here..." 
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Product Video URL (Optional)</label>
              <input 
                name="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                type="text" 
                placeholder="Paste direct MP4 video URL (e.g. https://...mp4)..." 
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Organization */}
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="font-bold text-gray-800">Organization</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Category*</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-700"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Initial Stock*</label>
              <input 
                required
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                type="number" 
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-bold"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input 
                type="checkbox"
                name="is_featured"
                id="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-4 h-4 text-[#1a80c2] border-gray-300 rounded focus:ring-[#1a80c2] cursor-pointer"
              />
              <label htmlFor="is_featured" className="text-sm font-bold text-gray-700 select-none cursor-pointer">
                Featured Product
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <button 
              disabled={submitting}
              type="submit"
              className="w-full bg-[#1a80c2] text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-[#166ca5] transition-all disabled:opacity-50"
            >
              {submitting ? "Saving Product..." : "Save Product Details"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
