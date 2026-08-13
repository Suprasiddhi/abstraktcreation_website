"use client";

import React, { useState } from "react";
import ProjectModal, { ProjectData } from "./ProjectModal";

interface WorkFormProps {
  data: {
    projects: ProjectData[];
  };
  onChange: (data: any) => void;
  onStartEditing?: () => void;
  disabled?: boolean;
}

export default function WorkForm({ data, onChange, onStartEditing, disabled = false }: WorkFormProps) {
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const projectsList = data?.projects || [];

  const handleStartEdit = (index: number) => {
    if (onStartEditing) onStartEditing();
    setEditingProjectIndex(index);
  };

  const handleSaveModal = (updatedProject: ProjectData) => {
    if (onStartEditing) onStartEditing();
    const list = [...projectsList];
    if (isCreatingNew) {
      list.push(updatedProject);
    } else if (editingProjectIndex !== null) {
      list[editingProjectIndex] = updatedProject;
    }
    onChange({ ...data, projects: list });
    setEditingProjectIndex(null);
    setIsCreatingNew(false);
  };

  const removeProject = (index: number) => {
    const list = projectsList.filter((_, i) => i !== index);
    onChange({ ...data, projects: list });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <span className="text-sm font-semibold text-neutral-500 font-mono">
          Manage Projects ({projectsList.length})
        </span>
        {!disabled && (
          <button
            type="button"
            onClick={() => setIsCreatingNew(true)}
            className="text-xs bg-brand/10 hover:bg-brand/20 text-brand px-3.5 py-1.5 rounded-full font-bold transition-all uppercase cursor-pointer"
          >
            + Add Project
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {projectsList.map((project, index) => {
          const descCount = (project.bodySections || []).filter((s) => s.type === "description").length;
          const mediaCount = (project.bodySections || []).filter((s) => s.type === "media").length;

          return (
            <div
              key={index}
              className="border border-neutral-200/80 rounded-xl p-5 bg-neutral-50/50 flex items-center justify-between gap-4 relative group"
            >
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center gap-3">
                  {project.logoUrl && (
                    <img src={project.logoUrl} alt="Logo" className="h-6 w-auto object-contain" />
                  )}
                  <h4 className="text-base font-black uppercase text-foreground">
                    {project.title || "UNTITLED PROJECT"}
                  </h4>
                  {project.category && (
                    <span className="text-[10px] font-mono font-bold bg-brand/10 text-brand px-2 py-0.5 rounded uppercase">
                      {project.category}
                    </span>
                  )}
                  {project.client && (
                    <span className="text-[10px] font-mono font-bold bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded uppercase">
                      Client: {project.client} ({project.clientType || "brand"})
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-500">{project.subtitle || "No subtitle provided"}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-neutral-400 mt-1">
                  {project.serviceType && <span>Service: {project.serviceType}</span>}
                  {(project.startDate || project.endDate) && (
                    <span>
                      Timeline: {project.startDate || "N/A"} — {project.endDate || "N/A"}
                    </span>
                  )}
                  <span>
                    Body: {project.bodySections?.length || 0} Sections ({descCount} Text, {mediaCount} Media)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStartEdit(index)}
                  className="text-xs font-bold bg-white border border-neutral-200 hover:border-brand text-neutral-700 hover:text-brand px-3.5 py-1.5 rounded-lg transition-colors uppercase cursor-pointer shadow-sm"
                >
                  Edit
                </button>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="text-xs font-bold text-neutral-400 hover:text-red-500 p-1.5 uppercase transition-colors cursor-pointer"
                    title="Remove Project"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {projectsList.length === 0 && (
          <p className="text-sm text-neutral-400 font-mono italic text-center py-8">
            No projects found. Click &quot;+ Add Project&quot; to create a new project with description &amp; media sections.
          </p>
        )}
      </div>

      {/* Modal Render for Editing existing project or Creating new project */}
      {(isCreatingNew || editingProjectIndex !== null) && (
        <ProjectModal
          project={editingProjectIndex !== null ? projectsList[editingProjectIndex] : null}
          onSave={handleSaveModal}
          onClose={() => {
            setEditingProjectIndex(null);
            setIsCreatingNew(false);
          }}
        />
      )}
    </div>
  );
}
