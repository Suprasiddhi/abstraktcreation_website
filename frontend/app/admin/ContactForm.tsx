"use client";

import React, { useState } from "react";
import { DEFAULT_SKILLS, SkillPill } from "../../components/v2/SkillsPhysics";

export interface ContactData {
  headlineLine1?: string;
  headlineLine2?: string;
  description?: string;
  email?: string;
  phone?: string;
  skills?: SkillPill[];
}

interface ContactFormProps {
  data: ContactData;
  onChange: (data: ContactData) => void;
  onStartEditing?: () => void;
  disabled?: boolean;
}

export default function ContactForm({
  data,
  onChange,
  onStartEditing,
  disabled = false,
}: ContactFormProps) {
  const [newLabel, setNewLabel] = useState("");
  const [newAccent, setNewAccent] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLabelValue, setEditLabelValue] = useState("");

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const skillsList: SkillPill[] =
    Array.isArray(data?.skills) && data.skills.length > 0
      ? data.skills
      : DEFAULT_SKILLS;

  const triggerChange = (updatedSkills: SkillPill[]) => {
    if (onStartEditing) onStartEditing();
    onChange({
      ...data,
      skills: updatedSkills,
    });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newLabel.trim();
    if (!trimmed) return;

    const updated = [...skillsList, { label: trimmed, accent: newAccent }];
    triggerChange(updated);
    setNewLabel("");
    setNewAccent(false);
  };

  const handleToggleAccent = (index: number) => {
    const updated = skillsList.map((skill, idx) => {
      if (idx === index) {
        return { ...skill, accent: !skill.accent };
      }
      return skill;
    });
    triggerChange(updated);
  };

  const handleRemoveSkill = (index: number) => {
    const target = skillsList[index];
    if (!window.confirm(`Remove pill "${target?.label}"?`)) return;
    const updated = skillsList.filter((_, idx) => idx !== index);
    triggerChange(updated);
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= skillsList.length) return;
    const updated = [...skillsList];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    triggerChange(updated);
  };

  const handleStartEditingPill = (index: number) => {
    setEditingIndex(index);
    setEditLabelValue(skillsList[index]?.label || "");
  };

  const handleSavePillEdit = (index: number) => {
    const trimmed = editLabelValue.trim();
    if (!trimmed) return;
    const updated = skillsList.map((skill, idx) => {
      if (idx === index) {
        return { ...skill, label: trimmed };
      }
      return skill;
    });
    triggerChange(updated);
    setEditingIndex(null);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        "Reset all CTA skills pills back to the default 16 skills? Any custom pills will be replaced."
      )
    ) {
      triggerChange(DEFAULT_SKILLS);
    }
  };

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const updated = [...skillsList];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, moved);
    triggerChange(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const accentCount = skillsList.filter((s) => s.accent).length;
  const neutralCount = skillsList.length - accentCount;

  return (
    <div className="flex flex-col gap-8">
      {/* Contact Section Copy */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Headline Line 1
            </label>
            <input
              type="text"
              disabled={disabled}
              placeholder="e.g. Let's make"
              value={data?.headlineLine1 || ""}
              onChange={(e) => {
                if (onStartEditing) onStartEditing();
                onChange({ ...data, headlineLine1: e.target.value });
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold disabled:bg-neutral-50 disabled:text-neutral-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Headline Line 2
            </label>
            <input
              type="text"
              disabled={disabled}
              placeholder="e.g. the thing."
              value={data?.headlineLine2 || ""}
              onChange={(e) => {
                if (onStartEditing) onStartEditing();
                onChange({ ...data, headlineLine2: e.target.value });
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold disabled:bg-neutral-50 disabled:text-neutral-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
            Description Paragraph
          </label>
          <textarea
            rows={3}
            disabled={disabled}
            placeholder="e.g. Tell us what you are trying to launch and roughly when..."
            value={data?.description || ""}
            onChange={(e) => {
              if (onStartEditing) onStartEditing();
              onChange({ ...data, description: e.target.value });
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand disabled:bg-neutral-50 disabled:text-neutral-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Direct Contact Email
            </label>
            <input
              type="email"
              disabled={disabled}
              placeholder="e.g. abstraktcreation@gmail.com"
              value={data?.email || ""}
              onChange={(e) => {
                if (onStartEditing) onStartEditing();
                onChange({ ...data, email: e.target.value });
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand disabled:bg-neutral-50 disabled:text-neutral-400 font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Direct Phone Number
            </label>
            <input
              type="text"
              disabled={disabled}
              placeholder="e.g. +977 9823901866"
              value={data?.phone || ""}
              onChange={(e) => {
                if (onStartEditing) onStartEditing();
                onChange({ ...data, phone: e.target.value });
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand disabled:bg-neutral-50 disabled:text-neutral-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* CTA Skills Physics Gravity Well Pills Manager */}
      <div className="pt-6 border-t border-neutral-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                CTA Gravity Skill Pills
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-neutral-100 text-neutral-700">
                {skillsList.length} total
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                {accentCount} purple
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-neutral-50 text-neutral-600 border border-neutral-200">
                {neutralCount} white
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Pills tumble into the interactive physics canvas in sequence from first to last. Drag or use arrows to reorder drop timing.
            </p>
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={handleResetDefaults}
            className="text-[11px] font-mono font-medium text-neutral-400 hover:text-neutral-700 underline transition-colors self-start sm:self-center disabled:opacity-40"
          >
            Reset Defaults
          </button>
        </div>

        {/* Add New Pill Bar */}
        <form
          onSubmit={handleAddSkill}
          className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              disabled={disabled}
              placeholder="Add skill pill (e.g. AI Systems, Mobile Apps, Three.js)..."
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand disabled:bg-neutral-100 font-medium placeholder:text-neutral-400"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none px-2 py-1">
            <input
              type="checkbox"
              disabled={disabled}
              checked={newAccent}
              onChange={(e) => setNewAccent(e.target.checked)}
              className="w-4 h-4 rounded text-brand focus:ring-brand border-neutral-300 accent-[#9A78F5] cursor-pointer"
            />
            <span className="text-xs font-semibold text-neutral-700">
              Purple Accent
            </span>
          </label>

          <button
            type="submit"
            disabled={disabled || !newLabel.trim()}
            className="px-4 py-2 rounded-lg bg-[#501EBD] hover:bg-[#4317a3] text-white text-xs font-semibold tracking-wide transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Pill</span>
          </button>
        </form>

        {/* Pills List */}
        <div className="space-y-2">
          {skillsList.map((skill, index) => {
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;
            const isEditing = editingIndex === index;

            return (
              <div
                key={`${skill.label}-${index}`}
                draggable={!disabled && !isEditing}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                className={`group flex items-center justify-between p-2.5 sm:px-4 sm:py-3 rounded-xl border transition-all duration-150 ${
                  isDragging
                    ? "opacity-30 border-dashed border-brand bg-purple-50/50"
                    : isDragOver
                    ? "border-brand bg-purple-50/30 scale-[1.01]"
                    : "bg-white border-neutral-200/90 hover:border-neutral-300 hover:shadow-xs"
                }`}
              >
                {/* Left: Drag Handle, Index, Pill Preview & Label */}
                <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 mr-2">
                  <div
                    title="Drag to reorder drop timing"
                    className="cursor-grab active:cursor-grabbing text-neutral-300 group-hover:text-neutral-500 transition-colors p-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8h16M4 16h16"
                      />
                    </svg>
                  </div>

                  <span className="text-[11px] font-mono text-neutral-400 w-5 text-center shrink-0">
                    {index + 1}
                  </span>

                  {/* Visual Pill Capsule Badge */}
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-tight shrink-0 transition-colors flex items-center gap-1.5 ${
                      skill.accent
                        ? "bg-[#9A78F5] text-white shadow-xs"
                        : "bg-[#F7F6F3] text-[#0E0E0E] border border-neutral-200"
                    }`}
                  >
                    <span>{skill.label}</span>
                  </div>

                  {/* Inline Edit mode */}
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 flex-1 min-w-0 max-w-xs">
                      <input
                        type="text"
                        autoFocus
                        value={editLabelValue}
                        onChange={(e) => setEditLabelValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSavePillEdit(index);
                          if (e.key === "Escape") setEditingIndex(null);
                        }}
                        className="w-full px-2.5 py-1 text-xs font-semibold rounded border border-brand focus:outline-none ring-1 ring-brand"
                      />
                      <button
                        type="button"
                        onClick={() => handleSavePillEdit(index)}
                        className="px-2 py-1 rounded bg-brand text-white text-[11px] font-bold"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingIndex(null)}
                        className="px-2 py-1 rounded bg-neutral-100 text-neutral-600 text-[11px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Accent Toggle Button */}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleToggleAccent(index)}
                    title={
                      skill.accent
                        ? "Accent styling active (Purple). Click to make neutral white."
                        : "Neutral styling active (White). Click to make purple accent."
                    }
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                      skill.accent
                        ? "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200"
                        : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200"
                    }`}
                  >
                    {skill.accent ? "Purple Accent" : "White Neutral"}
                  </button>

                  {/* Edit Button */}
                  {!isEditing && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => handleStartEditingPill(index)}
                      title="Edit label"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Move Up/Down Buttons */}
                  <button
                    type="button"
                    disabled={disabled || index === 0}
                    onClick={() => handleMove(index, index - 1)}
                    title="Move up (drop earlier)"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-20 cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    disabled={disabled || index === skillsList.length - 1}
                    onClick={() => handleMove(index, index + 1)}
                    title="Move down (drop later)"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-20 cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Remove Button */}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleRemoveSkill(index)}
                    title="Delete pill"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
