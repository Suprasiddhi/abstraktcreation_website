"use client";

import React, { useState } from "react";
import FaqModal, { FaqItemData } from "./FaqModal";

interface FaqFormProps {
  data: {
    badge?: string;
    title?: string;
    description?: string;
    buttonText?: string;
    questions?: FaqItemData[];
  };
  onChange: (data: any) => void;
  onStartEditing?: () => void;
  disabled?: boolean;
}

export default function FaqForm({ data, onChange, onStartEditing, disabled = false }: FaqFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const questionsList = data?.questions || [];

  const updateQuestions = (questions: FaqItemData[]) => {
    onChange({
      ...data,
      badge: "GOT QUESTIONS?",
      title: "FREQUENTLY ASKED QUESTIONS",
      description: "Find answers to the most common questions about Abstrakt Creation and our comprehensive digital, creative, and branding services.",
      buttonText: "VIEW ALL FAQS +",
      questions,
    });
  };

  const handleStartEdit = (index: number) => {
    if (onStartEditing) onStartEditing();
    setEditingIndex(index);
  };

  const handleStartCreate = () => {
    if (onStartEditing) onStartEditing();
    setIsCreating(true);
  };

  const handleSaveModal = (savedFaq: FaqItemData) => {
    if (onStartEditing) onStartEditing();
    const list = [...questionsList];
    if (isCreating) {
      list.push(savedFaq);
    } else if (editingIndex !== null) {
      list[editingIndex] = savedFaq;
    }
    updateQuestions(list);
    setEditingIndex(null);
    setIsCreating(false);
  };

  const removeQuestion = (index: number) => {
    const target = questionsList[index];
    const qText = target?.question || "this question";
    if (!window.confirm(`Are you sure you want to delete "${qText}"?`)) {
      return;
    }
    if (onStartEditing) onStartEditing();
    const list = questionsList.filter((_, i) => i !== index);
    updateQuestions(list);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const list = [...questionsList];
    const [movedItem] = list.splice(draggedIndex, 1);
    list.splice(dropIndex, 0, movedItem);

    if (onStartEditing) onStartEditing();
    updateQuestions(list);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-4 text-xs text-neutral-500 flex items-center justify-between">
        <div>
          <p className="font-semibold text-neutral-700 mb-0.5">Static FAQ Section Header</p>
          <p>
            The FAQ section header (Badge: <span className="font-mono text-brand">GOT QUESTIONS?</span>, Title: <span className="font-mono text-neutral-800 font-bold">FREQUENTLY ASKED QUESTIONS</span>) is static. Manage the dynamic questions below.
          </p>
        </div>
        <span className="text-[11px] font-mono text-neutral-400 bg-neutral-200/60 px-2.5 py-1 rounded-md shrink-0 ml-4 hidden sm:inline-block">
          ↕ Drag &amp; Drop to Rearrange
        </span>
      </div>

      <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mt-2">
        <span className="text-sm font-semibold text-neutral-500 font-mono flex items-center gap-2">
          Manage FAQ Questions ({questionsList.length})
        </span>
        <button
          type="button"
          onClick={handleStartCreate}
          className="text-xs bg-brand/10 hover:bg-brand/20 text-brand px-3.5 py-1.5 rounded-full font-bold transition-all uppercase cursor-pointer"
        >
          + Add QUE
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {questionsList.map((faq, index) => (
          <div
            key={index}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={() => {
              setDraggedIndex(null);
              setDragOverIndex(null);
            }}
            className={`border rounded-xl p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 relative group transition-all duration-200 ${
              draggedIndex === index
                ? "opacity-30 border-dashed border-brand bg-brand/5 scale-[0.99]"
                : dragOverIndex === index
                ? "border-brand ring-2 ring-brand/30 bg-brand/5 scale-[1.01]"
                : "border-neutral-200/80 bg-neutral-50/50 hover:border-neutral-300"
            }`}
          >
            {/* Drag Handle Icon */}
            <div
              className="text-neutral-400 hover:text-neutral-700 cursor-grab active:cursor-grabbing p-1 shrink-0 transition-colors"
              title="Click & drag to reorder question"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-neutral-350 group-hover:text-neutral-600"
              >
                <circle cx="9" cy="5" r="1.5" />
                <circle cx="15" cy="5" r="1.5" />
                <circle cx="9" cy="12" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="9" cy="19" r="1.5" />
                <circle cx="15" cy="19" r="1.5" />
              </svg>
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-brand bg-brand/10 px-2 py-0.5 rounded shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h4 className="text-base font-bold text-foreground truncate">
                  {faq.question}
                </h4>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed pl-8 line-clamp-2">
                {faq.answer}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Delete Icon Button */}
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-red-500 text-neutral-600 hover:text-red-600 transition-colors cursor-pointer shadow-sm"
                title="Delete question"
                aria-label="Delete question"
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
                title="Edit question"
                aria-label="Edit question"
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

        {questionsList.length === 0 && (
          <p className="text-sm text-neutral-400 font-mono italic text-center py-8">
            No FAQ questions found. Click &quot;+ Add QUE&quot; to create a new question.
          </p>
        )}
      </div>

      {/* Modal for creating or editing an FAQ question */}
      {(isCreating || editingIndex !== null) && (
        <FaqModal
          faq={editingIndex !== null ? questionsList[editingIndex] : null}
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
