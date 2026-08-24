"use client";

import React, { useState } from "react";
import ServiceModal, { ServiceData } from "./ServiceModal";

export interface Pillar {
  id?: string;
  label?: string;
  title: string;
  description: string;
  imageUrl?: string;
  tag?: string;
  badge?: string;
  isBookmarked?: boolean;
}

interface CapabilitiesFormProps {
  data: {
    pillars: Record<string, Pillar>;
  };
  onChange: (data: any) => void;
  onStartEditing?: () => void;
  onAddService?: () => void;
  disabled?: boolean;
}

export default function CapabilitiesForm({ data, onChange, onStartEditing, onAddService, disabled = false }: CapabilitiesFormProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const pillarsObj = data?.pillars || {};
  const pillarKeys = Object.keys(pillarsObj);

  const bookmarkedCount = pillarKeys.filter((k) => pillarsObj[k]?.isBookmarked).length;

  const sortedPillarKeys = [...pillarKeys].sort((a, b) => {
    const aBM = Boolean(pillarsObj[a]?.isBookmarked);
    const bBM = Boolean(pillarsObj[b]?.isBookmarked);
    if (aBM !== bBM) return aBM ? -1 : 1;
    return 0;
  });

  const toggleBookmark = (pillarKey: string) => {
    if (onStartEditing) onStartEditing();
    const current = pillarsObj[pillarKey];
    onChange({
      ...data,
      pillars: {
        ...pillarsObj,
        [pillarKey]: {
          ...current,
          isBookmarked: !current?.isBookmarked,
        },
      },
    });
  };

  const deletePillar = (pillarKey: string) => {
    const pillarTitle = pillarsObj[pillarKey]?.title || "this service";
    if (!window.confirm(`Are you sure you want to delete "${pillarTitle}"?`)) {
      return;
    }
    if (onStartEditing) onStartEditing();
    const newPillars = { ...pillarsObj };
    delete newPillars[pillarKey];
    onChange({
      ...data,
      pillars: newPillars,
    });
  };

  const handleStartEdit = (pillarKey: string) => {
    if (onStartEditing) onStartEditing();
    setEditingKey(pillarKey);
  };

  const handleSaveModal = (updatedService: ServiceData) => {
    if (onStartEditing) onStartEditing();
    if (isCreatingNew) {
      const count = pillarKeys.length + 1;
      const newKey = `service_${count}`;
      const newId = String(count).padStart(2, "0");
      onChange({
        ...data,
        pillars: {
          ...pillarsObj,
          [newKey]: {
            id: newId,
            label: updatedService.label || "",
            title: updatedService.title,
            description: updatedService.description,
            imageUrl: updatedService.imageUrl,
            tag: updatedService.tag || "",
            badge: updatedService.badge || "",
            isBookmarked: false,
          },
        },
      });
      setIsCreatingNew(false);
    } else if (editingKey) {
      const currentPillar = pillarsObj[editingKey] || {};
      onChange({
        ...data,
        pillars: {
          ...pillarsObj,
          [editingKey]: {
            ...currentPillar,
            title: updatedService.title,
            description: updatedService.description,
            imageUrl: updatedService.imageUrl,
          },
        },
      });
      setEditingKey(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <span className="text-sm font-semibold text-neutral-500 font-mono flex items-center gap-2">
          Manage Services ({pillarKeys.length})
          {bookmarkedCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">
              {bookmarkedCount} Bookmarked
            </span>
          )}
        </span>
        {!disabled && (
          <button
            type="button"
            onClick={() => {
              if (onAddService) {
                onAddService();
              } else {
                if (onStartEditing) onStartEditing();
                setIsCreatingNew(true);
              }
            }}
            className="text-xs bg-brand/10 hover:bg-brand/20 text-brand px-3.5 py-1.5 rounded-full font-bold transition-all uppercase cursor-pointer"
          >
            + Add service
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {sortedPillarKeys.map((pillarKey, index) => {
          const pillar = pillarsObj[pillarKey];
          const displayNum = pillar.id || String(index + 1).padStart(2, "0");

          return (
            <div
              key={pillarKey}
              className={`border rounded-xl p-5 flex items-center justify-between gap-4 relative group transition-all ${
                pillar.isBookmarked
                  ? "border-amber-300 bg-amber-50/40 shadow-sm"
                  : "border-neutral-200/80 bg-neutral-50/50"
              }`}
            >
              {/* Left Content Preview */}
              <div className="flex items-center gap-4 flex-1">
                {pillar.imageUrl ? (
                  <img
                    src={pillar.imageUrl}
                    alt={pillar.title}
                    className="h-14 w-20 object-cover rounded-lg border border-neutral-200 shrink-0"
                  />
                ) : (
                  <div className="h-14 w-20 rounded-lg border border-neutral-200 bg-neutral-200/60 flex items-center justify-center text-[10px] font-mono font-bold text-neutral-400 shrink-0 uppercase">
                    No Image
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[10px] font-mono bg-brand/10 text-brand font-bold px-2 py-0.5 rounded">
                      SLOT {displayNum}
                    </span>
                    <h4 className="text-base font-black uppercase text-foreground">
                      {pillar.title || "UNTITLED SERVICE"}
                    </h4>
                    {pillar.isBookmarked && (
                      <span className="text-[10px] font-mono font-bold bg-amber-500 text-white px-2 py-0.5 rounded uppercase flex items-center gap-1">
                        ★ BOOKMARKED
                      </span>
                    )}
                  </div>

                  {pillar.description && (
                    <p className="text-xs text-neutral-500 line-clamp-1 max-w-xl">
                      {pillar.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Side Icon Actions: Bookmark, Delete, Edit */}
              <div className="flex items-center gap-2">
                {/* Bookmark Icon Button */}
                <button
                  type="button"
                  onClick={() => toggleBookmark(pillarKey)}
                  className={`p-2.5 rounded-lg transition-all cursor-pointer shadow-sm border ${
                    pillar.isBookmarked
                      ? "bg-amber-500 border-amber-500 text-white hover:bg-amber-600"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-amber-400 hover:text-amber-500"
                  }`}
                  title={pillar.isBookmarked ? "Remove bookmark" : "Bookmark service"}
                  aria-label={pillar.isBookmarked ? "Remove bookmark" : "Bookmark service"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={pillar.isBookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>

                {/* Delete Icon Button */}
                <button
                  type="button"
                  onClick={() => deletePillar(pillarKey)}
                  className="p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-red-500 text-neutral-600 hover:text-red-600 transition-colors cursor-pointer shadow-sm"
                  title="Delete service"
                  aria-label="Delete service"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>

                {/* Edit Icon Button */}
                <button
                  type="button"
                  onClick={() => handleStartEdit(pillarKey)}
                  className="p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-brand text-neutral-600 hover:text-brand transition-colors cursor-pointer shadow-sm"
                  title="Edit service"
                  aria-label="Edit service"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}

        {sortedPillarKeys.length === 0 && (
          <p className="text-sm text-neutral-400 font-mono italic text-center py-8">
            No services found. Click &quot;+ Add service&quot; to create a new service.
          </p>
        )}
      </div>

      {/* Service Edit / Create Modal */}
      {(isCreatingNew || editingKey) && (
        <ServiceModal
          service={
            editingKey && pillarsObj[editingKey]
              ? {
                  id: pillarsObj[editingKey].id,
                  title: pillarsObj[editingKey].title || "",
                  description: pillarsObj[editingKey].description || "",
                  imageUrl: pillarsObj[editingKey].imageUrl || "",
                  label: pillarsObj[editingKey].label || "",
                  tag: pillarsObj[editingKey].tag || "",
                  badge: pillarsObj[editingKey].badge || "",
                }
              : null
          }
          onSave={handleSaveModal}
          onClose={() => {
            setEditingKey(null);
            setIsCreatingNew(false);
          }}
        />
      )}
    </div>
  );
}
