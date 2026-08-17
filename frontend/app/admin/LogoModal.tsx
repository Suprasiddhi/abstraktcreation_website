"use client";

import React, { useState, useRef } from "react";

export interface LogoData {
  id?: number;
  name: string;
  imageUrl: string;
}

interface LogoModalProps {
  logo?: LogoData | null;
  onSave: (logo: LogoData) => void;
  onClose: () => void;
}

export default function LogoModal({ logo, onSave, onClose }: LogoModalProps) {
  const [formData, setFormData] = useState<LogoData>({
    id: logo?.id,
    name: logo?.name || "",
    imageUrl: logo?.imageUrl || "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image too large. Please use an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter a Brand Name / Logo Text.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
          <div>
            <h3 className="text-lg font-black uppercase text-foreground">
              {logo ? "EDIT LOGO" : "ADD NEW LOGO"}
            </h3>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              Upload logo image and specify brand title
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 font-mono text-xl p-1 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Logo Name Input */}
          <div>
            <label className="block text-xs font-mono font-bold text-neutral-600 mb-2 uppercase">
              Logo Text / Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value.toUpperCase() }))}
              placeholder="e.g. MOCA, ZUUS, COSMOS"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand font-bold uppercase"
            />
          </div>

          {/* Logo Image Upload */}
          <div>
            <label className="block text-xs font-mono font-bold text-neutral-600 mb-2 uppercase">
              Logo Image
            </label>
            {formData.imageUrl ? (
              <div className="relative rounded-xl border border-neutral-200 bg-neutral-50 p-4 flex items-center justify-between gap-4">
                <img
                  src={formData.imageUrl}
                  alt={formData.name || "Logo preview"}
                  className="h-12 w-auto max-w-[160px] object-contain"
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                  className="text-xs font-bold text-neutral-400 hover:text-red-500 transition-colors uppercase cursor-pointer"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50/50 hover:bg-brand/5 hover:border-brand/40 flex flex-col items-center justify-center py-6 px-4 text-center cursor-pointer transition-all"
              >
                <svg className="w-8 h-8 text-neutral-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-xs text-neutral-600 font-semibold">Drop logo image here or click to browse</span>
                <span className="text-[10px] text-neutral-400 mt-1">PNG, SVG, JPG — max 2MB</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-100 uppercase transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand text-white hover:bg-brand-dark uppercase shadow-md transition-all cursor-pointer"
            >
              {logo ? "Save Changes" : "Add Logo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
