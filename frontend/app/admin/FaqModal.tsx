"use client";

import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";

export interface FaqItemData {
  question: string;
  answer: string;
}

interface FaqModalProps {
  faq?: FaqItemData | null;
  onSave: (faq: FaqItemData) => void;
  onClose: () => void;
}

export default function FaqModal({ faq, onSave, onClose }: FaqModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question || "");
      setAnswer(faq.answer || "");
    } else {
      setQuestion("");
      setAnswer("");
    }
  }, [faq]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError("Question is required.");
      return;
    }
    if (!answer.trim()) {
      setError("Answer is required.");
      return;
    }

    onSave({
      question: question.trim(),
      answer: answer.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-black uppercase text-foreground">
              {faq ? "Edit FAQ Question" : "Add FAQ Question"}
            </h3>
            <p className="text-xs text-neutral-400 font-mono uppercase mt-1">
              {faq ? "Modify existing question & answer" : "Create a new question for the FAQ section"}
            </p>
          </div>
          <button
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
          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. What services does Abstrakt Creation offer?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="e.g. We provide end-to-end design, digital, growth, and creative solutions..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand text-foreground leading-relaxed"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" className="py-2.5 px-6 font-bold text-xs">
              {faq ? "Save Changes" : "+ Add Question"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
