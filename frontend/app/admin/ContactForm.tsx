"use client";

import React from "react";

interface ContactData {
  headlineLine1?: string;
  headlineLine2?: string;
  description?: string;
  email?: string;
  phone?: string;
}

interface ContactFormProps {
  data: ContactData;
  onChange: (data: ContactData) => void;
  disabled?: boolean;
}

export default function ContactForm({ data, onChange, disabled = false }: ContactFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
            Headline Line 1
          </label>
          <input
            type="text"
            disabled={disabled}
            placeholder="e.g. Let's make"
            value={data?.headlineLine1 || ""}
            onChange={(e) => onChange({ ...data, headlineLine1: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold disabled:bg-neutral-50 disabled:text-neutral-400"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
            Headline Line 2
          </label>
          <input
            type="text"
            disabled={disabled}
            placeholder="e.g. the thing."
            value={data?.headlineLine2 || ""}
            onChange={(e) => onChange({ ...data, headlineLine2: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold disabled:bg-neutral-50 disabled:text-neutral-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
          Description Paragraph
        </label>
        <textarea
          rows={3}
          disabled={disabled}
          placeholder="e.g. Tell us what you are trying to launch and roughly when..."
          value={data?.description || ""}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand disabled:bg-neutral-50 disabled:text-neutral-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
            Direct Contact Email
          </label>
          <input
            type="email"
            disabled={disabled}
            placeholder="e.g. abstraktcreation@gmail.com"
            value={data?.email || ""}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand disabled:bg-neutral-50 disabled:text-neutral-400 font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
            Direct Phone Number
          </label>
          <input
            type="text"
            disabled={disabled}
            placeholder="e.g. +977 9823901866"
            value={data?.phone || ""}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand disabled:bg-neutral-50 disabled:text-neutral-400 font-mono"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60">
        <p className="text-xs text-neutral-500 font-sans">
          💡 The skills physics canvas pills beside this section remain interactive and safely preserved.
        </p>
      </div>
    </div>
  );
}
