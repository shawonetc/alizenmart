"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Search01Icon, PencilEdit01Icon, Delete02Icon, StarIcon } from "@hugeicons/core-free-icons";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    // Read initial category from URL query parameters if present
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      if (catParam) {
        setSelectedCategory(catParam);
      }
    }
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
        const fallback = [
          "Gadgets", "Smart Electronics", "Home & Lifestyle", "Beauty & Personal", 
          "Healthy Food", "Fashion", "Mom & Baby", "Home & Kitchen", "Appliances", 
          "Fitness & Health", "Smart Watch", "Religious", "Peripherals", 
          "Smart Furniture", "Books", "Others"
        ];
        setCategories(fallback);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      // Fallback to static data if table doesn't exist
      setProducts([
        { id: 1, title: "Airpods Case", price: 160, oldPrice: 180, category: "Gadgets", stock: 2, image: "/airpods_case.png" },
        { id: 2, title: "৭টি গুরুত্বপূর্ণ ইসলামিক বইয়ের কম্বো প্যাকেজ", price: 980, category: "Books", stock: 15, image: "/islamic_books.png" },
        { id: 3, title: "প্রিমিয়াম সিজন ফ্রেশ মিক্স খেজুর কম্বো প্যাকেজ", price: 1760, category: "Healthy Food", stock: 8, image: "/fresh_dates.png" },
      ]);
    } else if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All Categories" || 
      String(product.category).toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(product.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category && String(product.category).toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert("Error deleting product");
      } else {
        fetchProducts();
      }
    }
  };

  const toggleFeatured = async (id: any, currentStatus: boolean) => {
    const nextStatus = currentStatus === true ? false : true;
    const { error } = await supabase
      .from('products')
      .update({ is_featured: nextStatus })
      .eq('id', id);

    if (error) {
      alert(`Error updating featured status: ${error.message}`);
      console.error("Error updating featured status:", error);
    } else {
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === id ? { ...p, is_featured: nextStatus } : p)
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Manage your inventory, prices, and stock levels.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-[#1a80c2] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-[#166ca5] transition-all flex items-center justify-center gap-2"
        >
          <HugeiconsIcon icon={Add01Icon} size={16} /> Add New Product
        </Link>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 px-4 pl-12 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <HugeiconsIcon icon={Search01Icon} size={18} />
            </span>
          </div>
          <div className="flex items-center gap-3">
             <select 
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value)}
               className="bg-gray-50 border-none rounded-xl py-2.5 px-4 text-sm outline-none font-medium text-gray-600 cursor-pointer"
             >
               <option value="All Categories">All Categories</option>
               {categories.map((cat) => (
                 <option key={cat} value={cat}>
                   {cat}
                 </option>
               ))}
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Featured</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse border-b border-gray-50 last:border-none">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                        <div className="space-y-2">
                          <div className="w-36 h-4 bg-gray-100 rounded" />
                          <div className="w-20 h-3 bg-gray-50 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-5 bg-gray-100 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="w-16 h-4 bg-gray-100 rounded" />
                        <div className="w-10 h-3 bg-gray-50 rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-100" />
                        <div className="w-20 h-4 bg-gray-100 rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-6 h-6 bg-gray-100 rounded-full mx-auto" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-medium italic">No products found.</td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 relative">
                        <Image
                          src={
                            (Array.isArray(product.images) && product.images.length > 0)
                              ? product.images[0]
                              : product.image
                          }
                          alt={product.title}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{product.title}</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase">ID: {product.id.toString().slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800">৳ {product.price}</p>
                    {product.oldPrice && <p className="text-[10px] text-gray-400 line-through">৳ {product.oldPrice}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock < 5 ? "bg-red-500" : "bg-green-500"}`}></div>
                      <span className={`text-sm font-bold ${product.stock < 5 ? "text-red-600" : "text-gray-700"}`}>
                        {product.stock} in stock
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleFeatured(product.id, product.is_featured)}
                      className="p-2 hover:bg-amber-50 rounded-xl transition-all active:scale-95 group/star" 
                      title={product.is_featured ? "Remove from Featured" : "Add to Featured"}
                    >
                      <HugeiconsIcon 
                        icon={StarIcon} 
                        size={18} 
                        color={product.is_featured ? "#FFC107" : "#BDC3C7"}
                        className={`${product.is_featured ? "fill-[#FFC107]" : ""} transition-transform duration-200 group-hover/star:scale-110`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/admin/products/edit/${product.id}`}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" 
                        title="Edit"
                      >
                        <HugeiconsIcon icon={PencilEdit01Icon} size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" 
                        title="Delete"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
