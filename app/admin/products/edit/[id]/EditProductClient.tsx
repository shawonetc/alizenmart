"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import MultiImageUploader from "@/components/MultiImageUploader";

interface EditProductClientProps {
  id: string;
}

export default function EditProductClient({ id }: EditProductClientProps) {
  const router = useRouter();

  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    oldPrice: "",
    category: "",
    stock: "10",
    description: "",
    is_featured: false,
  });

  // Multiple images — first item is the primary/featured image
  const [productImages, setProductImages] = useState<string[]>([]);

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

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
          "Smart Furniture", "Books", "Others",
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
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || "",
          price: data.price ? data.price.toString() : "",
          oldPrice: data.oldPrice ? data.oldPrice.toString() : "",
          category: data.category || "Gadgets",
          stock: data.stock ? data.stock.toString() : "10",
          description: data.description || "",
          is_featured: data.is_featured === true,
        });

        // Backward compat: use `images` array if present, fall back to single `image`
        if (Array.isArray(data.images) && data.images.length > 0) {
          setProductImages(data.images);
        } else if (data.image) {
          setProductImages([data.image]);
        } else {
          setProductImages([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (productImages.length === 0) {
      alert("Please keep at least one product image.");
      return;
    }

    setSubmitting(true);

    try {
      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        category: formData.category,
        stock: parseInt(formData.stock),
        // Backward compat: keep `image` as primary
        image: productImages[0],
        // New: full array
        images: productImages,
        description: formData.description,
        is_featured: formData.is_featured,
      };

      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", id);

      if (error) throw error;

      alert("Product updated successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      console.error("Error updating product:", err);
      alert(`Error updating product: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-[#1a80c2] rounded-full animate-spin" />
        <p className="text-gray-500 font-medium text-sm">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-gray-500 text-sm font-medium">
            Modify details to update the product in your store catalog.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Product Title*</label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text"
                placeholder="e.g. Premium Cotton Panjabi"
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
                placeholder="Write something about the product..."
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium resize-none"
              />
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
                  placeholder="0.00"
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
                  placeholder="0.00"
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Media &amp; Assets
              </h2>
              {/* Info card — always visible at top */}
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <div className="flex items-start gap-2 flex-1 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                  <span className="text-base leading-none mt-0.5">⭐</span>
                  <div>
                    <p className="text-[11px] font-black text-[#1a80c2]">প্রথম ছবি = PRIMARY IMAGE</p>
                    <p className="text-[10px] text-blue-500 font-medium mt-0.5">Product card, thumbnail ও সব জায়গায় এটি দেখাবে</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                  <span className="text-base leading-none mt-0.5">🖼️</span>
                  <div>
                    <p className="text-[11px] font-black text-gray-600">বাকি ছবি = GALLERY IMAGES</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Product details পেজের গ্যালারিতে দেখাবে</p>
                  </div>
                </div>
              </div>
            </div>

            <MultiImageUploader
              images={productImages}
              onChange={setProductImages}
              maxImages={10}
            />
          </div>
        </div>

        {/* ── Right Column ── */}
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
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Current Stock*</label>
              <input
                required
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                type="number"
                placeholder="10"
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

          {/* Image count summary */}
          {productImages.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-bold text-[#1a80c2] flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {productImages.length} image{productImages.length !== 1 ? "s" : ""} saved
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {productImages.slice(0, 5).map((url, i) => (
                  <div key={i} className="w-9 h-9 rounded-lg overflow-hidden border border-blue-100 relative">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute inset-0 bg-[#1a80c2]/30 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
                {productImages.length > 5 && (
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-[9px] font-black text-[#1a80c2]">+{productImages.length - 5}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <button
              disabled={submitting}
              type="submit"
              className="w-full bg-[#1a80c2] text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-[#166ca5] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
