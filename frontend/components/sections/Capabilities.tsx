"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

interface Pillar {
  id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  label?: string;
  tag?: string;
  badge?: string;
}

interface CapabilitiesProps {
  data?: {
    pillars?: Record<string, Pillar> | Pillar[];
  };
}

export default function Capabilities({ data }: CapabilitiesProps) {
  const rawPillars = data?.pillars;
  const servicesList: Pillar[] = rawPillars
    ? Array.isArray(rawPillars)
      ? rawPillars
      : Object.values(rawPillars)
    : [];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [servicesList]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="capabilities" className="w-full py-20 bg-background scroll-mt-24 overflow-hidden">
      {/* Section Header (Constrained to max-w-[1400px] to match site layout) */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="border-b border-neutral-200/60 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-[36px] sm:text-[46px] md:text-[54px] font-black tracking-tight text-foreground leading-none uppercase">
              SERVICE
            </h2>
            <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 font-semibold uppercase mt-2 block">
              OUR EXPERTISE &amp; OFFERINGS
            </span>
          </div>
          <Link
            href="/service"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-300 hover:border-brand text-foreground hover:text-white bg-transparent hover:bg-brand text-xs font-mono font-bold uppercase transition-all duration-300 shadow-sm cursor-pointer"
          >
            VIEW ALL +
          </Link>
        </div>
      </div>

      {/* Services Full-Bleed Edge-to-Edge Carousel */}
      {servicesList.length > 0 ? (
        <div className="w-full relative group/carousel mt-12">
          {/* Left Navigation Arrow */}
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll services left"
            className={`absolute left-2 sm:left-4 md:left-6 xl:left-[calc(max(16px,(100vw-1400px)/2))] top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/90 backdrop-blur-md border border-neutral-700/80 text-white flex items-center justify-center transition-all duration-300 shadow-2xl ${
              canScrollLeft
                ? "opacity-100 hover:bg-brand hover:text-black hover:border-brand hover:scale-110 cursor-pointer active:scale-95"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Right Navigation Arrow */}
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll services right"
            className={`absolute right-2 sm:right-4 md:right-6 xl:right-[calc(max(16px,(100vw-1400px)/2))] top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/90 backdrop-blur-md border border-neutral-700/80 text-white flex items-center justify-center transition-all duration-300 shadow-2xl ${
              canScrollRight
                ? "opacity-100 hover:bg-brand hover:text-black hover:border-brand hover:scale-110 cursor-pointer active:scale-95"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Single Row Horizontal Cards Container (Full-bleed across viewport with generous side padding) */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-6 md:gap-8 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory select-none scrollbar-none px-8 sm:px-16 md:px-24 xl:px-[calc(max(64px,(100vw-1400px)/2+48px))]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {servicesList.map((service, idx) => {
              const displayNum = service.id || String(idx + 1).padStart(2, "0");
              return (
                <div
                  key={service.id || idx}
                  className="group relative w-[300px] sm:w-[360px] md:w-[410px] shrink-0 min-h-[380px] sm:min-h-[420px] rounded-3xl overflow-hidden border border-neutral-800 hover:border-brand/70 transition-all duration-500 flex flex-col justify-between p-8 shadow-2xl hover:shadow-brand/10 hover:-translate-y-2 cursor-pointer snap-start"
                >
                  {/* Background Image / Gradient */}
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black group-hover:scale-105 transition-transform duration-700 ease-out" />
                  )}

                  {/* Dark Gradient Overlay for optimal readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30 group-hover:from-black/90 transition-opacity duration-500 pointer-events-none" />

                  {/* Top Badge Row */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-black/60 backdrop-blur-md border border-neutral-700/60 text-brand text-xs font-mono font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                      {displayNum}
                    </span>
                  </div>

                  {/* Bottom Info Row (Title over background) */}
                  <div className="relative z-10 flex flex-col justify-end gap-2.5 pt-12">
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase group-hover:text-brand transition-colors duration-300 leading-tight">
                      {service.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-12">
          <div className="w-full py-16 px-6 rounded-2xl border border-dashed border-neutral-300 text-center bg-neutral-50/50">
            <p className="text-sm font-mono text-neutral-400 uppercase tracking-wider">
              No services added yet. Add new services from the administrative control panel.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

