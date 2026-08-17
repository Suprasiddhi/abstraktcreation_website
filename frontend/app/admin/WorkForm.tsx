"use client";

import React, { useState } from "react";
import ProjectModal, { ProjectData } from "./ProjectModal";
import { LogoData } from "./LogoModal";

interface WorkFormProps {
  data: {
    projects: ProjectData[];
  };
  logosData?: LogoData[];
  onChange: (data: any, updatedLogos?: LogoData[]) => void;
  onStartEditing?: () => void;
  disabled?: boolean;
}

function syncProjectLogo(
  project: ProjectData,
  prevProject: ProjectData | null,
  currentLogos: LogoData[] = []
): LogoData[] {
  let updatedLogos = [...currentLogos];
  const newBrandName = (project.client || project.title || "").trim().toUpperCase();
  const prevBrandName = prevProject ? (prevProject.client || prevProject.title || "").trim().toUpperCase() : "";

  if (project.logoUrl && newBrandName) {
    const existingIdx = updatedLogos.findIndex(
      (l) => l.name.toUpperCase() === newBrandName || (prevBrandName && l.name.toUpperCase() === prevBrandName)
    );
    if (existingIdx >= 0) {
      updatedLogos[existingIdx] = {
        ...updatedLogos[existingIdx],
        name: newBrandName,
        imageUrl: project.logoUrl,
      };
    } else {
      updatedLogos.push({
        name: newBrandName,
        imageUrl: project.logoUrl,
      });
    }
  } else if (prevBrandName && !project.logoUrl) {
    updatedLogos = updatedLogos.filter((l) => l.name.toUpperCase() !== prevBrandName);
  }

  return updatedLogos;
}

function removeProjectLogo(
  projectToDelete: ProjectData,
  currentLogos: LogoData[] = []
): LogoData[] {
  const brandName = (projectToDelete.client || projectToDelete.title || "").trim().toUpperCase();
  if (!brandName && !projectToDelete.logoUrl) return currentLogos;

  return currentLogos.filter((l) => {
    const lName = l.name.trim().toUpperCase();
    if (brandName && lName === brandName) return false;
    if (projectToDelete.logoUrl && l.imageUrl === projectToDelete.logoUrl) return false;
    return true;
  });
}

export default function WorkForm({ data, logosData = [], onChange, onStartEditing, disabled = false }: WorkFormProps) {
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const projectsList = data?.projects || [];
  const bookmarkedCount = projectsList.filter((p) => p.isBookmarked).length;

  const getProjectDateVal = (p: ProjectData) => {
    const end = (p.endDate || "").trim().toLowerCase();
    const start = (p.startDate || "").trim().toLowerCase();
    if (end.includes("present") || end.includes("current") || start.includes("present") || start.includes("current")) {
      return 999999;
    }
    const matches = `${end} ${start}`.match(/\b(19|20)\d{2}\b/g);
    if (matches && matches.length > 0) {
      return Math.max(...matches.map((y) => parseInt(y, 10)));
    }
    return 0;
  };

  const sortProjects = (list: ProjectData[]) => {
    return [...list].sort((a, b) => {
      const aBM = Boolean(a.isBookmarked);
      const bBM = Boolean(b.isBookmarked);
      if (aBM !== bBM) {
        return aBM ? -1 : 1;
      }
      const dateA = getProjectDateVal(a);
      const dateB = getProjectDateVal(b);
      if (dateA !== dateB) {
        return dateB - dateA;
      }
      return 0;
    });
  };

  const handleStartEdit = (index: number) => {
    if (onStartEditing) onStartEditing();
    setEditingProjectIndex(index);
  };

  const toggleBookmark = (index: number) => {
    const targetProject = projectsList[index];
    const currentlyBookmarked = Boolean(targetProject.isBookmarked);

    if (!currentlyBookmarked && bookmarkedCount >= 5) {
      setToastMsg("bookmark limit reached");
      setTimeout(() => setToastMsg(null), 4000);
      return;
    }

    if (onStartEditing) onStartEditing();

    const updatedList = projectsList.map((p, i) =>
      i === index ? { ...p, isBookmarked: !currentlyBookmarked } : p
    );

    const reorderedList = sortProjects(updatedList);
    onChange({ ...data, projects: reorderedList });
  };

  const handleSaveModal = (updatedProject: ProjectData) => {
    if (onStartEditing) onStartEditing();
    const list = [...projectsList];
    let prevProject: ProjectData | null = null;

    if (isCreatingNew) {
      list.push(updatedProject);
    } else if (editingProjectIndex !== null) {
      prevProject = projectsList[editingProjectIndex];
      const isBookmarked = updatedProject.isBookmarked !== undefined 
        ? updatedProject.isBookmarked 
        : prevProject?.isBookmarked;
      
      list[editingProjectIndex] = {
        ...updatedProject,
        isBookmarked: Boolean(isBookmarked)
      };
    }
    const reorderedList = sortProjects(list);
    const updatedLogos = syncProjectLogo(updatedProject, prevProject, logosData);
    onChange({ ...data, projects: reorderedList }, updatedLogos);
    setEditingProjectIndex(null);
    setIsCreatingNew(false);
  };

  const removeProject = (index: number) => {
    const projectToDelete = projectsList[index];
    const projectTitle = projectToDelete?.title || "this project";
    if (!window.confirm(`Are you sure you want to delete "${projectTitle}"?`)) {
      return;
    }
    if (onStartEditing) onStartEditing();
    const list = projectsList.filter((_, i) => i !== index);
    const updatedLogos = removeProjectLogo(projectToDelete, logosData);
    onChange({ ...data, projects: list }, updatedLogos);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Alert Message */}
      {toastMsg && (
        <div className="bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{toastMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="text-white/80 hover:text-white font-mono text-sm leading-none ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <span className="text-sm font-semibold text-neutral-500 font-mono flex items-center gap-2">
          Manage Projects ({projectsList.length})
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">
            {bookmarkedCount}/5 Bookmarked
          </span>
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
              className={`border rounded-xl p-5 flex items-center justify-between gap-4 relative group transition-all ${
                project.isBookmarked
                  ? "border-amber-300 bg-amber-50/40 shadow-sm"
                  : "border-neutral-200/80 bg-neutral-50/50"
              }`}
            >
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  {project.logoUrl && (
                    <img src={project.logoUrl} alt="Logo" className="h-6 w-auto object-contain" />
                  )}
                  <h4 className="text-base font-black uppercase text-foreground">
                    {project.title || "UNTITLED PROJECT"}
                  </h4>
                  {project.isBookmarked && (
                    <span className="text-[10px] font-mono font-bold bg-amber-500 text-white px-2 py-0.5 rounded uppercase flex items-center gap-1">
                      ★ BOOKMARKED
                    </span>
                  )}
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
                {/* Bookmark Icon Button */}
                <button
                  type="button"
                  onClick={() => toggleBookmark(index)}
                  className={`p-2.5 rounded-lg transition-all cursor-pointer shadow-sm border ${
                    project.isBookmarked
                      ? "bg-amber-500 border-amber-500 text-white hover:bg-amber-600"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-amber-400 hover:text-amber-500"
                  }`}
                  title={project.isBookmarked ? "Remove bookmark" : "Bookmark project to move to top"}
                  aria-label={project.isBookmarked ? "Remove bookmark" : "Bookmark project"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={project.isBookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>

                {/* Delete Icon Button */}
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-red-500 text-neutral-600 hover:text-red-600 transition-colors cursor-pointer shadow-sm"
                  title="Delete project"
                  aria-label="Delete project"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>

                {/* Edit Icon Button */}
                <button
                  type="button"
                  onClick={() => handleStartEdit(index)}
                  className="p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-brand text-neutral-600 hover:text-brand transition-colors cursor-pointer shadow-sm"
                  title="Edit project"
                  aria-label="Edit project"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
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

