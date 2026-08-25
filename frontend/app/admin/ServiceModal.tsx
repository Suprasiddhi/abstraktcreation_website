"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "../../components/ui/Button";

export interface ServiceData {
  id?: string;
  label?: string;
  title: string;
  description: string;
  imageUrl?: string;
  tag?: string;
  badge?: string;
}

interface ServiceModalProps {
  service?: ServiceData | null;
  onSave: (service: ServiceData) => void;
  onClose: () => void;
}

export default function ServiceModal({ service, onSave, onClose }: ServiceModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (service) {
      setTitle(service.title || "");
      setDescription(service.description || "");
      setImageUrl(service.imageUrl || "");
    } else {
      setTitle("");
      setDescription("");
      setImageUrl("");
    }
  }, [service]);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size too large. Max 5MB.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Service title is required.");
      return;
    }

    onSave({
      id: service?.id,
      title: title.trim(),
      description: description.trim(),
      imageUrl,
      label: service?.label || "",
      tag: service?.tag || "",
      badge: service?.badge || "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-black uppercase text-foreground">
              {service ? "Edit Service" : "Add New Service"}
            </h3>
            <p className="text-xs text-neutral-400 font-mono uppercase mt-1">
              {service ? "Modify service information" : "Add a new service offering"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 flex items-center justify-center transition-colors font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Service Title */}
          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Service Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. DIGITAL DEVELOPMENT"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold uppercase text-foreground"
              required
            />
          </div>

          {/* Service Image Drag & Drop Box */}
          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              SERVICE IMAGE
            </label>
            {imageUrl ? (
              <div className="relative rounded-xl border border-neutral-200 bg-neutral-50 p-2 flex items-center justify-between">
                <img src={imageUrl} alt="Service Preview" className="h-20 w-auto object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-xs font-bold text-neutral-400 hover:text-red-500 uppercase transition-colors px-3 cursor-pointer"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50/60 hover:bg-brand/5 hover:border-brand/40 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all group"
              >
                <svg
                  className="w-8 h-8 text-neutral-400 group-hover:text-brand transition-colors mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <span className="text-xs font-bold text-neutral-600 group-hover:text-brand">
                  Drop service image here or click to upload
                </span>
                <span className="text-[10px] text-neutral-400 font-mono mt-1">
                  Supports PNG, JPG, WEBP — max 5MB
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the scope and deliverables of this service..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-medium text-foreground resize-none"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" className="py-2.5 px-6 font-bold text-xs">
              {service ? "Save Changes" : "+ Add Service"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
