"use client";

import React from "react";

interface LogoItem {
  id?: number;
  name: string;
  imageUrl: string;
}

interface LogoMarqueeProps {
  data?: LogoItem[];
}

export default function LogoMarquee({ data }: LogoMarqueeProps) {
  const logos = data || [];
  if (logos.length === 0) return null;

  // Triple the logos to ensure seamless loop without gaps
  const tripled = [...logos, ...logos, ...logos];

  return (
    <section className="w-full py-10 bg-card-bg/25 border-y border-neutral-200/50 overflow-hidden relative select-none">
      {/* Decorative gradient masks for fading edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Marquee scroll container */}
      <div className="flex w-full overflow-hidden">
        <div className="flex gap-16 md:gap-24 items-center animate-marquee whitespace-nowrap">
          {tripled.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex items-center justify-center group cursor-pointer transition-all duration-300 gap-2.5"
            >
              {logo.imageUrl ? (
                <img
                  src={logo.imageUrl}
                  alt={logo.name}
                  className="h-12 md:h-14 w-auto object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                />
              ) : (
                <span className="text-sm md:text-base font-black tracking-[0.25em] text-neutral-400 group-hover:text-foreground transition-colors duration-300">
                  {logo.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
