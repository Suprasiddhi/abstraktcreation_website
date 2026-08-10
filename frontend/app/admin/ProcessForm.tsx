"use client";

import React from "react";

interface Step {
  id: string;
  title: string;
  description: string;
}

interface ProcessFormProps {
  data: {
    steps: Step[];
  };
  onChange: (data: any) => void;
  disabled?: boolean;
}

export default function ProcessForm({ data, onChange, disabled = false }: ProcessFormProps) {
  const updateStepField = (index: number, field: string, value: any) => {
    const list = [...(data?.steps || [])];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...data, steps: list });
  };

  const addStep = () => {
    const list = [...(data?.steps || [])];
    const newId = String(list.length + 1).padStart(2, "0");
    list.push({
      id: newId,
      title: "New Stage",
      description: "Description of the process stage.",
    });
    onChange({ ...data, steps: list });
  };

  const removeStep = (index: number) => {
    const list = (data?.steps || []).filter((_, i) => i !== index);
    onChange({ ...data, steps: list });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <span className="text-sm font-semibold text-neutral-500 font-mono">
          Manage Process Steps ({data?.steps?.length || 0})
        </span>
        {!disabled && (
          <button
            onClick={addStep}
            className="text-xs bg-brand/10 hover:bg-brand/20 text-brand px-3.5 py-1.5 rounded-full font-bold transition-all uppercase cursor-pointer"
          >
            + Add Step
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {(data?.steps || []).map((step, index) => (
          <div key={index} className="border border-neutral-200/80 rounded-xl p-6 bg-neutral-50/50 flex flex-col gap-4 relative group">
            {!disabled && (
              <button
                onClick={() => removeStep(index)}
                className="absolute top-4 right-4 text-xs font-bold text-neutral-450 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase cursor-pointer"
              >
                X
              </button>
            )}

            <div className="grid grid-cols-4 gap-4 items-end">
              <div className="col-span-1">
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Step ID / Code</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={step.id}
                  onChange={(e) => updateStepField(index, "id", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand font-mono text-center disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Title</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={step.title}
                  onChange={(e) => updateStepField(index, "title", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand font-bold disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Description</label>
              <textarea
                rows={2}
                disabled={disabled}
                value={step.description}
                onChange={(e) => updateStepField(index, "description", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand leading-relaxed disabled:bg-neutral-50 disabled:text-neutral-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
