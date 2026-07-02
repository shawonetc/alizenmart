"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings03Icon, ImageAdd01Icon } from "@hugeicons/core-free-icons";
import { revalidateProductCache } from "@/app/actions";

interface BannerUploadFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio: string;
  recommendation: string;
}

const BannerUploadField = ({ label, name, value, onChange, aspectRatio, recommendation }: BannerUploadFieldProps) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => {
    setDragging(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onChange(urlData.publicUrl);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}. (Note: Ensure the 'images' storage bucket is created in Supabase & public access policies are enabled)`);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative ${aspectRatio} rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 overflow-hidden group bg-gray-50
          ${dragging ? 'border-[#1a80c2] bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}
        `}
      >
        {value ? (
          <>
            <img src={value} alt={label} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="bg-white/95 hover:bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-md transition-all active:scale-95 select-none">
                Change Image
                <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
              </label>
              <button 
                type="button"
                onClick={() => onChange("")}
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
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                  <HugeiconsIcon icon={ImageAdd01Icon} size={20} />
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  <label className="text-[#1a80c2] font-bold hover:underline cursor-pointer">
                    Click to upload
                    <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                  </label>
                  {" or drag & drop"}
                </div>
                <p className="text-[10px] text-gray-400 font-medium">{recommendation}</p>
              </>
            )}
          </div>
        )}
      </div>

      <input 
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text" 
        placeholder="Or paste direct image URL here..." 
        className="w-full bg-gray-50 border-none rounded-xl py-2.5 px-4 text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-600"
      />
    </div>
  );
};

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    hero_main_slider: "",
    hero_main_slider_2: "",
    hero_main_slider_3: "",
    hero_side_banner_1: "",
    hero_side_banner_2: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (data && !error) {
        setFormData({
          hero_main_slider: data.hero_main_slider || "",
          hero_main_slider_2: data.hero_main_slider_2 || "",
          hero_main_slider_3: data.hero_main_slider_3 || "",
          hero_side_banner_1: data.hero_side_banner_1 || "",
          hero_side_banner_2: data.hero_side_banner_2 || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (name: string, url: string) => {
    setFormData(prev => ({ ...prev, [name]: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("settings")
        .upsert({
          id: 1,
          hero_main_slider: formData.hero_main_slider,
          hero_main_slider_2: formData.hero_main_slider_2,
          hero_main_slider_3: formData.hero_main_slider_3,
          hero_side_banner_1: formData.hero_side_banner_1,
          hero_side_banner_2: formData.hero_side_banner_2,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        alert(`Error saving settings: ${error.message}`);
      } else {
        await revalidateProductCache();
        alert("Settings saved successfully!");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-72 bg-gray-150 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2 h-96 bg-gray-100 rounded-2xl" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-50 text-[#1a80c2] rounded-xl flex items-center justify-center">
          <HugeiconsIcon icon={Settings03Icon} size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store Settings</h1>
          <p className="text-gray-500 text-sm font-medium">Control your homepage banners, promotional sliders, and store configurations.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Banner Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <HugeiconsIcon icon={ImageAdd01Icon} size={18} className="text-gray-500" />
              Homepage Hero Banners
            </h2>
            <p className="text-xs text-gray-400 font-medium -mt-4 font-semibold">
              Drag & Drop your banner images or browse to upload them directly to Supabase storage. You can also paste an image URL instead.
            </p>

            {/* Main Slider 1 URL */}
            <BannerUploadField
              label="Main Slider Banner 1 (First Slide)"
              name="hero_main_slider"
              value={formData.hero_main_slider}
              onChange={(url) => handleFieldChange("hero_main_slider", url)}
              aspectRatio="aspect-[2.1/1]"
              recommendation="Recommended aspect ratio: 2.1:1 (e.g. 1400x670px)"
            />

            {/* Main Slider 2 URL */}
            <BannerUploadField
              label="Main Slider Banner 2 (Second Slide)"
              name="hero_main_slider_2"
              value={formData.hero_main_slider_2}
              onChange={(url) => handleFieldChange("hero_main_slider_2", url)}
              aspectRatio="aspect-[2.1/1]"
              recommendation="Recommended aspect ratio: 2.1:1 (e.g. 1400x670px)"
            />

            {/* Main Slider 3 URL */}
            <BannerUploadField
              label="Main Slider Banner 3 (Third Slide)"
              name="hero_main_slider_3"
              value={formData.hero_main_slider_3}
              onChange={(url) => handleFieldChange("hero_main_slider_3", url)}
              aspectRatio="aspect-[2.1/1]"
              recommendation="Recommended aspect ratio: 2.1:1 (e.g. 1400x670px)"
            />

            <hr className="border-gray-100" />

            {/* Side Banner 1 URL */}
            <BannerUploadField
              label="Right Side Banner 1"
              name="hero_side_banner_1"
              value={formData.hero_side_banner_1}
              onChange={(url) => handleFieldChange("hero_side_banner_1", url)}
              aspectRatio="aspect-[1.6/1]"
              recommendation="Recommended aspect ratio: 1.2:1 (e.g. 350x290px)"
            />

            {/* Side Banner 2 URL */}
            <BannerUploadField
              label="Right Side Banner 2"
              name="hero_side_banner_2"
              value={formData.hero_side_banner_2}
              onChange={(url) => handleFieldChange("hero_side_banner_2", url)}
              aspectRatio="aspect-[1.6/1]"
              recommendation="Recommended aspect ratio: 1.2:1 (e.g. 350x290px)"
            />
          </div>
        </div>

        {/* Right Column - Live Preview & Save */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-800">Banner Previews</h3>
            
            {/* Main Previews */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Main Sliders</span>
              
              {/* Slider 1 Preview */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Slide 1</span>
                <div className="aspect-[2.1/1] bg-gray-50 rounded-xl border border-gray-100 overflow-hidden relative">
                  {formData.hero_main_slider ? (
                    <img src={formData.hero_main_slider} alt="Main Slider 1 Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 italic font-medium">No Image 1</div>
                  )}
                </div>
              </div>

              {/* Slider 2 Preview */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Slide 2</span>
                <div className="aspect-[2.1/1] bg-gray-50 rounded-xl border border-gray-100 overflow-hidden relative">
                  {formData.hero_main_slider_2 ? (
                    <img src={formData.hero_main_slider_2} alt="Main Slider 2 Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 italic font-medium">No Image 2</div>
                  )}
                </div>
              </div>

              {/* Slider 3 Preview */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Slide 3</span>
                <div className="aspect-[2.1/1] bg-gray-50 rounded-xl border border-gray-100 overflow-hidden relative">
                  {formData.hero_main_slider_3 ? (
                    <img src={formData.hero_main_slider_3} alt="Main Slider 3 Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 italic font-medium">No Image 3</div>
                  )}
                </div>
              </div>
            </div>

            {/* Side Banner Previews */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Side 1</span>
                <div className="aspect-square bg-gray-50 rounded-xl border border-gray-100 overflow-hidden relative">
                  {formData.hero_side_banner_1 ? (
                    <img src={formData.hero_side_banner_1} alt="Side Banner 1 Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 italic font-medium">No Image</div>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Side 2</span>
                <div className="aspect-square bg-gray-50 rounded-xl border border-gray-100 overflow-hidden relative">
                  {formData.hero_side_banner_2 ? (
                    <img src={formData.hero_side_banner_2} alt="Side Banner 2 Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 italic font-medium">No Image</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <button 
              disabled={saving}
              type="submit"
              className="w-full bg-[#1a80c2] text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-[#166ca5] transition-all disabled:opacity-50"
            >
              {saving ? "Saving Settings..." : "Save Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
