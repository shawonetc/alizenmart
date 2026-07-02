"use client";

import React, { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Folder01Icon, 
  Search01Icon, 
  Add01Icon, 
  PackageIcon,
  FilterIcon,
  StarIcon,
  ArrowRight01Icon,
  Delete02Icon,
  PencilEdit01Icon
} from "@hugeicons/core-free-icons";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { revalidateProductCache } from "@/app/actions";

export default function AdminCategories() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatSlug, setEditCatSlug] = useState("");

  // Drag and Drop State
  const [draggedId, setDraggedId] = useState<any>(null);
  const [dragOverId, setDragOverId] = useState<any>(null);
  const [dropPosition, setDropPosition] = useState<"before" | "after" | "inside" | null>(null);

  const defaultStaticCategories = [
    { name: "Gadgets", slug: "gadgets", bg: "bg-blue-50", text: "text-blue-600" },
    { name: "Smart Electronics", slug: "smart-electronics", bg: "bg-indigo-50", text: "text-indigo-600" },
    { name: "Home & Lifestyle", slug: "home-lifestyle", bg: "bg-purple-50", text: "text-purple-600" },
    { name: "Beauty & Personal", slug: "beauty-personal", bg: "bg-pink-50", text: "text-pink-600" },
    { name: "Healthy Food", slug: "healthy-food", bg: "bg-emerald-50", text: "text-emerald-600" },
    { name: "Fashion", slug: "fashion", bg: "bg-amber-50", text: "text-amber-600" },
    { name: "Mom & Baby", slug: "mom-baby", bg: "bg-teal-50", text: "text-teal-600" },
    { name: "Home & Kitchen", slug: "home-kitchen", bg: "bg-cyan-50", text: "text-cyan-600" },
    { name: "Appliances", slug: "appliances", bg: "bg-rose-50", text: "text-rose-600" },
    { name: "Fitness & Health", slug: "fitness-health", bg: "bg-green-50", text: "text-green-600" },
    { name: "Smart Watch", slug: "smart-watch", bg: "bg-orange-50", text: "text-orange-600" },
    { name: "Religious", slug: "religious", bg: "bg-yellow-50", text: "text-yellow-600" },
    { name: "Peripherals", slug: "peripherals", bg: "bg-violet-50", text: "text-violet-600" },
    { name: "Smart Furniture", slug: "smart-furniture", bg: "bg-sky-50", text: "text-sky-600" },
    { name: "Books", slug: "books", bg: "bg-lime-50", text: "text-lime-600" },
    { name: "Others", slug: "others", bg: "bg-gray-50", text: "text-gray-600" },
  ];

  useEffect(() => {
    fetchProductStats();
  }, []);

  const fetchProductStats = async () => {
    setLoading(true);
    try {
      const { data: dbCategories, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      let loadedCategories = dbCategories || [];
      if (catError || loadedCategories.length === 0) {
        console.warn("Could not load categories from Supabase, using static fallback:", catError);
        loadedCategories = defaultStaticCategories;
      }

      const { data: products, error } = await supabase
        .from("products")
        .select("category");

      if (error) {
        console.error("Error fetching product categories:", error);
      }

      const items = products || [];
      setTotalProductsCount(items.length);

      // Create mapping of category counts
      const counts: Record<string, number> = {};
      items.forEach((p) => {
        const cat = String(p.category || "").trim().toLowerCase();
        counts[cat] = (counts[cat] || 0) + 1;
      });

      // Map dynamic product count onto categories
      const enriched = loadedCategories.map((c: any) => {
        const matches = counts[c.name.toLowerCase()] || counts[c.slug.toLowerCase()] || 0;
        return {
          ...c,
          count: matches,
        };
      });

      setCategories(enriched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || !newCatSlug.trim()) {
      alert("Please fill in both name and slug!");
      return;
    }

    const nameVal = newCatName.trim();
    const slugVal = newCatSlug.trim().toLowerCase().replace(/\s+/g, "-");

    try {
      // Find highest sort_order to append to the end
      const maxOrder = categories.reduce((max, c) => (c.sort_order > max ? c.sort_order : max), 0);

      const { error } = await supabase
        .from("categories")
        .insert([{ 
          name: nameVal, 
          slug: slugVal,
          sort_order: maxOrder + 1
        }]);

      if (error) throw error;

      await revalidateProductCache();

      alert("Category added successfully!");
      setNewCatName("");
      setNewCatSlug("");
      setShowAddModal(false);
      fetchProductStats();
    } catch (err: any) {
      console.error("Error adding category:", err);
      alert(`Error: ${err.message}. Make sure you ran the SQL command to create the categories table in Supabase.`);
    }
  };

  const handleDeleteCategory = async (cat: any) => {
    if (cat.count > 0) {
      alert(`Cannot delete category "${cat.name}" because it contains ${cat.count} products. Please reassign or delete the products first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete the category "${cat.name}"?`)) {
      try {
        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", cat.id);

        if (error) throw error;

        await revalidateProductCache();

        alert("Category deleted successfully!");
        fetchProductStats();
      } catch (err: any) {
        console.error("Error deleting category:", err);
        alert(`Error deleting category: ${err.message}`);
      }
    }
  };

  const handleEditClick = (cat: any) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatSlug(cat.slug);
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCatName.trim() || !editCatSlug.trim()) {
      alert("Please fill in both name and slug!");
      return;
    }

    const oldName = editingCategory.name;
    const nameVal = editCatName.trim();
    const slugVal = editCatSlug.trim().toLowerCase().replace(/\s+/g, "-");

    try {
      // 1. Update category
      const { error: catError } = await supabase
        .from("categories")
        .update({
          name: nameVal,
          slug: slugVal
        })
        .eq("id", editingCategory.id);

      if (catError) throw catError;

      // 2. Cascade rename to products
      if (oldName !== nameVal) {
        const { error: prodError } = await supabase
          .from("products")
          .update({ category: nameVal })
          .eq("category", oldName);

        if (prodError) {
          console.error("Failed to cascade rename to products:", prodError);
        }
      }

      await revalidateProductCache();

      alert("Category updated successfully!");
      setShowEditModal(false);
      setEditingCategory(null);
      fetchProductStats();
    } catch (err: any) {
      console.error("Error updating category:", err);
      alert(`Error updating category: ${err.message}`);
    }
  };

  // Helper functions for Hierarchical Tree Traversal
  const buildFlatTree = (items: any[]): any[] => {
    const map = new Map<string | null, any[]>();
    items.forEach(item => {
      const parentKey = item.parent_id ? String(item.parent_id) : null;
      if (!map.has(parentKey)) {
        map.set(parentKey, []);
      }
      map.get(parentKey)!.push(item);
    });

    // Sort children by sort_order
    map.forEach(list => {
      list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    });

    const result: any[] = [];
    function traverse(parentId: string | null, depth: number) {
      const children = map.get(parentId) || [];
      children.forEach(child => {
        result.push({ ...child, depth });
        traverse(String(child.id), depth + 1);
      });
    }

    traverse(null, 0);
    return result;
  };

  const isDescendant = (parentToCheckId: any, childId: any): boolean => {
    let current = categories.find(c => c.id === childId);
    while (current && current.parent_id) {
      if (current.parent_id === parentToCheckId) return true;
      current = categories.find(c => c.id === current.parent_id);
    }
    return false;
  };

  const findLastChildIndex = (list: any[], parentId: any): number => {
    let lastIndex = -1;
    for (let i = 0; i < list.length; i++) {
      if (list[i].parent_id === parentId) {
        lastIndex = i;
        const childLastIndex = findLastChildIndex(list, list[i].id);
        if (childLastIndex !== -1) {
          lastIndex = childLastIndex;
        }
      }
    }
    return lastIndex;
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e: React.DragEvent, id: any) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetId: any) => {
    e.preventDefault();
    if (draggedId === targetId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const height = rect.height;

    // Determine drop position: Top 25% = before, bottom 25% = after, middle 50% = inside
    if (relativeY < height * 0.25) {
      setDropPosition("before");
    } else if (relativeY > height * 0.75) {
      setDropPosition("after");
    } else {
      setDropPosition("inside");
    }
    setDragOverId(targetId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
    setDropPosition(null);
  };

  const handleDrop = async (e: React.DragEvent, targetId: any) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      setDropPosition(null);
      return;
    }

    if (isDescendant(draggedId, targetId)) {
      alert("Cannot place a parent category inside one of its own sub-categories!");
      setDraggedId(null);
      setDragOverId(null);
      setDropPosition(null);
      return;
    }

    const flatTree = buildFlatTree(categories);
    const draggedItem = flatTree.find(c => c.id === draggedId);
    const targetItem = flatTree.find(c => c.id === targetId);

    if (!draggedItem || !targetItem) return;

    let newParentId: any = null;
    if (dropPosition === "inside") {
      newParentId = targetItem.id;
    } else {
      newParentId = targetItem.parent_id;
    }

    // Filter out the dragged item from the flat list
    const filtered = flatTree.filter(c => c.id !== draggedId);

    // Insert at the appropriate index
    let insertIndex = filtered.findIndex(c => c.id === targetId);
    if (dropPosition === "after") {
      insertIndex += 1;
    } else if (dropPosition === "inside") {
      const lastChildIdx = findLastChildIndex(filtered, targetId);
      insertIndex = lastChildIdx !== -1 ? lastChildIdx + 1 : insertIndex + 1;
    }

    draggedItem.parent_id = newParentId;
    filtered.splice(insertIndex, 0, draggedItem);

    // Filter siblings to update sort orders
    const siblings = filtered.filter(c => c.parent_id === newParentId);

    try {
      setLoading(true);
      // 1. Update dragged item's parent in the DB
      const { error: parentErr } = await supabase
        .from("categories")
        .update({ parent_id: newParentId })
        .eq("id", draggedId);

      if (parentErr) throw parentErr;

      // 2. Batch update sort orders
      const updates = siblings.map((sib, index) => {
        return supabase
          .from("categories")
          .update({ sort_order: index })
          .eq("id", sib.id);
      });

      await Promise.all(updates);
      await revalidateProductCache();
      fetchProductStats();
    } catch (err: any) {
      console.error("Failed to reorder categories:", err);
      alert(`Error reordering categories: ${err.message}`);
    } finally {
      setDraggedId(null);
      setDragOverId(null);
      setDropPosition(null);
      setLoading(false);
    }
  };

  // Indent / Outdent Controls
  const handleIndent = async (cat: any) => {
    const flatTree = buildFlatTree(categories);
    const idx = flatTree.findIndex(c => c.id === cat.id);
    if (idx <= 0) return; // Cannot indent first item

    // Set parent to the immediately preceding category in the hierarchy list
    const previousCategory = flatTree[idx - 1];

    if (isDescendant(cat.id, previousCategory.id)) {
      alert("Cannot indent parent category inside one of its descendants.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from("categories")
        .update({ parent_id: previousCategory.id })
        .eq("id", cat.id);

      if (error) throw error;
      await revalidateProductCache();
      fetchProductStats();
    } catch (err: any) {
      alert(`Error nesting category: ${err.message}`);
      setLoading(false);
    }
  };

  const handleOutdent = async (cat: any) => {
    if (!cat.parent_id) return; // Already at root level

    const parentCat = categories.find(c => c.id === cat.parent_id);
    const grandParentId = parentCat ? parentCat.parent_id : null;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("categories")
        .update({ parent_id: grandParentId })
        .eq("id", cat.id);

      if (error) throw error;
      await revalidateProductCache();
      fetchProductStats();
    } catch (err: any) {
      alert(`Error promoting category: ${err.message}`);
      setLoading(false);
    }
  };

  // Render tree helper or normal search filter list
  const activeViewCategories = searchQuery.trim() !== ""
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : buildFlatTree(categories);

  const popularCategory = categories.reduce((max, c) => (c.count > (max?.count || 0) ? c : max), categories[0] || null);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Organize and sort category hierarchy with drag and drop.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#1a80c2] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-[#166ca5] transition-all flex items-center justify-center gap-2"
        >
          <HugeiconsIcon icon={Add01Icon} size={16} /> Add New Category
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="bg-blue-50 text-blue-600 w-14 h-14 rounded-xl flex items-center justify-center">
            <HugeiconsIcon icon={Folder01Icon} size={28} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Categories</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {loading ? "..." : categories.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="bg-emerald-50 text-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center">
            <HugeiconsIcon icon={PackageIcon} size={28} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Catalog Products</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {loading ? "..." : totalProductsCount} Items
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="bg-purple-50 text-purple-600 w-14 h-14 rounded-xl flex items-center justify-center">
            <HugeiconsIcon icon={StarIcon} size={28} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Top Category</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5 truncate">
              {loading ? "..." : popularCategory ? `${popularCategory.name} (${popularCategory.count})` : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Categories Hierarchy Editor */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category by name or slug..." 
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 px-4 pl-12 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
            />
            <HugeiconsIcon icon={Search01Icon} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
          {searchQuery.trim() === "" && (
            <p className="text-xs font-medium text-gray-400">
              💡 Drag rows to sort vertically, or drag right to nest. Use ← → arrows to manage indentation.
            </p>
          )}
        </div>

        <div className="p-6">
          {loading && categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-400 font-semibold mt-4">Loading categories database...</p>
            </div>
          ) : activeViewCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-50 p-4 rounded-full text-gray-400 mb-4">
                <HugeiconsIcon icon={Folder01Icon} size={32} />
              </div>
              <p className="text-base font-bold text-gray-700">No categories found</p>
              <p className="text-xs text-gray-400 mt-1">Add a category to populate the interactive hierarchy builder.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeViewCategories.map((cat: any, index: number) => {
                const depth = cat.depth || 0;
                const isDragTarget = dragOverId === cat.id;

                return (
                  <div
                    key={cat.id || index}
                    draggable={searchQuery.trim() === ""}
                    onDragStart={(e) => handleDragStart(e, cat.id)}
                    onDragOver={(e) => handleDragOver(e, cat.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, cat.id)}
                    style={{ marginLeft: `${depth * 2}rem` }}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border transition-all duration-200 ${
                      isDragTarget && dropPosition === "inside"
                        ? "border-blue-500 bg-blue-50/50 scale-[1.01]"
                        : "border-gray-100 hover:border-gray-200"
                    } ${draggedId === cat.id ? "opacity-40" : ""}`}
                  >
                    {/* Visual indicators for drop location */}
                    {isDragTarget && dropPosition === "before" && (
                      <div className="absolute left-0 right-0 h-1 bg-blue-500 -top-1.5 rounded-full z-10 animate-pulse"></div>
                    )}
                    {isDragTarget && dropPosition === "after" && (
                      <div className="absolute left-0 right-0 h-1 bg-blue-500 -bottom-1.5 rounded-full z-10 animate-pulse"></div>
                    )}

                    <div className="flex items-center gap-3">
                      {/* Drag Handle (Hidden when searching) */}
                      {searchQuery.trim() === "" && (
                        <div className="cursor-grab active:cursor-grabbing p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="5" r="1"></circle>
                            <circle cx="9" cy="12" r="1"></circle>
                            <circle cx="9" cy="19" r="1"></circle>
                            <circle cx="15" cy="5" r="1"></circle>
                            <circle cx="15" cy="12" r="1"></circle>
                            <circle cx="15" cy="19" r="1"></circle>
                          </svg>
                        </div>
                      )}

                      {/* Depth line decoration */}
                      {depth > 0 && (
                        <div className="w-4 h-4 border-l-2 border-b-2 border-dashed border-gray-200 -mt-2 -ml-2 rounded-bl-lg"></div>
                      )}

                      <div className="bg-slate-50 p-2.5 rounded-lg text-slate-500">
                        <HugeiconsIcon icon={Folder01Icon} size={18} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 text-sm">{cat.name}</span>
                          {depth > 0 && (
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                              Sub-category
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-gray-400">/{cat.slug}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-3 sm:mt-0 ml-10 sm:ml-0">
                      {/* Product Count badge */}
                      <span className="text-xs font-semibold px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-500 whitespace-nowrap">
                        {cat.count} products
                      </span>

                      {/* Hierarchy Controls */}
                      {searchQuery.trim() === "" && (
                        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                          <button
                            onClick={() => handleOutdent(cat)}
                            disabled={!cat.parent_id}
                            className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-400 hover:bg-white rounded transition-all"
                            title="Promote Category (Outdent)"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="19" y1="12" x2="5" y2="12"></line>
                              <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleIndent(cat)}
                            disabled={index === 0}
                            className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-400 hover:bg-white rounded transition-all"
                            title="Nest Category (Indent)"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* CRUD Actions */}
                      <div className="flex items-center gap-4">
                        <Link 
                          href={`/admin/products?category=${encodeURIComponent(cat.name)}`}
                          className="text-[#1a80c2] text-xs font-bold hover:underline flex items-center gap-1 group"
                        >
                          <span>View</span>
                          <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        {cat.id && (
                          <>
                            <button
                              onClick={() => handleEditClick(cat)}
                              className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1 text-xs font-bold"
                              title="Edit Category"
                            >
                              <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
                              title="Delete Category"
                            >
                              <HugeiconsIcon icon={Delete02Icon} size={14} />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 transform scale-100 transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Create New Category</h3>
            <p className="text-xs text-gray-500 mb-6">Enter details below to create a dynamic catalog category entry.</p>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Leather Bags" 
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    setNewCatSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                  }}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 font-medium" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slug Path</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. leather-bags" 
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-mono outline-none focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 font-medium" 
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#1a80c2] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#166ca5] transition-all shadow-lg shadow-blue-100"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 transform scale-100 transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Edit Category</h3>
            <p className="text-xs text-gray-500 mb-6">Modify the name and slug path for this category.</p>

            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Leather Bags" 
                  value={editCatName}
                  onChange={(e) => {
                    setEditCatName(e.target.value);
                    setEditCatSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                  }}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 font-medium" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slug Path</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. leather-bags" 
                  value={editCatSlug}
                  onChange={(e) => setEditCatSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-mono outline-none focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 font-medium" 
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCategory(null);
                  }}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#1a80c2] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#166ca5] transition-all shadow-lg shadow-blue-100"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
