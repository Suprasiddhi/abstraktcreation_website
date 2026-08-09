import React from "react";

export default function LogoMarquee() {
  const logos = [
    {
      name: "VERTEX",
      icon: (
        <svg className="w-6 h-6 mr-2 text-neutral-400 group-hover:text-brand transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      ),
    },
    {
      name: "KINETIC",
      icon: (
        <svg className="w-6 h-6 mr-2 text-neutral-400 group-hover:text-brand transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      name: "APEX",
      icon: (
        <svg className="w-6 h-6 mr-2 text-neutral-400 group-hover:text-brand transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 22h20L12 2z" />
          <path d="M12 6l-6 11h12l-6-11z" />
        </svg>
      ),
    },
    {
      name: "SPECTRUM",
      icon: (
        <svg className="w-6 h-6 mr-2 text-neutral-400 group-hover:text-brand transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      name: "COSMOS",
      icon: (
        <svg className="w-6 h-6 mr-2 text-neutral-400 group-hover:text-brand transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <ellipse cx="12" cy="12" rx="9" ry="3" />
          <ellipse cx="12" cy="19" rx="9" ry="3" />
        </svg>
      ),
    },
    {
      name: "QUANTUM",
      icon: (
        <svg className="w-6 h-6 mr-2 text-neutral-400 group-hover:text-brand transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6v12M6 12h12" />
        </svg>
      ),
    },
    {
      name: "NEXUS",
      icon: (
        <svg className="w-6 h-6 mr-2 text-neutral-400 group-hover:text-brand transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
      ),
    },
    {
      name: "ELEVATE",
      icon: (
        <svg className="w-6 h-6 mr-2 text-neutral-400 group-hover:text-brand transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 11 12 6 7 11" />
          <polyline points="17 18 12 13 7 18" />
        </svg>
      ),
    },
  ];

  // Double the logos list to ensure perfect loops without screen gaps
  const doubledLogos = [...logos, ...logos, ...logos];

  return (
    <section className="w-full py-10 bg-card-bg/25 border-y border-neutral-200/50 overflow-hidden relative select-none">
      {/* Decorative gradient masks for fading edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Marquee scroll container */}
      <div className="flex w-full overflow-hidden">
        <div className="flex gap-16 md:gap-24 items-center animate-marquee whitespace-nowrap">
          {doubledLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex items-center justify-center group cursor-pointer transition-all duration-300"
            >
              {logo.icon}
              <span className="text-sm md:text-base font-black tracking-[0.25em] text-neutral-400 group-hover:text-foreground transition-colors duration-300">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
