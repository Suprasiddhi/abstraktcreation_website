"use client";

import React from "react";

interface HeroFormProps {
  data: {
    location: string;
    headlineLines: string[];
    description: string;
  };
  onChange: (data: any) => void;
  disabled?: boolean;
}

export default function HeroForm({ data, onChange, disabled = false }: HeroFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updateHeadlineLine = (index: number, value: string) => {
    const lines = [...(data?.headlineLines || ["DESIGN.", "BUILD.", "GROW."])];
    lines[index] = value;
    updateField("headlineLines", lines);
  };

  return (
    <div className="flex flex-col gap-6">
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

      <div>
        <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
          Headline Lines (Top to Bottom)
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((idx) => (
            <input
              key={idx}
              type="text"
              disabled={disabled}
              value={data?.headlineLines?.[idx] || ""}
              placeholder={`Line ${idx + 1}`}
              onChange={(e) => updateHeadlineLine(idx, e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold uppercase disabled:bg-neutral-50 disabled:text-neutral-400"
            />
          ))}
        </div>
      </div>

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
