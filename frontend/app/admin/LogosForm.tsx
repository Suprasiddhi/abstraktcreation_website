"use client";

import React, { useRef } from "react";

interface Logo {
  id?: number;
  name: string;
  imageUrl: string;
}

interface LogosFormProps {
  data: Logo[];
  onChange: (data: Logo[]) => void;
  disabled?: boolean;
}

export default function LogosForm({ data = [], onChange, disabled = false }: LogosFormProps) {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateLogoField = (index: number, field: string, value: any) => {
    const list = [...data];
    list[index] = { ...list[index], [field]: value };
    onChange(list);
  };

  const addLogo = () => {
    const list = [...data];
    list.push({
      name: "NEWBRAND",
      imageUrl: "",
    });
    onChange(list);
  };

  const removeLogo = (index: number) => {
    const list = data.filter((_, i) => i !== index);
    onChange(list);
  };

  const handleFile = (index: number, file: File) => {
    if (!file.type.startsWith("image/")) return;
    // Limit to 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("Image too large. Please use an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      updateLogoField(index, "imageUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(index, file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <span className="text-sm font-semibold text-neutral-500 font-mono">
          Custom Logos Roster ({data?.length || 0})
        </span>
        {!disabled && (
          <button
            type="button"
            onClick={addLogo}
            className="text-xs bg-brand/10 hover:bg-brand/20 text-brand px-3.5 py-1.5 rounded-full font-bold transition-all uppercase cursor-pointer"
          >
            + Add Logo
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {data.map((logo, index) => (
          <div key={index} className="border border-neutral-200/80 rounded-xl p-5 bg-neutral-50/50 flex flex-col gap-4 relative group">
            {!disabled && (
              <button
                type="button"
                onClick={() => removeLogo(index)}
                className="absolute top-4 right-4 text-xs font-bold text-neutral-400 hover:text-red-500 transition-colors uppercase cursor-pointer z-10"
              >
                ✕ Remove
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Input */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Logo Text / Brand Name</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={logo.name}
                  onChange={(e) => updateLogoField(index, "name", e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand font-bold uppercase disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>

              {/* Drag & Drop Image Upload */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Logo Image</label>
                {logo.imageUrl ? (
                  <div className="relative rounded-lg border border-neutral-200 bg-white p-3 flex items-center gap-3">
                    <img
                      src={logo.imageUrl}
                      alt={logo.name}
                      className="h-10 w-auto max-w-[120px] object-contain"
                    />
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => updateLogoField(index, "imageUrl", "")}
                        className="text-[10px] font-bold text-neutral-400 hover:text-red-500 transition-colors uppercase cursor-pointer ml-auto"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    onDrop={(e) => !disabled && handleDrop(index, e)}
                    onDragOver={handleDragOver}
                    onClick={() => !disabled && fileInputRefs.current[index]?.click()}
                    className={`rounded-lg border-2 border-dashed border-neutral-300 bg-white/50 flex flex-col items-center justify-center py-4 px-3 text-center transition-colors ${
                      disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-brand/40 hover:bg-brand/5 cursor-pointer"
                    }`}
                  >
                    <svg className="w-6 h-6 text-neutral-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-[11px] text-neutral-400 font-semibold">Drop image here or click to browse</span>
                    <span className="text-[9px] text-neutral-400 mt-0.5">PNG, SVG, JPG — max 2MB</span>
                    <input
                      ref={(el) => { fileInputRefs.current[index] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(index, file);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-sm text-neutral-400 font-mono italic text-center py-6">No logos defined. Click &quot;+ Add Logo&quot; to create one.</p>
        )}
      </div>
    </div>
  );
}
