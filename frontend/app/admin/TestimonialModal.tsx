"use client";

import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";

export interface TestimonialItemData {
  id?: number;
  quote: string;
  authorName: string;
  authorRole: string;
  theme?: "light" | "dark";
}

interface TestimonialModalProps {
  testimonial?: TestimonialItemData | null;
  onSave: (item: TestimonialItemData) => void;
  onClose: () => void;
}

export default function TestimonialModal({ testimonial, onSave, onClose }: TestimonialModalProps) {
  const [quote, setQuote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [error, setError] = useState("");

  useEffect(() => {
    if (testimonial) {
      setQuote(testimonial.quote || "");
      setAuthorName(testimonial.authorName || "");
      setAuthorRole(testimonial.authorRole || "");
      setTheme(testimonial.theme || "light");
    } else {
      setQuote("");
      setAuthorName("");
      setAuthorRole("");
      setTheme("light");
    }
  }, [testimonial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim()) {
      setError("Quote text is required.");
      return;
    }
    if (!authorName.trim()) {
      setError("Author name is required.");
      return;
    }

    onSave({
      ...(testimonial?.id ? { id: testimonial.id } : {}),
      quote: quote.trim(),
      authorName: authorName.trim(),
      authorRole: authorRole.trim(),
      theme,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-black uppercase text-foreground">
              {testimonial ? "Edit Testimonial" : "Add Testimonial"}
            </h3>
            <p className="text-xs text-neutral-400 font-mono uppercase mt-1">
              {testimonial ? "Modify client feedback and review quote" : "Add a new client rating and review card"}
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
              Quote Text *
            </label>
            <textarea
              rows={4}
              placeholder="e.g. They rebuilt the site and the brand in the same pass..."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
                Author Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Kiran Gurung"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
                Role & Company
              </label>
              <input
                type="text"
                placeholder="e.g. Founder, Vertex"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Card Color Theme
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === "light"}
                  onChange={() => setTheme("light")}
                  className="text-brand focus:ring-brand"
                />
                Light Card (Default)
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === "dark"}
                  onChange={() => setTheme("dark")}
                  className="text-brand focus:ring-brand"
                />
                Dark Card (Accent)
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors uppercase"
            >
              Cancel
            </button>
            <Button variant="primary" type="submit" className="py-2.5 px-6 text-xs font-bold uppercase">
              {testimonial ? "Update Review" : "Add Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
