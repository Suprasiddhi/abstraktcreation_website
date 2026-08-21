"use client";

import React, { useState, useEffect, useRef } from "react";

interface ProjectData {
  id?: string | number;
  title: string;
  subtitle: string;
  ratio?: string;
  category: string;
  serviceType?: string;
  logoUrl?: string;
  thumbnailUrl?: string;
  videoThumbnailUrl?: string;
  isBookmarked?: boolean;
  startDate?: string;
  endDate?: string;
  client?: string;
}

interface SelectedWorkProps {
  data?: {
    projects: ProjectData[];
  };
}

export default function SelectedWork({ data }: SelectedWorkProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Display top 5 projects
  const displayProjects = activeProjects.slice(0, 5);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = rect.height - windowHeight;
      if (totalDist <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalDist, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine active card index based on scroll progress (0 to 1)
  const totalCards = Math.max(displayProjects.length, 1);
  const activeIdx = Math.min(
    Math.floor(scrollProgress * totalCards),
    totalCards - 1
  );

  return (
    <section
      id="work"
      ref={sectionRef}
      className="w-full bg-black text-white relative scroll-mt-20 min-h-[300vh]"
    >
      {/* Sticky Inner Container - Starts after sticky header (72px) to bottom of screen */}
      <div className="sticky top-[72px] h-[calc(100vh-72px)] w-full flex items-stretch overflow-hidden">
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* LEFT SIDE: Fixed Text Info with padding */}
          <div className="lg:col-span-5 flex flex-col justify-center px-6 md:px-12 lg:pl-16 lg:pr-12 py-8 max-w-[680px] relative h-full">
            <h2 className="text-[52px] sm:text-[68px] md:text-[84px] lg:text-[96px] xl:text-[104px] font-black tracking-tighter text-white leading-[0.88] uppercase mb-6 select-none">
              SELECTED<br />WORK
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-md">
              Web solutions, brand design, video scoring, and conversion growth campaigns crafted for clients across Nepal and the US.
            </p>

            {/* Dynamic Progress counter */}
            <div className="mt-8 flex items-center gap-3 max-w-xs">
              <span className="text-xs font-mono font-bold text-brand bg-brand/10 border border-brand/20 px-3.5 py-1 rounded-none shrink-0">
                {String(activeIdx + 1).padStart(2, "0")} / {String(displayProjects.length).padStart(2, "0")}
              </span>
              <div className="flex-1 h-[2px] bg-neutral-800 rounded-none overflow-hidden">
                <div
                  className="h-full bg-brand transition-all duration-300"
                  style={{
                    width: `${((activeIdx + 1) / totalCards) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* View All Projects Button - Positioned Bottom Right of Left Column */}
            <div className="absolute bottom-8 right-6 md:right-10 lg:right-12 z-20">
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 bg-neutral-900/90 hover:bg-brand text-white hover:text-black border border-neutral-800 hover:border-brand text-xs font-mono font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-xl"
              >
                <span>View All Projects</span>
                <span className="text-brand group-hover:text-black transition-transform duration-300 group-hover:translate-x-1 font-mono text-sm">&rarr;</span>
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: Edge-to-Edge Cards (Full height right after header, 0 margin) */}
          <div className="lg:col-span-7 relative h-full w-full">
            {displayProjects.map((project, idx) => {
              // Calculate entry threshold for each card
              const step = 1 / totalCards;
              const cardStart = idx * step;
              const cardProgress = Math.min(
                Math.max((scrollProgress - cardStart) / step, 0),
                1
              );

              // Position calculations for card deck
              const isPast = idx < activeIdx;
              const isCurrent = idx === activeIdx;
              const isFuture = idx > activeIdx;

              // Stack offset for cards underneath
              const depthOffset = (activeIdx - idx) * 12;
              const scaleValue = 1 - Math.max(0, activeIdx - idx) * 0.03;

              let translateY = 0;
              let opacity = 1;

              if (isFuture) {
                // Card hasn't entered yet -> slide up from bottom
                translateY = (1 - cardProgress) * 120;
                opacity = cardProgress;
              } else if (isPast || isCurrent) {
                // Card is active or stacked behind active card
                translateY = -depthOffset;
                opacity = 1 - Math.max(0, activeIdx - idx) * 0.15;
              }

              const visualNode = project.videoThumbnailUrl ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden">
                  {project.videoThumbnailUrl.startsWith("data:video") ? (
                    <video
                      src={project.videoThumbnailUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <img
                      src={project.videoThumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
              ) : project.thumbnailUrl ? (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 overflow-hidden">
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ) : project.logoUrl ? (
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-neutral-950 group-hover:bg-neutral-900 transition-all duration-500">
                  <img
                    src={project.logoUrl}
                    alt={project.title}
                    className="h-28 md:h-36 w-auto max-w-[70%] object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-neutral-950">
                  <div className="text-center px-4">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 block mb-2 uppercase">
                      ABSTRAKT CREATIVE
                    </span>
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight">
                      {project.title}
                    </h4>
                  </div>
                </div>
              );

              return (
                <div
                  key={project.id || idx}
                  className="absolute inset-0 w-full h-full transition-all duration-500 ease-out flex items-stretch"
                  style={{
                    transform: `translateY(${translateY}px) scale(${scaleValue})`,
                    opacity: opacity,
                    zIndex: idx + 1,
                    pointerEvents: isCurrent ? "auto" : "none",
                  }}
                >
                  {/* Full Height Sharp Card - Starts top 0 after header, ends bottom 0 */}
                  <div className="w-full h-full bg-neutral-950 rounded-none overflow-hidden relative group shadow-2xl shadow-black">
                    
                    {/* Media Thumbnail background */}
                    {visualNode}

                    {/* Bottom Gradient & Info Overlay - Revealed on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-8 md:p-12 lg:p-14 flex flex-col justify-end z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <div className="flex flex-col gap-2 max-w-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        
                        {/* Project Type / Pillar Category Tag */}
                        {(project.category || project.serviceType) && (
                          <span className="text-xs font-mono font-bold tracking-[0.2em] text-brand uppercase mb-0.5">
                            {project.category || project.serviceType}
                          </span>
                        )}

                        {/* Project Title */}
                        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight group-hover:text-brand transition-colors duration-300 leading-none">
                          {project.title}
                        </h3>

                        {/* Subtitle */}
                        {project.subtitle && (
                          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed line-clamp-2 mt-1">
                            {project.subtitle}
                          </p>
                        )}

                        {/* Timeline & Client Metadata Row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-neutral-400 uppercase mt-2">
                          {(project.startDate || project.endDate) && (
                            <span>
                              TIMELINE: {project.startDate || "N/A"} {project.endDate ? `— ${project.endDate}` : ""}
                            </span>
                          )}
                          {project.client && (
                            <span>
                              • CLIENT: {project.client}
                            </span>
                          )}
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              );
            })}

            {displayProjects.length === 0 && (
              <div className="w-full h-full flex items-center justify-center bg-neutral-950">
                <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  No featured projects published yet
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}


