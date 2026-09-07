"use client";

import React, { useState } from "react";
import RoleModal, { CareerRoleData } from "./RoleModal";

interface CareersData {
  badge?: string;
  title?: string;
  description?: string;
  roles?: CareerRoleData[];
}

interface CareersFormProps {
  data: CareersData;
  onChange: (data: CareersData) => void;
  onStartEditing?: () => void;
  disabled?: boolean;
}

export default function CareersForm({ data, onChange, onStartEditing, disabled = false }: CareersFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const rolesList = Array.isArray(data?.roles) ? data.roles : [];

  const handleStartEdit = (index: number) => {
    if (onStartEditing) onStartEditing();
    setEditingIndex(index);
  };

  const handleStartCreate = () => {
    if (onStartEditing) onStartEditing();
    setIsCreating(true);
  };

  const handleSaveModal = (savedRole: CareerRoleData) => {
    if (onStartEditing) onStartEditing();
    const list = [...rolesList];
    if (isCreating) {
      list.push(savedRole);
    } else if (editingIndex !== null) {
      list[editingIndex] = savedRole;
    }
    onChange({
      ...data,
      roles: list,
    });
    setEditingIndex(null);
    setIsCreating(false);
  };

  const removeRole = (index: number) => {
    const target = rolesList[index];
    const rTitle = target?.title || "this position";
    if (!window.confirm(`Are you sure you want to delete "${rTitle}"?`)) {
      return;
    }
    if (onStartEditing) onStartEditing();
    const list = rolesList.filter((_, i) => i !== index);
    onChange({
      ...data,
      roles: list,
    });
  };

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

    if (onStartEditing) onStartEditing();
    const list = [...rolesList];
    const [moved] = list.splice(draggedIndex, 1);
    list.splice(targetIndex, 0, moved);

    onChange({
      ...data,
      roles: list,
    });
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Careers Section Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
            Section Badge
          </label>
          <input
            type="text"
            disabled={disabled}
            value={data?.badge || ""}
            onChange={(e) => onChange({ ...data, badge: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand disabled:bg-neutral-50 disabled:text-neutral-400"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
            Section Title
          </label>
          <input
            type="text"
            disabled={disabled}
            value={data?.title || ""}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold disabled:bg-neutral-50 disabled:text-neutral-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
          Section Description
        </label>
        <textarea
          rows={3}
          disabled={disabled}
          value={data?.description || ""}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand disabled:bg-neutral-50 disabled:text-neutral-400"
        />
      </div>

      {/* Open Roles Sub-section */}
      <div className="border-t border-neutral-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black tracking-wider uppercase text-neutral-800">
              Open Positions ({rolesList.length})
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Roles listed inside the purple Careers callout card.
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartCreate}
            className="text-xs font-bold font-mono tracking-wider uppercase bg-brand/10 text-brand px-3.5 py-1.5 rounded-lg hover:bg-brand hover:text-white transition-all cursor-pointer"
          >
            + Add Position
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {rolesList.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
              <p className="text-xs font-mono uppercase text-neutral-400">No open positions. Click &quot;+ Add Position&quot; to create one.</p>
            </div>
          ) : (
            rolesList.map((role, idx) => {
              const isDragging = draggedIndex === idx;
              const isOver = dragOverIndex === idx;

              return (
                <div
                  key={role.id ?? idx}
                  draggable={!disabled}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  onDragEnd={() => {
                    setDraggedIndex(null);
                    setDragOverIndex(null);
                  }}
                  className={`flex items-center justify-between p-4 rounded-xl border bg-white transition-all ${
                    isDragging
                      ? "opacity-40 border-dashed border-neutral-400 scale-[0.99]"
                      : isOver
                      ? "border-brand bg-brand/5"
                      : "border-neutral-200/80 hover:border-neutral-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                    <span className="text-xs font-mono text-neutral-300 select-none cursor-grab active:cursor-grabbing">
                      :::
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-black text-foreground truncate">
                        {role.title}
                      </span>
                      <span className="text-xs font-mono text-neutral-400">
                        {role.location} · {role.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(idx)}
                      className="text-xs font-semibold text-neutral-500 hover:text-brand px-2.5 py-1.5 rounded transition-colors uppercase cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRole(idx)}
                      className="text-xs font-semibold text-neutral-400 hover:text-red-500 px-2.5 py-1.5 rounded transition-colors uppercase cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {(editingIndex !== null || isCreating) && (
        <RoleModal
          role={editingIndex !== null ? rolesList[editingIndex] : null}
          onSave={handleSaveModal}
          onClose={() => {
            setEditingIndex(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}
