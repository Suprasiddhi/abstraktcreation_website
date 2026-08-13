"use client";

import React from "react";

interface HeroFormProps {
  data: {
    location: string;
    headlineLine1?: string;
    subHeadlineLines?: string[];
    headlineLines?: string[];
    description: string;
  };
  onChange: (data: any) => void;
  disabled?: boolean;
}

export default function HeroForm({ data, onChange, disabled = false }: HeroFormProps) {
  const headlineLine1 = data?.headlineLine1 || data?.headlineLines?.[0] || "";
  const subHeadlineLines = data?.subHeadlineLines || data?.headlineLines?.slice(1) || [];

  const updateField = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleMainHeadlineChange = (val: string) => {
    onChange({
      ...data,
      headlineLine1: val,
      headlineLines: [val, ...subHeadlineLines],
    });
  };

  const handleSubHeadlineChange = (index: number, val: string) => {
    const list = [...subHeadlineLines];
    list[index] = val;
    onChange({
      ...data,
      subHeadlineLines: list,
      headlineLines: [headlineLine1, ...list],
    });
  };

  const addSubHeadline = () => {
    const list = [...subHeadlineLines];
    list.push("");
    onChange({
      ...data,
      subHeadlineLines: list,
      headlineLines: [headlineLine1, ...list],
    });
  };

  const removeSubHeadline = (index: number) => {
    const list = subHeadlineLines.filter((_, i) => i !== index);
    onChange({
      ...data,
      subHeadlineLines: list,
      headlineLines: [headlineLine1, ...list],
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Location Badge */}
      <div>
        <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
          Location Badge Text
        </label>
        <input
          type="text"
          disabled={disabled}
          value={data?.location || ""}
          onChange={(e) => updateField("location", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand disabled:bg-neutral-50 disabled:text-neutral-400"
        />
      </div>

      {/* Main Headline */}
      <div>
        <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
          Main Headline Text
        </label>
        <input
          type="text"
          disabled={disabled}
          value={headlineLine1}
          placeholder="e.g. DESIGN."
          onChange={(e) => handleMainHeadlineChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold uppercase disabled:bg-neutral-50 disabled:text-neutral-400"
        />
      </div>

      {/* Sub-Headlines */}
      <div>
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5 mb-4">
          <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase">
            Sub-Headline Texts (Typewriter Cycled)
          </label>
          {!disabled && (
            <button
              type="button"
              onClick={addSubHeadline}
              className="text-[10px] bg-brand/10 hover:bg-brand/20 text-brand px-3 py-1.5 rounded-full font-bold transition-all uppercase cursor-pointer"
            >
              + Add Sub-Headline
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {subHeadlineLines.map((sub, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                disabled={disabled}
                value={sub}
                placeholder={`Sub-Headline ${idx + 1}`}
                onChange={(e) => handleSubHeadlineChange(idx, e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold uppercase disabled:bg-neutral-50 disabled:text-neutral-400"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeSubHeadline(idx)}
                  className="text-neutral-400 hover:text-red-500 font-bold px-3 py-2 cursor-pointer transition-colors text-sm"
                  title="Remove Sub-Headline"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {subHeadlineLines.length === 0 && (
            <p className="text-xs text-neutral-400 font-mono italic">No sub-headlines defined. Add at least one to show the cycle.</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
          Sub-Headline / Description Text
        </label>
        <textarea
          rows={3}
          disabled={disabled}
          value={data?.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand leading-relaxed disabled:bg-neutral-50 disabled:text-neutral-400"
        />
      </div>
    </div>
  );
}
