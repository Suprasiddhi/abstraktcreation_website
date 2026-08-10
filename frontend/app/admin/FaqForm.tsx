"use client";

import React from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqFormProps {
  data: {
    badge: string;
    title: string;
    description: string;
    buttonText: string;
    questions: FaqItem[];
  };
  onChange: (data: any) => void;
  disabled?: boolean;
}

export default function FaqForm({ data, onChange, disabled = false }: FaqFormProps) {
  const updateFaqField = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updateQuestionField = (index: number, field: string, value: any) => {
    const list = [...(data?.questions || [])];
    list[index] = { ...list[index], [field]: value };
    updateFaqField("questions", list);
  };

  const addQuestion = () => {
    const list = [...(data?.questions || [])];
    list.push({
      question: "New FAQ Question?",
      answer: "FAQ Answer here.",
    });
    updateFaqField("questions", list);
  };

  const removeQuestion = (index: number) => {
    const list = (data?.questions || []).filter((_, i) => i !== index);
    updateFaqField("questions", list);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
            Section Badge
          </label>
          <input
            type="text"
            disabled={disabled}
            value={data?.badge || ""}
            onChange={(e) => updateFaqField("badge", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand disabled:bg-neutral-50 disabled:text-neutral-400"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
            Button Label
          </label>
          <input
            type="text"
            disabled={disabled}
            value={data?.buttonText || ""}
            onChange={(e) => updateFaqField("buttonText", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold disabled:bg-neutral-50 disabled:text-neutral-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
          Section Title
        </label>
        <input
          type="text"
          disabled={disabled}
          value={data?.title || ""}
          onChange={(e) => updateFaqField("title", e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold uppercase disabled:bg-neutral-50 disabled:text-neutral-400"
        />
      </div>

      <div>
        <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
          Section Description
        </label>
        <textarea
          rows={2}
          disabled={disabled}
          value={data?.description || ""}
          onChange={(e) => updateFaqField("description", e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand leading-relaxed disabled:bg-neutral-50 disabled:text-neutral-400"
        />
      </div>

      <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mt-4">
        <span className="text-sm font-semibold text-neutral-500 font-mono">
          Manage FAQ Items ({data?.questions?.length || 0})
        </span>
        {!disabled && (
          <button
            onClick={addQuestion}
            className="text-xs bg-brand/10 hover:bg-brand/20 text-brand px-3.5 py-1.5 rounded-full font-bold transition-all uppercase cursor-pointer"
          >
            + Add FAQ
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {(data?.questions || []).map((faq, index) => (
          <div key={index} className="border border-neutral-200/80 rounded-xl p-5 bg-neutral-50/50 flex flex-col gap-4 relative group">
            {!disabled && (
              <button
                onClick={() => removeQuestion(index)}
                className="absolute top-4 right-4 text-xs font-bold text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase cursor-pointer"
              >
                X
              </button>
            )}

            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Question</label>
              <input
                type="text"
                disabled={disabled}
                value={faq.question}
                onChange={(e) => updateQuestionField(index, "question", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand font-bold disabled:bg-neutral-50 disabled:text-neutral-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Answer</label>
              <textarea
                rows={2}
                disabled={disabled}
                value={faq.answer}
                onChange={(e) => updateQuestionField(index, "answer", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand leading-relaxed disabled:bg-neutral-50 disabled:text-neutral-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
