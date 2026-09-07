"use client";

import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";

export interface StatItemData {
  id?: number;
  value: number;
  suffix?: string;
  display?: string;
  label: string;
}

interface StatModalProps {
  stat?: StatItemData | null;
  onSave: (stat: StatItemData) => void;
  onClose: () => void;
}

export default function StatModal({ stat, onSave, onClose }: StatModalProps) {
  const [value, setValue] = useState<number>(0);
  const [suffix, setSuffix] = useState("");
  const [display, setDisplay] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (stat) {
      setValue(stat.value ?? 0);
      setSuffix(stat.suffix || "");
      setDisplay(stat.display || "");
      setLabel(stat.label || "");
    } else {
      setValue(0);
      setSuffix("+");
      setDisplay("");
      setLabel("");
    }
  }, [stat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError("Label is required.");
      return;
    }

    onSave({
      ...(stat?.id ? { id: stat.id } : {}),
      value: Number(value) || 0,
      suffix: suffix.trim(),
      display: display.trim(),
      label: label.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-black uppercase text-foreground">
              {stat ? "Edit Stat / Metric" : "Add Stat / Metric"}
            </h3>
            <p className="text-xs text-neutral-400 font-mono uppercase mt-1">
              {stat ? "Modify counter or custom glyph" : "Create a new metric counter for the proof section"}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
                Numeric Value
              </label>
              <input
                type="number"
                placeholder="e.g. 30"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
                Suffix (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. +"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Custom Display Glyph (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. ∞ (overrides number count-up)"
              value={display}
              onChange={(e) => setDisplay(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
            <p className="text-[11px] text-neutral-400 mt-1 font-sans">
              Leave blank to animate counting up from 0 to the numeric value.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-2">
              Label Description *
            </label>
            <input
              type="text"
              placeholder="e.g. Projects Delivered"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              required
            />
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
              {stat ? "Update Metric" : "Add Metric"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
