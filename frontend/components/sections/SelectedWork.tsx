"use client";

import React from "react";

interface Project {
  title: string;
  subtitle: string;
  ratio: string;
  category: string;
  visual: React.ReactNode;
}

export default function SelectedWork() {
  const projects: Project[] = [
    // Column 1
    {
      title: "COSMOS AUDIO",
      subtitle: "3D soundscapes & motion scoring",
      ratio: "3:4",
      category: "CREATIVE",
      visual: (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-tr from-neutral-200 to-neutral-100 group-hover:from-neutral-300 group-hover:to-neutral-200 transition-all duration-500">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Visualizer bars */}
            <div className="flex items-end gap-1.5 h-16">
              <div className="w-1.5 h-8 bg-brand rounded-full animate-pulse" />
              <div className="w-1.5 h-14 bg-brand rounded-full animate-pulse delay-75" />
              <div className="w-1.5 h-10 bg-brand rounded-full animate-pulse delay-150" />
              <div className="w-1.5 h-16 bg-brand rounded-full animate-pulse delay-200" />
              <div className="w-1.5 h-6 bg-brand rounded-full animate-pulse delay-100" />
            </div>
          </div>
        </div>
      ),
    },
    // Column 2
    {
      title: "VERTEX PORTAL",
      subtitle: "Web3 finance interface & systems",
      ratio: "2:3",
      category: "DIGITAL",
      visual: (
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-b from-neutral-100 to-neutral-200 group-hover:from-neutral-200 group-hover:to-neutral-300 transition-all duration-500">
          <div className="w-full h-3/4 border border-dashed border-neutral-400 rounded-t-xl bg-white/40 backdrop-blur-sm p-4 flex flex-col gap-2 transform translate-y-4 group-hover:translate-y-2 transition-all duration-500">
            <div className="flex gap-1.5 border-b border-neutral-300/60 pb-2">
              <div className="w-2 h-2 rounded-full bg-neutral-400" />
              <div className="w-2 h-2 rounded-full bg-neutral-400" />
              <div className="w-2 h-2 rounded-full bg-neutral-400" />
            </div>
            <div className="w-3/4 h-3 bg-neutral-300 rounded" />
            <div className="w-1/2 h-3 bg-neutral-300 rounded" />
            <div className="w-full h-16 border border-neutral-300/40 rounded bg-neutral-200/20 mt-2" />
          </div>
        </div>
      ),
    },
    {
      title: "KINETIC ENGINE",
      subtitle: "Conversion growth systems",
      ratio: "4:3",
      category: "GROWTH",
      visual: (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-neutral-200 to-neutral-100 group-hover:from-neutral-300 group-hover:to-neutral-200 transition-all duration-500">
          <div className="w-full max-w-xs flex items-end justify-between h-20 px-4 border-b border-neutral-300">
            <div className="w-6 bg-brand-muted/40 h-8 rounded-t group-hover:bg-brand transition-all duration-300" />
            <div className="w-6 bg-brand-muted/40 h-12 rounded-t group-hover:bg-brand transition-all duration-300 delay-75" />
            <div className="w-6 bg-brand-muted/40 h-6 rounded-t group-hover:bg-brand transition-all duration-300 delay-100" />
            <div className="w-6 bg-brand-muted/40 h-16 rounded-t group-hover:bg-brand transition-all duration-300 delay-150" />
            <div className="w-6 bg-brand/80 h-20 rounded-t group-hover:bg-brand transition-all duration-500 delay-200" />
          </div>
        </div>
      ),
    },
    // Column 3
    {
      title: "APEX IDENTITY",
      subtitle: "Corporate brand guidelines",
      ratio: "16:10",
      category: "DESIGN",
      visual: (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-tr from-neutral-100 to-neutral-200 group-hover:from-neutral-200 group-hover:to-neutral-300 transition-all duration-500">
          <div className="flex flex-col items-center gap-1">
            <div className="text-4xl font-extrabold tracking-widest text-neutral-800">Aa</div>
            <div className="text-[10px] font-mono tracking-widest text-neutral-400">GT ULTRA / SLAB SANS</div>
          </div>
        </div>
      ),
    },
    {
      title: "NEXUS MOBILE",
      subtitle: "Cross-platform core application",
      ratio: "2:3",
      category: "DIGITAL",
      visual: (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-bl from-neutral-200 to-neutral-100 group-hover:from-neutral-300 group-hover:to-neutral-200 transition-all duration-500">
          <div className="w-36 h-56 border-4 border-neutral-800 rounded-[28px] bg-white/70 shadow-lg p-3 flex flex-col gap-2 transform translate-y-6 group-hover:translate-y-3 transition-transform duration-500">
            <div className="w-12 h-2.5 bg-neutral-800 rounded-full mx-auto mb-1" />
            <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-[10px] text-brand font-bold">N</div>
            <div className="w-full h-2 bg-neutral-300 rounded" />
            <div className="w-5/6 h-2 bg-neutral-300 rounded" />
            <div className="w-full h-20 border border-neutral-200 rounded bg-neutral-50" />
          </div>
        </div>
      ),
    },
  ];

  // Helper card component to keep render dry
  const ProjectCard = ({ project }: { project: Project }) => (
    <div className="w-full flex flex-col group cursor-pointer">
      {/* Aspect Ratio Outer Box */}
      <div 
        className={`relative w-full rounded-2xl overflow-hidden bg-card-bg border border-neutral-300/40 transition-all duration-500 hover:shadow-lg`}
        style={{
          aspectRatio: project.ratio.replace(":", " / "),
        }}
      >
        {/* Visual Component Render */}
        {project.visual}

        {/* Dynamic Overlay Info on Hover */}
        <div className="absolute inset-0 bg-neutral-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-20">
          <span className="text-[10px] font-mono tracking-widest text-brand mb-1 uppercase font-bold">
            {project.category}
          </span>
          <h4 className="text-lg font-black text-white tracking-tight uppercase">
            {project.title}
          </h4>
          <p className="text-neutral-400 text-xs mt-1">
            {project.subtitle}
          </p>
        </div>

        {/* Static Watermark Label (Bottom Left, visible by default, hidden on hover overlay) */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none select-none group-hover:opacity-0 transition-opacity duration-200">
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-semibold">
            {project.ratio} • {project.category}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full py-20 px-6 md:px-12 bg-background border-b border-neutral-200/60">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200/60 pb-8 mb-12">
          <h2 className="text-[36px] sm:text-[46px] md:text-[54px] font-black tracking-tight text-foreground leading-none">
            SELECTED WORK
          </h2>
          <div className="text-[10px] md:text-xs font-mono tracking-[0.25em] text-neutral-400 font-semibold uppercase mt-4 md:mt-0 select-none">
            TAGGED BY PILLAR, NOT FILTERED
          </div>
        </div>

        {/* Portfolio Staggered Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            {/* Text description block (stands in place of top slot) */}
            <div className="w-full py-8 pr-4 flex flex-col items-start justify-center">
              <span className="text-[11px] md:text-xs font-mono font-bold tracking-[0.25em] text-brand mb-3 uppercase">
                18 PROJECTS
              </span>
              <h3 className="text-3xl font-black tracking-tight text-foreground uppercase mb-4 leading-none">
                WHAT WE<br />HAVE MADE
              </h3>
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed">
                Sites, identities, campaigns and content for brands across Nepal and the US.
              </p>
            </div>
            
            {/* Project: 3:4 CREATIVE */}
            <ProjectCard project={projects[0]} />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            {/* Project: 2:3 DIGITAL */}
            <ProjectCard project={projects[1]} />
            
            {/* Project: 4:3 GROWTH */}
            <ProjectCard project={projects[2]} />
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            {/* Project: 16:10 DESIGN */}
            <ProjectCard project={projects[3]} />
            
            {/* Project: 2:3 DIGITAL */}
            <ProjectCard project={projects[4]} />
          </div>

        </div>

        {/* Centered Footer CTA Link */}
        <div className="w-full flex justify-center mt-16">
          <a
            href="#projects"
            className="group inline-flex items-center text-sm md:text-base font-semibold tracking-wider text-foreground hover:text-brand transition-colors duration-300 relative py-1"
          >
            View all 18 projects &rarr;
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-foreground group-hover:bg-brand transition-colors duration-300" />
          </a>
        </div>

      </div>
    </section>
  );
}
