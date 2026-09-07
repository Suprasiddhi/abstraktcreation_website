"use client";

import React, { useState } from "react";
import StatModal, { StatItemData } from "./StatModal";

interface StatsFormProps {
  data: StatItemData[];
  onChange: (data: StatItemData[]) => void;
  onStartEditing?: () => void;
  disabled?: boolean;
}

export default function StatsForm({ data, onChange, onStartEditing, disabled = false }: StatsFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const statsList = Array.isArray(data) ? data : [];

  const handleStartEdit = (index: number) => {
    if (onStartEditing) onStartEditing();
    setEditingIndex(index);
  };

  const handleStartCreate = () => {
    if (onStartEditing) onStartEditing();
    setIsCreating(true);
  };

  const handleSaveModal = (savedStat: StatItemData) => {
    if (onStartEditing) onStartEditing();
    const list = [...statsList];
    if (isCreating) {
      list.push(savedStat);
    } else if (editingIndex !== null) {
      list[editingIndex] = savedStat;
    }
    onChange(list);
    setEditingIndex(null);
    setIsCreating(false);
  };

  const removeStat = (index: number) => {
    const target = statsList[index];
    const sLabel = target?.label || "this metric";
    if (!window.confirm(`Are you sure you want to delete "${sLabel}"?`)) {
      return;
    }
    if (onStartEditing) onStartEditing();
    const list = statsList.filter((_, i) => i !== index);
    onChange(list);
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
    const list = [...statsList];
    const [moved] = list.splice(draggedIndex, 1);
    list.splice(targetIndex, 0, moved);

    onChange(list);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black tracking-wider uppercase text-neutral-800">
            Metrics & Key Statistics ({statsList.length})
          </h3>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            These numbers are displayed underneath the client logos marquee with animated count-up effects.
          </p>
        </div>
        <button
          type="button"
          onClick={handleStartCreate}
          className="text-xs font-bold font-mono tracking-wider uppercase bg-brand/10 text-brand px-3.5 py-1.5 rounded-lg hover:bg-brand hover:text-white transition-all cursor-pointer"
        >
          + Add Metric
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {statsList.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
            <p className="text-xs font-mono uppercase text-neutral-400">No metrics found. Click &quot;+ Add Metric&quot; to begin.</p>
          </div>
        ) : (
          statsList.map((stat, idx) => {
            const isDragging = draggedIndex === idx;
            const isOver = dragOverIndex === idx;

            return (
              <div
                key={stat.id ?? idx}
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
                  <div className="w-16 h-12 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 font-bold text-brand font-mono text-lg">
                    {stat.display ? stat.display : `${stat.value}${stat.suffix || ""}`}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-black text-foreground truncate">
                      {stat.label}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      Display: {stat.display || `${stat.value} ${stat.suffix || ""}`}
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
                    onClick={() => removeStat(idx)}
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

      {(editingIndex !== null || isCreating) && (
        <StatModal
          stat={editingIndex !== null ? statsList[editingIndex] : null}
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
