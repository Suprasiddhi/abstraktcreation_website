"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "../../components/ui/Button";

export interface SocialItem {
  platform: "insta" | "linkedin" | "github";
  url: string;
}

export interface MemberData {
  name: string;
  role: string;
  description?: string;
  avatarUrl?: string;
  originalAvatarUrl?: string;
  socials?: SocialItem[];
  socialPlatform?: "insta" | "linkedin" | "github";
  socialUrl?: string;
  isBookmarked?: boolean;
}

interface PeopleModalProps {
  member?: MemberData | null;
  onSave: (member: MemberData) => void;
  onClose: () => void;
}

export default function PeopleModal({ member, onSave, onClose }: PeopleModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState("");
  const [socials, setSocials] = useState<SocialItem[]>([
    { platform: "insta", url: "" },
  ]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState("");

  // Crop / Grid Adjust state
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>("");
  const [imageAspect, setImageAspect] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (member) {
      setName(member.name || "");
      setRole(member.role || "");
      setDescription(member.description || "");
      setAvatarUrl(member.avatarUrl || "");
      setOriginalAvatarUrl(member.originalAvatarUrl || member.avatarUrl || "");
      setIsBookmarked(Boolean(member.isBookmarked));

      if (member.socials && member.socials.length > 0) {
        setSocials(member.socials);
      } else if (member.socialUrl) {
        setSocials([{ platform: member.socialPlatform || "insta", url: member.socialUrl }]);
      } else {
        setSocials([{ platform: "insta", url: "" }]);
      }
    } else {
      setName("");
      setRole("");
      setDescription("");
      setAvatarUrl("");
      setOriginalAvatarUrl("");
      setSocials([{ platform: "insta", url: "" }]);
      setIsBookmarked(false);
    }
  }, [member]);

  // Track aspect ratio of cropImageSrc when changed
  useEffect(() => {
    if (!cropImageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = cropImageSrc;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        const aspect = img.naturalWidth / img.naturalHeight;
        setImageAspect(aspect);
        setPanOffset({ x: 0, y: 0 });
      }
    };
  }, [cropImageSrc]);

  // Strict Boundary Clamping to prevent any empty black space around container edges (4:5 Ratio)
  const clampPan = (x: number, y: number, scale: number, aspect: number) => {
    if (!aspect || aspect <= 0) return { x: 0, y: 0 };
    const containerW = 240;
    const containerH = 300;
    const boxAspect = 0.8;
    
    let baseW = containerW;
    let baseH = containerH;
    if (aspect >= boxAspect) {
      baseH = containerH;
      baseW = containerH * aspect;
    } else {
      baseW = containerW;
      baseH = containerW / aspect;
    }

    const scaledW = baseW * scale;
    const scaledH = baseH * scale;

    const maxPanX = Math.max(0, (scaledW - containerW) / 2);
    const maxPanY = Math.max(0, (scaledH - containerH) / 2);

    const clampedX = Math.min(maxPanX, Math.max(-maxPanX, x));
    const clampedY = Math.min(maxPanY, Math.max(-maxPanY, y));

    return { x: clampedX, y: clampedY };
  };

  const handleFile = (file: File) => {
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
      const src = reader.result as string;
      setOriginalAvatarUrl(src);
      setCropImageSrc(src);
      setZoomScale(1);
      setPanOffset({ x: 0, y: 0 });
      setShowCropModal(true);
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

  const openAdjustGrid = () => {
    const srcToUse = originalAvatarUrl || avatarUrl;
    if (!srcToUse) return;
    setCropImageSrc(srcToUse);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    setShowCropModal(true);
  };

  // Drag handlers with strict boundary clamping
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const rawX = e.clientX - dragStart.x;
    const rawY = e.clientY - dragStart.y;
    const clamped = clampPan(rawX, rawY, zoomScale, imageAspect);
    setPanOffset(clamped);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const rawX = e.touches[0].clientX - dragStart.x;
    const rawY = e.touches[0].clientY - dragStart.y;
    const clamped = clampPan(rawX, rawY, zoomScale, imageAspect);
    setPanOffset(clamped);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoomScale(newZoom);
    setPanOffset((prev) => clampPan(prev.x, prev.y, newZoom, imageAspect));
  };

  // Render crop to canvas with cover fit & clamped bounds (4:5 Ratio)
  const applyCrop = () => {
    const srcToUse = cropImageSrc || originalAvatarUrl || avatarUrl;
    if (!srcToUse) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = srcToUse;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const outW = 400;
      const outH = 500; // 4:5 ratio
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);

      ctx.save();
      const scaleFactor = outW / 240;
      const clamped = clampPan(panOffset.x, panOffset.y, zoomScale, imageAspect);

      ctx.translate(outW / 2 + clamped.x * scaleFactor, outH / 2 + clamped.y * scaleFactor);
      ctx.scale(zoomScale, zoomScale);

      const aspect = img.naturalWidth / img.naturalHeight;
      let drawW = outW;
      let drawH = outH;
      if (aspect >= 0.8) {
        drawH = outH;
        drawW = outH * aspect;
      } else {
        drawW = outW;
        drawH = outW / aspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      const displayResult = canvas.toDataURL("image/jpeg", 0.92);
      setAvatarUrl(displayResult);
      if (!originalAvatarUrl) {
        setOriginalAvatarUrl(srcToUse);
      }
      setShowCropModal(false);
    };
  };

  const updateSocialItem = (index: number, field: "platform" | "url", value: string) => {
    const list = [...socials];
    list[index] = { ...list[index], [field]: value };
    setSocials(list);
  };

  const addSocialItem = () => {
    setSocials((prev) => [...prev, { platform: "linkedin", url: "" }]);
  };

  const removeSocialItem = (index: number) => {
    if (socials.length === 1) {
      setSocials([{ platform: "insta", url: "" }]);
      return;
    }
    setSocials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!role.trim()) {
      setError("Role title is required.");
      return;
    }

    const validSocials = socials.filter((s) => s.url.trim() !== "");
    const primarySocial = validSocials.length > 0 ? validSocials[0] : undefined;

    onSave({
      name: name.trim(),
      role: role.trim(),
      description: description.trim(),
      avatarUrl,
      originalAvatarUrl: originalAvatarUrl || avatarUrl,
      socials: validSocials,
      socialPlatform: primarySocial?.platform,
      socialUrl: primarySocial?.url.trim(),
      isBookmarked,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-black uppercase text-foreground">
              {member ? "Edit Employee" : "Add Employee"}
            </h3>
            <p className="text-xs text-neutral-400 font-mono uppercase mt-1">
              {member ? "Modify team member details" : "Add a new team member to roster"}
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
          {/* Profile Picture Drag & Drop Box - 4:5 Card Ratio */}
          <div className="flex flex-col items-center justify-center">
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2 self-start">
              PROFILE PICTURE
            </label>
            {avatarUrl ? (
              <div className="relative group w-32 h-40 rounded-2xl overflow-hidden border-2 border-neutral-200 shadow-sm aspect-[4/5]">
                <img
                  src={avatarUrl}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                  <button
                    type="button"
                    onClick={openAdjustGrid}
                    className="w-full py-1 rounded bg-brand text-white text-[10px] font-bold uppercase cursor-pointer hover:bg-brand-dark transition-colors"
                  >
                    Adjust Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-1 rounded bg-white text-neutral-800 text-[10px] font-bold uppercase cursor-pointer hover:bg-neutral-100 transition-colors"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl("");
                      setOriginalAvatarUrl("");
                    }}
                    className="w-full py-1 rounded bg-red-500 text-white text-[10px] font-bold uppercase cursor-pointer hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-40 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-brand/5 hover:border-brand/40 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all group aspect-[4/5]"
              >
                <svg
                  className="w-7 h-7 text-neutral-400 group-hover:text-brand transition-colors mb-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                  />
                </svg>
                <span className="text-[11px] font-bold text-neutral-600 group-hover:text-brand leading-tight">
                  Upload Photo
                </span>
                <span className="text-[9px] text-neutral-400 font-mono mt-0.5">
                  Drag &amp; drop
                </span>
              </div>
            )}
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

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Aabhiskar KC"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold text-foreground"
              required
            />
          </div>

          {/* Role Title */}
          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Role Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. CEO or Creative Director"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold text-foreground"
              required
            />
          </div>

          {/* Description Box */}
          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Executive Director & Creative Lead"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-medium text-foreground resize-none"
            />
          </div>

          {/* Multiple Social Links Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase">
                SOCIAL LINKS
              </label>
              <button
                type="button"
                onClick={addSocialItem}
                className="text-[11px] font-mono font-bold text-brand hover:text-brand-dark hover:underline uppercase cursor-pointer"
              >
                + Add More
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {socials.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex items-center rounded-lg border border-neutral-200 overflow-hidden flex-1 focus-within:ring-2 focus-within:ring-brand/40 focus-within:border-brand">
                    <select
                      value={item.platform}
                      onChange={(e) => updateSocialItem(idx, "platform", e.target.value as any)}
                      className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-mono font-bold text-xs px-3 py-3 border-r border-neutral-200 focus:outline-none cursor-pointer uppercase shrink-0"
                    >
                      <option value="insta">Insta</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="github">GitHub</option>
                    </select>
                    <input
                      type="url"
                      placeholder={
                        item.platform === "insta"
                          ? "https://instagram.com/username"
                          : item.platform === "github"
                          ? "https://github.com/username"
                          : "https://linkedin.com/in/username"
                      }
                      value={item.url}
                      onChange={(e) => updateSocialItem(idx, "url", e.target.value)}
                      className="w-full px-4 py-3 text-sm focus:outline-none font-medium text-foreground bg-white"
                    />
                  </div>

                  {socials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSocialItem(idx)}
                      className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0 font-bold"
                      title="Remove social link"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bookmark Checkbox */}
          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="isBookmarked"
              checked={isBookmarked}
              onChange={(e) => setIsBookmarked(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-brand focus:ring-brand cursor-pointer"
            />
            <label htmlFor="isBookmarked" className="text-xs font-mono font-bold text-neutral-700 cursor-pointer select-none">
              Bookmark this team member
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" className="py-2.5 px-6 font-bold text-xs">
              {member ? "Save Changes" : "+ Add Member"}
            </Button>
          </div>
        </form>
      </div>

      {/* Grid System Image Adjustment Modal */}
      {showCropModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 text-white flex flex-col items-center gap-5 shadow-2xl relative">
            <div className="w-full flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h4 className="text-base font-black uppercase text-white">ADJUST PROFILE PICTURE</h4>
                <p className="text-[10px] text-neutral-400 font-mono">Drag image to position &amp; zoom to fit grid</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="text-neutral-400 hover:text-white font-mono font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Grid Box Container - 4:5 ratio (240x300) */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-[240px] h-[300px] rounded-2xl overflow-hidden bg-neutral-950 border-2 border-brand/60 cursor-grab active:cursor-grabbing select-none shadow-2xl flex items-center justify-center"
            >
              {/* Scaled & Panned Cover Image with Strict Boundary Clamping */}
              <img
                src={cropImageSrc}
                alt="Adjust preview"
                draggable={false}
                style={{
                  width: imageAspect >= 0.8 ? `${300 * imageAspect}px` : "240px",
                  height: imageAspect >= 0.8 ? "300px" : `${240 / imageAspect}px`,
                  minWidth: imageAspect >= 0.8 ? `${300 * imageAspect}px` : "240px",
                  minHeight: imageAspect >= 0.8 ? "300px" : `${240 / imageAspect}px`,
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                  objectFit: "cover",
                }}
                className="pointer-events-none select-none max-w-none max-h-none shrink-0"
              />

              {/* 3x3 Grid System Box Overlay */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/50 divide-x divide-y divide-white/30 rounded-2xl shadow-inner">
                <div className="bg-transparent" />
                <div className="bg-transparent" />
                <div className="bg-transparent" />
                <div className="bg-transparent" />
                <div className="bg-transparent" />
                <div className="bg-transparent" />
                <div className="bg-transparent" />
                <div className="bg-transparent" />
                <div className="bg-transparent" />
              </div>
            </div>

            {/* Zoom Slider & Controls */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-400">
                <span>ZOOM: {zoomScale.toFixed(2)}x</span>
                <button
                  type="button"
                  onClick={() => {
                    setZoomScale(1);
                    setPanOffset({ x: 0, y: 0 });
                  }}
                  className="text-[10px] text-brand hover:underline cursor-pointer uppercase"
                >
                  Reset Position
                </button>
              </div>

              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoomScale}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="w-full accent-brand cursor-pointer"
              />
            </div>

            {/* Modal Actions */}
            <div className="w-full flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 text-xs font-bold uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={applyCrop}
                variant="primary"
                className="py-2 px-6 font-bold text-xs"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
