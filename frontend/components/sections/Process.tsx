"use client";

import React, { useState } from "react";

interface Step {
  id: string;
  title: string;
  description: string;
}

interface ProcessProps {
  data?: {
    steps: Step[];
  };
}

export default function Process({ data }: ProcessProps) {
  const [activeStep, setActiveStep] = useState<string>("01");

  const steps = data?.steps || [];

  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-background border-b border-neutral-200/60">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16 md:gap-20">
        
        {/* HOW IT RUNS grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Heading */}
          <div className="lg:col-span-3 flex flex-col justify-start">
            <span className="font-mono text-xs md:text-sm text-neutral-400 tracking-widest font-semibold uppercase mb-4 block">
              (04) PROCESS
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[46px] font-black tracking-tight text-foreground uppercase leading-none">
              HOW IT<br />RUNS
            </h2>
          </div>

          {/* Right Column: Process Steps Grid */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className="flex flex-col pt-4 border-t-2 relative cursor-pointer transition-all duration-300 select-none group"
                  style={{
                    borderColor: isActive ? "var(--brand)" : "rgba(229, 229, 229, 0.8)",
                  }}
                >
                  {/* Step ID */}
                  <span
                    className={`font-mono text-xs font-bold tracking-wider mb-3 transition-colors duration-300 ${
                      isActive ? "text-brand" : "text-neutral-400"
                    }`}
                  >
                    {step.id}
                  </span>
                  
                  {/* Step Title */}
                  <h3
                    className={`text-lg md:text-xl font-bold tracking-tight mb-3 transition-colors duration-300 ${
                      isActive ? "text-foreground" : "text-neutral-400 group-hover:text-neutral-600"
                    }`}
                  >
                    {step.title}
                  </h3>
                  
                  {/* Step Description */}
                  <p
                    className={`text-[13px] md:text-sm leading-relaxed transition-colors duration-300 ${
                      isActive ? "text-neutral-600" : "text-neutral-400 group-hover:text-neutral-500"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conditional Slot Box */}
        <div 
          className="w-full rounded-2xl border border-dashed border-neutral-300 p-6 md:p-8 flex flex-col gap-4 relative overflow-hidden select-none"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212, 212, 212, 0.15) 10px, rgba(212, 212, 212, 0.15) 20px)",
          }}
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-10">
            <span className="text-[10px] md:text-xs font-mono font-bold tracking-[0.2em] text-brand uppercase">
              CONDITIONAL SLOT — RENDERS ONLY WHEN THE CONTENT IS REAL
            </span>
            <span className="text-[9px] md:text-[10px] font-mono tracking-[0.25em] text-neutral-400 font-semibold uppercase">
              TESTIMONIAL • STATS • AWARDS
            </span>
          </div>

          {/* Body Text */}
          <p className="text-xs md:text-[13px] leading-relaxed text-neutral-500 max-w-5xl z-10">
            Carried over from the previous board and still the right call. Nothing renders here until there is a named quote, four defensible numbers, or three real listings.
          </p>
        </div>

      </div>
    </section>
  );
}
