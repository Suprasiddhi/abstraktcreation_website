"use client";

import React, { useState, useEffect } from "react";
import Button from "../ui/Button";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"design" | "build" | "grow">("design");
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; speed: number }[]>([]);
  const [clickCount, setClickCount] = useState(0);

  // Generate some random floating particles for the interactive canvas
  useEffect(() => {
    const tempParticles = Array.from({ length: 15 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.5 + 0.2,
    }));
    setParticles(tempParticles);

    // Animating the particles subtly
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          y: p.y - p.speed < 0 ? 100 : p.y - p.speed,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Heading, Subheading & CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          {/* Location Badge */}
          <span 
            className="text-[11px] md:text-xs font-semibold tracking-[0.25em] text-brand mb-6 block uppercase"
            style={{ color: "var(--brand)" }}
          >
            SANEPA, NEPAL — DALLAS, TX
          </span>

          {/* Large Headline */}
          <h1 className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[110px] font-black tracking-tight leading-[0.9] text-foreground mb-8 select-none">
            <span className="block hover:text-brand transition-colors duration-300">DESIGN.</span>
            <span className="block hover:text-brand transition-colors duration-300">BUILD.</span>
            <span className="block hover:text-brand transition-colors duration-300">GROW.</span>
          </h1>

          {/* Paragraph Description */}
          <p className="text-lg md:text-xl text-neutral-600 max-w-lg mb-10 leading-relaxed">
            From web solutions and digital marketing to video, music, 3D and graphic design.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">
              See the work
            </Button>
            <Button variant="secondary">
              What we do
            </Button>
          </div>
        </div>

        {/* Right Column: Provisional Copy Badge & Interactive Canvas */}
        <div className="lg:col-span-5 flex flex-col items-stretch lg:items-end">
          {/* Provisional Copy Badge */}
          <div className="mb-6 lg:mb-12 self-end">
            <span className="border border-brand/60 text-brand text-[10px] font-mono tracking-[0.2em] px-3 py-[6px] rounded uppercase font-semibold">
              PROVISIONAL COPY
            </span>
          </div>

          {/* Interactive Card Container */}
          <div className="w-full flex flex-col items-stretch">
            {/* The Working Interface Sandbox */}
            <div 
              className="relative aspect-[4/3] w-full rounded-2xl bg-card-bg flex flex-col justify-between p-6 overflow-hidden border border-neutral-300/40 shadow-inner group cursor-pointer transition-all duration-300 hover:shadow-md"
              onClick={() => setClickCount(c => c + 1)}
            >
              {/* Interactive background particle layer */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                {particles.map((p, idx) => (
                  <div
                    key={idx}
                    className="absolute bg-brand/30 rounded-full transition-all duration-500"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                    }}
                  />
                ))}
              </div>

              {/* Top Bar of the Mock Interface */}
              <div className="flex justify-between items-center z-10 w-full">
                {/* Simulated Tab Switches */}
                <div className="flex gap-2 bg-neutral-300/40 p-[3px] rounded-lg">
                  {(["design", "build", "grow"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(tab);
                      }}
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md transition-all duration-200 cursor-pointer ${
                        activeTab === tab 
                          ? "bg-white text-foreground shadow-sm" 
                          : "text-neutral-500 hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {/* Click counter badge */}
                <div className="text-[10px] bg-brand text-white font-mono px-2 py-[2px] rounded-full">
                  CLICKS: {clickCount}
                </div>
              </div>

              {/* Middle Section: Centered Label */}
              <div className="flex flex-col items-center justify-center text-center z-10 py-8 select-none">
                {/* Visual indicator that responds to tab */}
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-400 flex items-center justify-center mb-4 animate-spin-slow group-hover:scale-110 transition-transform duration-300">
                  <div className={`w-10 h-10 rounded-full transition-all duration-500 ${
                    activeTab === "design" ? "bg-brand scale-75" : 
                    activeTab === "build" ? "bg-neutral-800 rotate-45 rounded-none" : 
                    "bg-brand-muted scale-90"
                  }`} />
                </div>
                
                <span className="text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase">
                  LIVE SITE OR PRODUCT
                </span>
                <span className="text-[10px] font-medium tracking-[0.15em] text-neutral-400 uppercase mt-1">
                  NOT A SHOWREEL
                </span>
              </div>

              {/* Bottom Bar: Instructions / State info */}
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 z-10 border-t border-neutral-300/40 pt-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  STATUS: INTERACTIVE
                </span>
                <span>MODE: {activeTab.toUpperCase()}</span>
              </div>
            </div>

            {/* Description Text Under the Card Box */}
            <p className="mt-4 text-[12px] md:text-[13px] text-neutral-500 leading-relaxed text-left lg:text-left self-start max-w-sm">
              Hero media is a working interface, not a video. Autoplay interaction, not footage.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
