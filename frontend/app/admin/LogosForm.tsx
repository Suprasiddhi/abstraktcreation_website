"use client";

import React, { useState } from "react";
import LogoModal, { LogoData } from "./LogoModal";

interface LogosFormProps {
  data: LogoData[];
  onChange: (data: LogoData[]) => void;
  onStartEditing?: () => void;
  disabled?: boolean;
}

export default function LogosForm({ data = [], onChange, onStartEditing, disabled = false }: LogosFormProps) {
  const [editingLogoIndex, setEditingLogoIndex] = useState<number | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleStartEdit = (index: number) => {
    if (onStartEditing) onStartEditing();
    setEditingLogoIndex(index);
  };

  const handleStartCreate = () => {
    if (onStartEditing) onStartEditing();
    setIsCreatingNew(true);
  };

  const handleSaveModal = (updatedLogo: LogoData) => {
    if (onStartEditing) onStartEditing();
    const list = [...data];
    if (isCreatingNew) {
      list.push(updatedLogo);
    } else if (editingLogoIndex !== null) {
      list[editingLogoIndex] = updatedLogo;
    }
    onChange(list);
    setEditingLogoIndex(null);
    setIsCreatingNew(false);
  };

  const removeLogo = (index: number) => {
    const logoName = data[index]?.name || "this logo";
    if (!window.confirm(`Are you sure you want to delete "${logoName}"?`)) {
      return;
    }
    if (onStartEditing) onStartEditing();
    const list = data.filter((_, i) => i !== index);
    onChange(list);
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
            onClick={handleStartCreate}
            className="text-xs bg-brand/10 hover:bg-brand/20 text-brand px-3.5 py-1.5 rounded-full font-bold transition-all uppercase cursor-pointer"
          >
            + Add Logo
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {data.map((logo, index) => (
          <div
            key={index}
            className="border border-neutral-200/80 rounded-xl p-5 bg-neutral-50/50 flex items-center justify-between gap-4 relative group"
          >
            <div className="flex items-center gap-4 flex-1">
              {logo.imageUrl ? (
                <div className="w-14 h-10 bg-white border border-neutral-200 rounded-lg p-1.5 flex items-center justify-center shrink-0">
                  <img src={logo.imageUrl} alt={logo.name} className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="w-14 h-10 bg-neutral-200/60 rounded-lg flex items-center justify-center text-[10px] font-mono text-neutral-400 font-bold uppercase shrink-0">
                  NO IMG
                </div>
              )}

              <div className="flex flex-col">
                <h4 className="text-base font-black uppercase text-foreground">
                  {logo.name || "UNTITLED LOGO"}
                </h4>
                <span className="text-[11px] font-mono text-neutral-400">
                  {logo.imageUrl ? "Custom logo image uploaded" : "No image assigned"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Delete Icon Button */}
              <button
                type="button"
                onClick={() => removeLogo(index)}
                className="p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-red-500 text-neutral-600 hover:text-red-600 transition-colors cursor-pointer shadow-sm"
                title="Delete logo"
                aria-label="Delete logo"
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
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>

              {/* Edit Icon Button */}
              <button
                type="button"
                onClick={() => handleStartEdit(index)}
                className="p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-brand text-neutral-600 hover:text-brand transition-colors cursor-pointer shadow-sm"
                title="Edit logo"
                aria-label="Edit logo"
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <p className="text-sm text-neutral-400 font-mono italic text-center py-8">
            No logos found. Click &quot;+ Add Logo&quot; to create one.
          </p>
        )}
      </div>

      {/* Modal for Creating or Editing Logo */}
      {(isCreatingNew || editingLogoIndex !== null) && (
        <LogoModal
          logo={editingLogoIndex !== null ? data[editingLogoIndex] : null}
          onSave={handleSaveModal}
          onClose={() => {
            setEditingLogoIndex(null);
            setIsCreatingNew(false);
          }}
        />
      )}
    </div>
  );
}

