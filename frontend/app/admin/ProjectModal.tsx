"use client";

import React, { useState, useRef } from "react";
import Button from "../../components/ui/Button";

export interface BodySection {
  type: "description" | "media";
  mainTitle: string;
  subTitle: string;
  description?: string;
  mediaUrl?: string;
  mediaUrls?: string[];
}

export interface ProjectData {
  id?: number;
  title: string;
  subtitle: string;
  serviceType: string;
  startDate: string;
  endDate: string;
  client: string;
  clientType: "brand" | "person";
  category: string;
  logoUrl?: string;
  thumbnailUrl?: string;
  videoThumbnailUrl?: string;
  bodySections: BodySection[];
}

interface ProjectModalProps {
  project?: ProjectData | null;
  onSave: (project: ProjectData) => void;
  onClose: () => void;
}

export default function ProjectModal({ project, onSave, onClose }: ProjectModalProps) {
  const [formData, setFormData] = useState<ProjectData>({
    title: project?.title || "",
    subtitle: project?.subtitle || "",
    serviceType: project?.serviceType || "",
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
    client: project?.client || "",
    clientType: project?.clientType || "brand",
    category: project?.category || "Digital Marketing",
    logoUrl: project?.logoUrl || "",
    thumbnailUrl: project?.thumbnailUrl || "",
    videoThumbnailUrl: project?.videoThumbnailUrl || "",
    bodySections: project?.bodySections || [],
  });

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const videoThumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const mediaInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateField = (field: keyof ProjectData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const insertSectionAt = (atIndex: number, type: "description" | "media") => {
    const newSection: BodySection =
      type === "description"
        ? { type: "description", mainTitle: "", subTitle: "", description: "" }
        : { type: "media", mainTitle: "", subTitle: "", mediaUrls: [] };

    const updated = [...formData.bodySections];
    updated.splice(atIndex, 0, newSection);
    setFormData((prev) => ({ ...prev, bodySections: updated }));
  };

  const updateSection = (index: number, field: keyof BodySection, value: any) => {
    const updated = [...formData.bodySections];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, bodySections: updated }));
  };

  const removeSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      bodySections: prev.bodySections.filter((_, i) => i !== index),
    }));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.bodySections.length) return;
    const updated = [...formData.bodySections];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setFormData((prev) => ({ ...prev, bodySections: updated }));
  };

  // Logo upload handler
  const handleLogoFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Logo image is too large. Please use a file under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      updateField("logoUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Multiple Media upload handler for a section
  const handleMultipleMediaFiles = (index: number, files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const validFiles = fileArray.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Max allowed size is 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const currentSection = formData.bodySections[index];
    const existingMedia = currentSection.mediaUrls
      ? [...currentSection.mediaUrls]
      : currentSection.mediaUrl
      ? [currentSection.mediaUrl]
      : [];

    let loadedCount = 0;
    const newMediaUrls: string[] = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          newMediaUrls.push(reader.result);
        }
        loadedCount++;
        if (loadedCount === validFiles.length) {
          const updated = [...formData.bodySections];
          updated[index] = {
            ...updated[index],
            mediaUrls: [...existingMedia, ...newMediaUrls],
            mediaUrl: undefined, // migrate to array
          };
          setFormData((prev) => ({ ...prev, bodySections: updated }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeSingleMedia = (sectionIndex: number, mediaIndex: number) => {
    const sec = formData.bodySections[sectionIndex];
    const currentList = sec.mediaUrls
      ? [...sec.mediaUrls]
      : sec.mediaUrl
      ? [sec.mediaUrl]
      : [];

    const updatedList = currentList.filter((_, i) => i !== mediaIndex);
    const updated = [...formData.bodySections];
    updated[sectionIndex] = {
      ...updated[sectionIndex],
      mediaUrls: updatedList,
      mediaUrl: undefined,
    };
    setFormData((prev) => ({ ...prev, bodySections: updated }));
  };

  const handleMediaDrop = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMultipleMediaFiles(index, e.dataTransfer.files);
    }
  };

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoFileUpload(file);
  };

  // Static Thumbnail Upload Handler
  const handleThumbnailFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("Static thumbnail file is too large. Max allowed size is 10MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      updateField("thumbnailUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleThumbnailFileUpload(file);
  };

  // Video Thumbnail Upload Handler
  const handleVideoThumbnailFileUpload = (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      alert("Video thumbnail file is too large. Max allowed size is 15MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      updateField("videoThumbnailUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoThumbnailDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleVideoThumbnailFileUpload(file);
  };

  const renderInserter = (insertIndex: number) => {
    return (
      <div className="relative group/inserter my-2 py-1 flex items-center justify-center">
        <div className="absolute inset-x-0 h-px bg-neutral-200 opacity-20 group-hover/inserter:opacity-100 transition-opacity" />
        <div className="relative z-10 opacity-30 group-hover/inserter:opacity-100 transition-all flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-sm">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Insert Section Here:</span>
          <button
            type="button"
            onClick={() => insertSectionAt(insertIndex, "description")}
            className="text-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-0.5 rounded-full font-bold uppercase cursor-pointer"
          >
            + Description
          </button>
          <button
            type="button"
            onClick={() => insertSectionAt(insertIndex, "media")}
            className="text-[10px] bg-brand/10 hover:bg-brand/20 text-brand px-2.5 py-0.5 rounded-full font-bold uppercase cursor-pointer"
          >
            + Media
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-3xl max-h-[90vh] flex flex-col z-10 overflow-hidden animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-neutral-50/50">
          <div>
            <h3 className="text-lg font-black uppercase text-foreground leading-none">
              {project ? "Edit Project" : "Add New Project"}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 font-mono uppercase tracking-wider">
              Fill in the metadata and body sections below
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 font-bold p-1 text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          {/* Metadata Group */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-mono font-bold tracking-widest text-brand uppercase block border-b border-neutral-100 pb-1.5">
              1. General Information
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Project Title</label>
                <input
                  type="text"
                  value={formData.title}
                  placeholder="e.g. COSMOS AUDIO"
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  placeholder="e.g. 3D soundscapes & motion scoring"
                  onChange={(e) => updateField("subtitle", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Type of Service</label>
                <input
                  type="text"
                  value={formData.serviceType}
                  placeholder="e.g. Web Development & Motion Design"
                  onChange={(e) => updateField("serviceType", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Client (Brand or Person)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.client}
                    placeholder="e.g. Acme Corp or Jane Doe"
                    onChange={(e) => updateField("client", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 font-medium"
                  />
                  <select
                    value={formData.clientType}
                    onChange={(e) => updateField("clientType", e.target.value as "brand" | "person")}
                    className="px-2.5 py-2.5 rounded-lg border border-neutral-200 text-xs font-mono font-bold uppercase bg-white cursor-pointer"
                  >
                    <option value="brand">Brand</option>
                    <option value="person">Person</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Start Date</label>
                <input
                  type="text"
                  value={formData.startDate}
                  placeholder="e.g. Jan 2024 or 2024-01-15"
                  onChange={(e) => updateField("startDate", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">End Date</label>
                <input
                  type="text"
                  value={formData.endDate}
                  placeholder="e.g. Jun 2024 or Present"
                  onChange={(e) => updateField("endDate", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Pillar Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 font-bold bg-white cursor-pointer"
                >
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="IT">IT</option>
                </select>
              </div>

              {/* Project Logo Upload Box */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Project Logo Image</label>
                {formData.logoUrl ? (
                  <div className="relative rounded-lg border border-neutral-200 bg-white p-2.5 flex items-center justify-between">
                    <img src={formData.logoUrl} alt="Project Logo" className="h-9 w-auto object-contain" />
                    <button
                      type="button"
                      onClick={() => updateField("logoUrl", "")}
                      className="text-xs font-bold text-neutral-400 hover:text-red-500 uppercase transition-colors cursor-pointer"
                    >
                      Remove Logo
                    </button>
                  </div>
                ) : (
                  <div
                    onDrop={handleLogoDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => logoInputRef.current?.click()}
                    className="rounded-lg border-2 border-dashed border-neutral-300 bg-white/60 flex items-center justify-center py-2.5 px-3 text-center hover:border-brand/40 hover:bg-brand/5 cursor-pointer transition-colors"
                  >
                    <span className="text-xs text-neutral-500 font-semibold">Drop logo image or click to upload</span>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoFileUpload(file);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Static Thumbnail Drag & Drop Box */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Static Thumbnail Image</label>
                {formData.thumbnailUrl ? (
                  <div className="relative rounded-lg border border-neutral-200 bg-white p-2 flex items-center justify-between">
                    <img src={formData.thumbnailUrl} alt="Static Thumbnail" className="h-16 w-auto object-contain rounded" />
                    <button
                      type="button"
                      onClick={() => updateField("thumbnailUrl", "")}
                      className="text-xs font-bold text-neutral-400 hover:text-red-500 uppercase transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div
                    onDrop={handleThumbnailDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="rounded-lg border-2 border-dashed border-neutral-300 bg-white/60 flex flex-col items-center justify-center py-3 px-3 text-center hover:border-brand/40 hover:bg-brand/5 cursor-pointer transition-colors"
                  >
                    <span className="text-xs text-neutral-500 font-semibold">Drop static thumbnail image</span>
                    <span className="text-[9px] text-neutral-400">PNG, JPG, WEBP — max 10MB</span>
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleThumbnailFileUpload(file);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Video Thumbnail Drag & Drop Box */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Video Thumbnail</label>
                {formData.videoThumbnailUrl ? (
                  <div className="relative rounded-lg border border-neutral-200 bg-white p-2 flex items-center justify-between">
                    {formData.videoThumbnailUrl.startsWith("data:video") ? (
                      <video src={formData.videoThumbnailUrl} controls className="h-16 w-auto object-cover rounded" />
                    ) : (
                      <img src={formData.videoThumbnailUrl} alt="Video Thumbnail" className="h-16 w-auto object-contain rounded" />
                    )}
                    <button
                      type="button"
                      onClick={() => updateField("videoThumbnailUrl", "")}
                      className="text-xs font-bold text-neutral-400 hover:text-red-500 uppercase transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div
                    onDrop={handleVideoThumbnailDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => videoThumbnailInputRef.current?.click()}
                    className="rounded-lg border-2 border-dashed border-neutral-300 bg-white/60 flex flex-col items-center justify-center py-3 px-3 text-center hover:border-brand/40 hover:bg-brand/5 cursor-pointer transition-colors"
                  >
                    <span className="text-xs text-neutral-500 font-semibold">Drop video thumbnail</span>
                    <span className="text-[9px] text-neutral-400">MP4, WEBM, PNG, JPG — max 15MB</span>
                    <input
                      ref={videoThumbnailInputRef}
                      type="file"
                      accept="video/*,image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleVideoThumbnailFileUpload(file);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Body Sections Group */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-mono font-bold tracking-widest text-brand uppercase block border-b border-neutral-100 pb-1.5">
              2. Body Content Sections ({formData.bodySections.length})
            </span>

            <div className="flex flex-col">
              {/* Inserter at index 0 */}
              {formData.bodySections.length > 0 && renderInserter(0)}

              {formData.bodySections.map((sec, idx) => (
                <React.Fragment key={idx}>
                  <div className="border border-neutral-200/80 rounded-xl p-5 bg-neutral-50/60 flex flex-col gap-4 relative group">
                    {/* Card Header & Actions */}
                    <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          sec.type === "description"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        Section #{idx + 1}: {sec.type === "description" ? "Description" : "Media"}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveSection(idx, "up")}
                          disabled={idx === 0}
                          className="text-xs font-bold text-neutral-400 hover:text-neutral-700 disabled:opacity-30 cursor-pointer px-1"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(idx, "down")}
                          disabled={idx === formData.bodySections.length - 1}
                          className="text-xs font-bold text-neutral-400 hover:text-neutral-700 disabled:opacity-30 cursor-pointer px-1"
                          title="Move Down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSection(idx)}
                          className="text-xs font-bold text-neutral-400 hover:text-red-500 uppercase transition-colors cursor-pointer ml-2"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>

                    {/* Common Title / Subtitle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Section Main Title</label>
                        <input
                          type="text"
                          value={sec.mainTitle}
                          placeholder="e.g. Overview & Scope"
                          onChange={(e) => updateSection(idx, "mainTitle", e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Section Sub Title</label>
                        <input
                          type="text"
                          value={sec.subTitle}
                          placeholder="e.g. Key Features & Highlights"
                          onChange={(e) => updateSection(idx, "subTitle", e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand text-neutral-600"
                        />
                      </div>
                    </div>

                    {/* Dynamic Payload Field */}
                    {sec.type === "description" ? (
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Description Paragraph</label>
                        <textarea
                          rows={4}
                          value={sec.description || ""}
                          placeholder="Enter the section detailed description here..."
                          onChange={(e) => updateSection(idx, "description", e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand leading-relaxed"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">
                          Media Upload (Multiple Pictures &amp; Videos Supported)
                        </label>

                        {/* Media Items Gallery Grid */}
                        {(() => {
                          const mediaList = sec.mediaUrls && sec.mediaUrls.length > 0
                            ? sec.mediaUrls
                            : sec.mediaUrl
                            ? [sec.mediaUrl]
                            : [];

                          if (mediaList.length === 0) return null;

                          return (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {mediaList.map((url, mIdx) => (
                                <div key={mIdx} className="relative group/thumb border border-neutral-200 bg-white rounded-lg p-2 flex flex-col items-center justify-center overflow-hidden">
                                  {url.startsWith("data:video") ? (
                                    <video src={url} className="h-24 w-full object-cover rounded" />
                                  ) : (
                                    <img src={url} alt={`Media #${mIdx + 1}`} className="h-24 w-full object-contain rounded" />
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => removeSingleMedia(idx, mIdx)}
                                    className="absolute top-1.5 right-1.5 bg-neutral-900/80 hover:bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center transition-colors cursor-pointer"
                                    title="Remove Picture"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          );
                        })()}

                        {/* Drag & Drop Upload Zone for Multiple Files */}
                        <div
                          onDrop={(e) => handleMediaDrop(idx, e)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={() => mediaInputRefs.current[idx]?.click()}
                          className="rounded-lg border-2 border-dashed border-neutral-300 bg-white/60 flex flex-col items-center justify-center py-5 px-4 text-center hover:border-brand/40 hover:bg-brand/5 cursor-pointer transition-colors"
                        >
                          <svg className="w-7 h-7 text-neutral-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                          <span className="text-xs text-neutral-500 font-semibold">
                            Drag &amp; drop pictures or videos here
                          </span>
                          <span className="text-[10px] text-neutral-400 mt-0.5">
                            Select multiple PNG, JPG, WEBP, or MP4 files — max 10MB per file
                          </span>
                          <input
                            ref={(el) => { mediaInputRefs.current[idx] = el; }}
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                handleMultipleMediaFiles(idx, e.target.files);
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inserter after section idx */}
                  {renderInserter(idx + 1)}
                </React.Fragment>
              ))}

              {formData.bodySections.length === 0 && (
                <div className="border border-dashed border-neutral-200 rounded-xl p-8 text-center bg-white/40 mb-2">
                  <p className="text-xs font-mono text-neutral-400 italic">
                    No body sections added yet. Use the buttons below to add description or media content.
                  </p>
                </div>
              )}

              {/* Bottom Add Section Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => insertSectionAt(formData.bodySections.length, "description")}
                  className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2 rounded-full font-bold transition-all uppercase cursor-pointer"
                >
                  + Add Description Section
                </button>
                <button
                  type="button"
                  onClick={() => insertSectionAt(formData.bodySections.length, "media")}
                  className="text-xs bg-brand/10 hover:bg-brand/20 text-brand px-4 py-2 rounded-full font-bold transition-all uppercase cursor-pointer"
                >
                  + Add Media Section
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] font-semibold text-neutral-400 hover:text-neutral-700 transition-colors uppercase py-2 px-4 cursor-pointer"
          >
            Cancel
          </button>
          <Button
            variant="primary"
            onClick={() => onSave(formData)}
            className="py-[10px] px-8 font-bold text-[14px]"
          >
            Save Project
          </Button>
        </div>
      </div>
    </div>
  );
}
