"use client";

import React from "react";

interface PositionFormProps {
  data: {
    statement: string;
  };
  onChange: (data: any) => void;
  disabled?: boolean;
}

export default function PositionForm({ data, onChange, disabled = false }: PositionFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
          Brand Statement Text
        </label>
        <textarea
          rows={4}
          disabled={disabled}
          value={data?.statement || ""}
          onChange={(e) => onChange({ ...data, statement: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand text-lg leading-relaxed font-medium disabled:bg-neutral-50 disabled:text-neutral-400"
        />
      </div>
    </div>
  );
}
