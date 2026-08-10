"use client";

import React from "react";

interface Project {
  title: string;
  subtitle: string;
  ratio: string;
  category: string;
}

interface WorkFormProps {
  data: {
    projects: Project[];
  };
  onChange: (data: any) => void;
  disabled?: boolean;
}

export default function WorkForm({ data, onChange, disabled = false }: WorkFormProps) {
  const updateProjectField = (index: number, field: string, value: any) => {
    const list = [...(data?.projects || [])];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...data, projects: list });
  };

  const addProject = () => {
    const list = [...(data?.projects || [])];
    list.push({
      title: "NEW PROJECT",
      subtitle: "Project details here",
      ratio: "16:10",
      category: "DESIGN",
    });
    onChange({ ...data, projects: list });
  };

  const removeProject = (index: number) => {
    const list = (data?.projects || []).filter((_, i) => i !== index);
    onChange({ ...data, projects: list });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <span className="text-sm font-semibold text-neutral-500 font-mono">
          Manage Projects ({data?.projects?.length || 0})
        </span>
        {!disabled && (
          <button
            onClick={addProject}
            className="text-xs bg-brand/10 hover:bg-brand/20 text-brand px-3.5 py-1.5 rounded-full font-bold transition-all uppercase cursor-pointer"
          >
            + Add Project
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {(data?.projects || []).map((project, index) => (
          <div key={index} className="border border-neutral-200/80 rounded-xl p-6 bg-neutral-50/50 flex flex-col gap-4 relative group">
            {!disabled && (
              <button
                onClick={() => removeProject(index)}
                className="absolute top-4 right-4 text-xs font-bold text-neutral-450 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase cursor-pointer"
              >
                X
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Project Title</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={project.title}
                  onChange={(e) => updateProjectField(index, "title", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand font-bold uppercase disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Subtitle / Visual details</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={project.subtitle}
                  onChange={(e) => updateProjectField(index, "subtitle", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Pillar Category</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={project.category}
                  onChange={(e) => updateProjectField(index, "category", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand uppercase font-bold disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 mb-1">Aspect Ratio (e.g. 3:4, 2:3, 16:10)</label>
                <input
                  type="text"
                  disabled={disabled}
                  value={project.ratio}
                  onChange={(e) => updateProjectField(index, "ratio", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand font-mono disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
