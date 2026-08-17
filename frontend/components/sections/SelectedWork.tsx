"use client";

import React from "react";

interface ProjectData {
  id?: string;
  title: string;
  subtitle: string;
  ratio: string;
  category: string;
  logoUrl?: string;
  thumbnailUrl?: string;
  videoThumbnailUrl?: string;
  isBookmarked?: boolean;
  startDate?: string;
  endDate?: string;
}

interface SelectedWorkProps {
  data?: {
    projects: ProjectData[];
  };
}

export default function SelectedWork({ data }: SelectedWorkProps) {
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

  const activeProjects = [...(data?.projects || [])].sort((a, b) => {
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
  // Restrict display to a maximum of 5 projects
  const displayProjects = activeProjects.slice(0, 5);

  // Helper card component
  const ProjectCard = ({ project }: { project: any }) => {
    const visualNode = project.videoThumbnailUrl ? (
      <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden">
        {project.videoThumbnailUrl.startsWith("data:video") ? (
          <video src={project.videoThumbnailUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={project.videoThumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
        )}
      </div>
    ) : project.thumbnailUrl ? (
      <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 overflow-hidden">
        <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
      </div>
    ) : project.logoUrl ? (
      <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-neutral-200 to-neutral-100 group-hover:from-neutral-300 group-hover:to-neutral-200 transition-all duration-500">
        <img src={project.logoUrl} alt={project.title} className="h-16 w-auto max-w-[80%] object-contain" />
      </div>
    ) : (
      <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-neutral-200 to-neutral-100 group-hover:from-neutral-300 group-hover:to-neutral-200 transition-all duration-500">
        <div className="text-center px-4">
          <span className="text-[9px] font-mono tracking-widest text-neutral-400 block mb-1">ABSTRAKT CREATIVE</span>
          <h4 className="text-sm font-black text-neutral-800 uppercase tracking-tight">{project.title}</h4>
          {project.category && (
            <span className="inline-block mt-2 text-[9px] bg-neutral-300/50 text-neutral-600 px-2 py-0.5 rounded-full font-mono font-semibold">
              {project.category}
            </span>
          )}
        </div>
      </div>
    );

    return (
      <div className="w-full flex flex-col group cursor-pointer">
        <div
          className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-card-bg border border-neutral-300/40 transition-all duration-500 hover:shadow-xl hover:scale-[1.02]"
        >
          {visualNode}

          {/* Dynamic Overlay Info on Hover */}
          <div className="absolute inset-0 bg-neutral-950/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 z-20">
            {project.category && (
              <span className="text-[10px] font-mono tracking-widest text-brand mb-1 uppercase font-bold">
                {project.category}
              </span>
            )}
            <h4 className="text-base font-black text-white tracking-tight uppercase leading-snug">
              {project.title}
            </h4>
            {project.subtitle && (
              <p className="text-neutral-400 text-xs mt-1 leading-normal line-clamp-2">
                {project.subtitle}
              </p>
            )}
            {(project.startDate || project.endDate) && (
              <span className="text-[10px] font-mono tracking-widest text-neutral-300 mt-1.5 uppercase font-semibold">
                Timeline: {project.startDate || "N/A"} {project.endDate ? `— ${project.endDate}` : ""}
              </span>
            )}
          </div>

          {/* Bottom Watermark Label */}
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none select-none group-hover:opacity-0 transition-opacity duration-200 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">
            <span className="text-[9px] font-mono tracking-widest text-neutral-200 uppercase font-semibold">
              {project.category || "PROJECT"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-col">
          <h4 className="text-sm font-bold uppercase text-foreground group-hover:text-brand transition-colors">
            {project.title}
          </h4>
          {project.subtitle && (
            <p className="text-xs text-neutral-500 truncate mt-0.5">{project.subtitle}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="work" className="w-full py-20 px-6 md:px-12 bg-background border-b border-neutral-200/60 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200/60 pb-8 mb-10">
          <div>
            <span className="text-[11px] md:text-xs font-mono font-bold tracking-[0.25em] text-brand mb-2 uppercase block">
              {displayProjects.length} OF {activeProjects.length} PROJECTS
            </span>
            <h2 className="text-[36px] sm:text-[46px] md:text-[52px] font-black tracking-tight text-foreground leading-none uppercase">
              SELECTED WORK
            </h2>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed mt-2 max-w-xl">
              Sites, identities, campaigns and content for brands across Nepal and the US.
            </p>
          </div>

          <div className="text-[10px] md:text-xs font-mono tracking-[0.25em] text-neutral-400 font-semibold uppercase mt-4 md:mt-0 select-none">
            5-COLUMN GRID • FEATURED PROJECTS
          </div>
        </div>

        {/* 5-Column Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start">
          {displayProjects.map((p, idx) => (
            <ProjectCard key={p.id || idx} project={p} />
          ))}
        </div>

        {displayProjects.length === 0 && (
          <div className="py-16 text-center border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
            <p className="text-sm font-mono text-neutral-400 uppercase tracking-wider">
              No featured projects published yet
            </p>
          </div>
        )}

        {/* Centered Footer CTA Link */}
        <div className="w-full flex justify-center mt-14">
          <a
            href="#projects"
            className="group inline-flex items-center text-sm md:text-base font-semibold tracking-wider text-foreground hover:text-brand transition-colors duration-300 relative py-1"
          >
            View all projects &rarr;
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-foreground group-hover:bg-brand transition-colors duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
