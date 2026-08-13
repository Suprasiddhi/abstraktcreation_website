"use client";

import React from "react";

interface Logo {
  id?: number;
  name: string;
  iconType: string;
}

interface LogosFormProps {
  data: Logo[];
  onChange: (data: Logo[]) => void;
  disabled?: boolean;
}

const PRESET_ICONS = [
  { value: "flag", label: "Flag (Vertex style)" },
  { value: "pulse", label: "Pulse/Polyline (Kinetic style)" },
  { value: "triangle", label: "Triangle (Apex style)" },
  { value: "hexagon", label: "Hexagon (Spectrum style)" },
  { value: "cosmos", label: "Cosmos Ellipses (Cosmos style)" },
  { value: "quantum", label: "Quantum Cross (Quantum style)" },
  { value: "nexus", label: "Nexus Circle (Nexus style)" },
  { value: "elevate", label: "Chevron Up (Elevate style)" },
  { value: "star", label: "Star (Default style)" },
];

export default function LogosForm({ data = [], onChange, disabled = false }: LogosFormProps) {
  const updateLogoField = (index: number, field: string, value: any) => {
    const list = [...data];
    list[index] = { ...list[index], [field]: value };
    onChange(list);
  };

  const addLogo = () => {
    const list = [...data];
    list.push({
      name: "NEWBRAND",
      iconType: "star",
    });
    onChange(list);
  };

  const removeLogo = (index: number) => {
    const list = data.filter((_, i) => i !== index);
    onChange(list);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <span className="text-sm font-semibold text-neutral-500 font-mono">
          Custom Logos Roster ({data?.length || 0})
        </span>
        {!disabled && (
          <button
            type="button"
            onClick={addLogo}
            className="text-xs bg-brand/10 hover:bg-brand/20 text-brand px-3.5 py-1.5 rounded-full font-bold transition-all uppercase cursor-pointer"
          >
            + Add Logo
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {data.map((logo, index) => (
          <div key={index} className="border border-neutral-200/80 rounded-xl p-5 bg-neutral-50/50 flex flex-col gap-4 relative group">
            {!disabled && (
              <button
                type="button"
                onClick={() => removeLogo(index)}
                className="absolute top-4 right-4 text-xs font-bold text-neutral-450 hover:text-red-500 transition-colors uppercase cursor-pointer"
              >
                ✕ Remove
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Logo Text / Brand Name</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={logo.name}
                  onChange={(e) => updateLogoField(index, "name", e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand font-bold uppercase disabled:bg-neutral-50 disabled:text-neutral-450"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Icon Shape Preset</label>
                <select
                  disabled={disabled}
                  value={logo.iconType}
                  onChange={(e) => updateLogoField(index, "iconType", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand bg-white disabled:bg-neutral-50 disabled:text-neutral-450 cursor-pointer"
                >
                  {PRESET_ICONS.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-sm text-neutral-500 font-mono italic text-center py-6">No custom logos created. Click "+ Add Logo" to define one.</p>
        )}
      </div>
    </div>
  );
}
