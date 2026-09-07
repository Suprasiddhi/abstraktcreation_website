"use client";

import React, { useState } from "react";
import TestimonialModal, { TestimonialItemData } from "./TestimonialModal";

interface TestimonialsFormProps {
  data: TestimonialItemData[];
  onChange: (data: TestimonialItemData[]) => void;
  onStartEditing?: () => void;
  disabled?: boolean;
}

export default function TestimonialsForm({ data, onChange, onStartEditing, disabled = false }: TestimonialsFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const testimonialsList = Array.isArray(data) ? data : [];

  const handleStartEdit = (index: number) => {
    if (onStartEditing) onStartEditing();
    setEditingIndex(index);
  };

  const handleStartCreate = () => {
    if (onStartEditing) onStartEditing();
    setIsCreating(true);
  };

  const handleSaveModal = (savedItem: TestimonialItemData) => {
    if (onStartEditing) onStartEditing();
    const list = [...testimonialsList];
    if (isCreating) {
      list.push(savedItem);
    } else if (editingIndex !== null) {
      list[editingIndex] = savedItem;
    }
    onChange(list);
    setEditingIndex(null);
    setIsCreating(false);
  };

  const removeTestimonial = (index: number) => {
    const target = testimonialsList[index];
    const author = target?.authorName || "this review";
    if (!window.confirm(`Are you sure you want to delete the review by "${author}"?`)) {
      return;
    }
    if (onStartEditing) onStartEditing();
    const list = testimonialsList.filter((_, i) => i !== index);
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
    const list = [...testimonialsList];
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
            Ratings & Reviews ({testimonialsList.length})
          </h3>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Client quotes rendered in the interactive draggable testimonial card carousel.
          </p>
        </div>
        <button
          type="button"
          onClick={handleStartCreate}
          className="text-xs font-bold font-mono tracking-wider uppercase bg-brand/10 text-brand px-3.5 py-1.5 rounded-lg hover:bg-brand hover:text-white transition-all cursor-pointer"
        >
          + Add Review
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {testimonialsList.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
            <p className="text-xs font-mono uppercase text-neutral-400">No testimonials found. Click &quot;+ Add Review&quot; to begin.</p>
          </div>
        ) : (
          testimonialsList.map((item, idx) => {
            const isDragging = draggedIndex === idx;
            const isOver = dragOverIndex === idx;

            return (
              <div
                key={item.id ?? idx}
                draggable={!disabled}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                className={`flex items-start justify-between p-4 rounded-xl border bg-white transition-all ${
                  isDragging
                    ? "opacity-40 border-dashed border-neutral-400 scale-[0.99]"
                    : isOver
                    ? "border-brand bg-brand/5"
                    : "border-neutral-200/80 hover:border-neutral-300 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4 flex-1 min-w-0 pr-4">
                  <span className="text-xs font-mono text-neutral-300 select-none cursor-grab active:cursor-grabbing mt-1">
                    :::
                  </span>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-foreground">
                        {item.authorName}
                      </span>
                      {item.authorRole && (
                        <span className="text-xs text-neutral-400 font-medium">
                          ({item.authorRole})
                        </span>
                      )}
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        item.theme === "dark" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"
                      }`}>
                        {item.theme || "light"}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-2 italic font-sans">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(idx)}
                    className="text-xs font-semibold text-neutral-500 hover:text-brand px-2.5 py-1.5 rounded transition-colors uppercase cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTestimonial(idx)}
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
        <TestimonialModal
          testimonial={editingIndex !== null ? testimonialsList[editingIndex] : null}
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
