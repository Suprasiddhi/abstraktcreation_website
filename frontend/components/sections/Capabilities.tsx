"use client";

import React, { useState } from "react";

type PillarKey = "digital" | "identity" | "campaign" | "creative";

interface Pillar {
  id: string;
  label: string;
  title: string;
  description: string;
  tag: string;
  badge: string;
}

export default function Capabilities() {
  const [activePillar, setActivePillar] = useState<PillarKey>("digital");

  const pillars: Record<PillarKey, Pillar> = {
    digital: {
      id: "01",
      label: "LEADING",
      title: "DIGITAL",
      description: "Web solutions — high-performance engineering and UI/UX systems, in the studio's own words.",
      tag: "Web Solutions",
      badge: "LEAD PILLAR — SWAPPABLE SLOT",
    },
    identity: {
      id: "02",
      label: "SHAPING",
      title: "IDENTITY",
      description: "Brand architecture — premium corporate design systems, bespoke typography, and art direction.",
      tag: "Brand Architecture",
      badge: "BRAND SYSTEM — SWAPPABLE SLOT",
    },
    campaign: {
      id: "03",
      label: "ENGAGING",
      title: "CAMPAIGN",
      description: "Creative storytelling — digital marketing, conversion funnel optimization, and content strategies.",
      tag: "Campaign Launch",
      badge: "MARKETING — SWAPPABLE SLOT",
    },
    creative: {
      id: "04",
      label: "EXPRESSING",
      title: "CREATIVE",
      description: "Multimedia assets — 3D modeling, premium video production, sound design, and motion graphics.",
      tag: "Motion & 3D",
      badge: "CREATIVE — SWAPPABLE SLOT",
    },
  };

  const active = pillars[activePillar];

  return (
    <section className="w-full py-20 px-6 md:px-12 bg-background">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200/60 pb-8 mb-10">
          <h2 className="text-[36px] sm:text-[46px] md:text-[54px] font-black tracking-tight text-foreground leading-none">
            CAPABILITIES
          </h2>
          <div className="text-[10px] md:text-xs font-mono tracking-[0.25em] text-neutral-400 font-semibold uppercase mt-4 md:mt-0 select-none">
            FOUR PILLARS • EIGHT SERVICES
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-6">
          {(Object.keys(pillars) as PillarKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActivePillar(key)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activePillar === key
                  ? "bg-brand text-white shadow-sm"
                  : "bg-neutral-200/50 text-neutral-500 hover:bg-neutral-200 hover:text-foreground"
              }`}
            >
              {pillars[key].id} {key}
            </button>
          ))}
        </div>

        {/* Main Sleek Dark Card */}
        <div className="w-full bg-neutral-950 text-white rounded-[24px] p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden transition-all duration-500">
          
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-900/40 via-transparent to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Side Content */}
            <div className="lg:col-span-6 flex flex-col items-start justify-center">
              {/* Category label */}
              <span className="text-[11px] md:text-xs font-mono font-bold tracking-[0.3em] text-brand mb-4 block uppercase">
                {active.id} — {active.label}
              </span>
              
              {/* Giant Title */}
              <h3 className="text-5xl sm:text-6xl md:text-[76px] font-black tracking-tight leading-none mb-6 text-white uppercase select-none">
                {active.title}
              </h3>
              
              {/* Description */}
              <p className="text-neutral-400 text-base md:text-lg mb-8 leading-relaxed max-w-md">
                {active.description}
              </p>
              
              {/* Sub-tag Button */}
              <button className="inline-flex items-center text-xs font-mono tracking-widest text-neutral-300 border border-neutral-800 rounded-full px-4 py-2 bg-neutral-900/40 hover:bg-brand hover:border-brand hover:text-white transition-all duration-300 cursor-pointer">
                {active.tag}
              </button>
            </div>

            {/* Right Side Mock Visualizer Sandbox */}
            <div className="lg:col-span-6 flex flex-col items-stretch">
              {/* Swappable Badge Label */}
              <div className="self-end mb-3">
                <span className="text-[9px] font-mono tracking-[0.18em] text-neutral-500 border border-neutral-800 rounded px-2.5 py-1 bg-neutral-900/20">
                  {active.badge}
                </span>
              </div>

              {/* Aspect Ratio Box */}
              <div className="aspect-[16/9] w-full rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-center relative overflow-hidden group shadow-inner">
                
                {/* 1. DIGITAL Interactive Graphic */}
                {activePillar === "digital" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    {/* Simulated Wireframe Visuals */}
                    <div className="w-full max-w-xs border border-neutral-700/60 rounded-lg p-3 bg-neutral-950/80 flex flex-col gap-2 transition-transform duration-500 group-hover:scale-105">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                        <div className="w-8 h-2 bg-brand rounded" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-neutral-700" />
                          <div className="w-2 h-2 rounded-full bg-neutral-700" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1">
                        <div className="h-10 border border-dashed border-neutral-800 rounded flex items-center justify-center"><div className="w-4 h-4 rounded-full border border-neutral-700" /></div>
                        <div className="h-10 border border-dashed border-neutral-800 rounded flex items-center justify-center"><div className="w-4 h-4 rounded-full border border-neutral-700" /></div>
                        <div className="h-10 border border-dashed border-neutral-800 rounded flex items-center justify-center"><div className="w-4 h-4 rounded-full border border-neutral-700" /></div>
                      </div>
                      <div className="w-full h-8 bg-neutral-900 rounded border border-neutral-800 flex items-center justify-center"><span className="text-[8px] font-mono text-neutral-500">BUTTON_TRIGGER</span></div>
                    </div>
                  </div>
                )}

                {/* 2. IDENTITY Interactive Graphic */}
                {activePillar === "identity" && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    {/* Geometric Grid construction */}
                    <div className="w-44 h-44 relative border border-dashed border-neutral-800 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-700">
                      <div className="absolute inset-4 border border-dashed border-neutral-700/50 rounded-full" />
                      <div className="absolute inset-0 w-full h-[1px] bg-neutral-800/80" />
                      <div className="absolute inset-0 h-full w-[1px] bg-neutral-800/80" />
                      <div className="w-16 h-16 border-2 border-brand flex items-center justify-center text-xs font-mono font-bold">
                        A
                      </div>
                      <div className="absolute top-2 right-2 text-[8px] font-mono text-neutral-600">R: 88px</div>
                    </div>
                  </div>
                )}

                {/* 3. CAMPAIGN Interactive Graphic */}
                {activePillar === "campaign" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    {/* Animated Analytics chart simulation */}
                    <div className="w-full max-w-xs flex flex-col gap-2 bg-neutral-950/50 p-4 border border-neutral-800 rounded-lg">
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                        <span>CONVERSIONS</span>
                        <span className="text-emerald-400 font-bold">+28.4%</span>
                      </div>
                      <svg className="w-full h-16 text-brand" viewBox="0 0 100 30" fill="none">
                        <path d="M0,25 Q15,10 30,22 T60,5 T90,12 T100,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M0,25 Q15,10 30,22 T60,5 T90,12 T100,2 L100,30 L0,30 Z" fill="currentColor" fillOpacity="0.08" />
                        <circle cx="60" cy="5" r="3" className="fill-brand animate-ping" />
                        <circle cx="60" cy="5" r="2.5" className="fill-brand" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* 4. CREATIVE Interactive Graphic */}
                {activePillar === "creative" && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    {/* 3D mesh block concept */}
                    <div className="relative w-28 h-28 border border-neutral-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute -top-3 -left-3 w-3 h-3 bg-neutral-800 border border-neutral-600" />
                      <div className="absolute -top-3 -right-3 w-3 h-3 bg-neutral-800 border border-neutral-600" />
                      <div className="absolute -bottom-3 -left-3 w-3 h-3 bg-neutral-800 border border-neutral-600" />
                      <div className="absolute -bottom-3 -right-3 w-3 h-3 bg-neutral-800 border border-neutral-600" />
                      <span className="text-[10px] font-mono text-brand font-bold uppercase tracking-widest animate-pulse">RENDER</span>
                    </div>
                  </div>
                )}

                {/* Constant watermark centering text */}
                <div className="absolute bottom-4 left-0 right-0 text-center select-none z-10 pointer-events-none opacity-40">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-500 uppercase">
                    16:9 • PROJECT PREVIEW
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
