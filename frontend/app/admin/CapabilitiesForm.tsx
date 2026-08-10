"use client";

import React from "react";

interface Pillar {
  id: string;
  label: string;
  title: string;
  description: string;
  tag: string;
  badge: string;
}

interface CapabilitiesFormProps {
  data: {
    pillars: Record<string, Pillar>;
  };
  onChange: (data: any) => void;
  disabled?: boolean;
}

export default function CapabilitiesForm({ data, onChange, disabled = false }: CapabilitiesFormProps) {
  const updatePillar = (pillarKey: string, field: string, value: any) => {
    onChange({
      ...data,
      pillars: {
        ...data.pillars,
        [pillarKey]: {
          ...data.pillars[pillarKey],
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {Object.keys(data?.pillars || {}).map((pillarKey) => {
        const pillar = data.pillars[pillarKey];
        return (
          <div key={pillarKey} className="border border-neutral-200/80 rounded-xl p-6 bg-neutral-50/50 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3 mb-2">
              <span className="font-mono text-xs font-bold text-neutral-450">PILLAR KEY: {pillarKey.toUpperCase()}</span>
              <span className="text-[10px] font-mono bg-brand/10 text-brand font-bold px-2 py-0.5 rounded">
                SLOT {pillar.id}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 uppercase mb-1">Badge label</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={pillar.label}
                  onChange={(e) => updatePillar(pillarKey, "label", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 uppercase mb-1">Title</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={pillar.title}
                  onChange={(e) => updatePillar(pillarKey, "title", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand font-bold uppercase disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 uppercase mb-1">Tag label</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={pillar.tag}
                  onChange={(e) => updatePillar(pillarKey, "tag", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 uppercase mb-1">Status badge text</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={pillar.badge}
                  onChange={(e) => updatePillar(pillarKey, "badge", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-500 uppercase mb-1">Description</label>
              <textarea
                rows={2}
                disabled={disabled}
                value={pillar.description}
                onChange={(e) => updatePillar(pillarKey, "description", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand leading-relaxed disabled:bg-neutral-50 disabled:text-neutral-400"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
