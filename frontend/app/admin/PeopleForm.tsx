"use client";

import React from "react";

interface Member {
  name: string;
  role: string;
}

interface PeopleFormProps {
  data: {
    team: Member[];
    extraCount: number;
  };
  onChange: (data: any) => void;
  disabled?: boolean;
}

export default function PeopleForm({ data, onChange, disabled = false }: PeopleFormProps) {
  const updateTeamField = (index: number, field: string, value: any) => {
    const list = [...(data?.team || [])];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...data, team: list });
  };

  const addTeamMember = () => {
    const list = [...(data?.team || [])];
    list.push({
      name: "New Member",
      role: "Role Title",
    });
    onChange({ ...data, team: list });
  };

  const removeTeamMember = (index: number) => {
    const list = (data?.team || []).filter((_, i) => i !== index);
    onChange({ ...data, team: list });
  };

  const updatePeopleField = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-neutral-100">
        <div>
          <label className="block text-[11px] font-mono font-bold tracking-widest text-neutral-500 mb-2">
            Additional Roster Card Size (+X size)
          </label>
          <input
            type="number"
            disabled={disabled}
            value={data?.extraCount !== undefined ? data.extraCount : 6}
            onChange={(e) => updatePeopleField("extraCount", parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-bold font-mono disabled:bg-neutral-50 disabled:text-neutral-400"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mt-2">
        <span className="text-sm font-semibold text-neutral-500 font-mono">
          Roster Team List ({data?.team?.length || 0})
        </span>
        {!disabled && (
          <button
            onClick={addTeamMember}
            className="text-xs bg-brand/10 hover:bg-brand/20 text-brand px-3.5 py-1.5 rounded-full font-bold transition-all uppercase cursor-pointer"
          >
            + Add Member
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {(data?.team || []).map((member, index) => (
          <div key={index} className="border border-neutral-200/80 rounded-xl p-5 bg-neutral-50/50 flex flex-col gap-4 relative group">
            {!disabled && (
              <button
                onClick={() => removeTeamMember(index)}
                className="absolute top-4 right-4 text-xs font-bold text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase cursor-pointer"
              >
                X
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={member.name}
                  onChange={(e) => updateTeamField(index, "name", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand font-bold disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Role Title</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={member.role}
                  onChange={(e) => updateTeamField(index, "role", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
