"use client";

import React from "react";

interface MemberData {
  name: string;
  role: string;
}

interface PeopleProps {
  data?: {
    team: MemberData[];
    extraCount: number;
  };
}

export default function People({ data }: PeopleProps) {
  const defaultAvatar = (
    <svg className="w-20 h-20 text-neutral-400 group-hover:text-brand transition-colors duration-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="50" cy="40" r="18" />
      <path d="M22 82c0-15.46 12.54-28 28-28s28 12.54 28 28" strokeLinecap="round" />
    </svg>
  );

  const team = data?.team || [];
  const extraCount = data?.extraCount !== undefined ? data.extraCount : 0;

  return (
    <section id="studio" className="w-full py-20 px-6 md:px-12 bg-background border-b border-neutral-200/60 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        
        {/* Header Block */}
        <div className="flex items-end justify-between border-b border-neutral-200/60 pb-8">
          <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-black tracking-tight text-foreground leading-none uppercase">
            THE PEOPLE
          </h2>
          <a
            href="#studio"
            className="group flex items-center text-xs md:text-sm font-semibold text-neutral-500 hover:text-brand transition-colors duration-300 relative py-1"
          >
            Meet the studio &rarr;
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-transparent group-hover:bg-brand transition-colors duration-300" />
          </a>
        </div>

        {/* 5-Column Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {/* Team Members */}
          {team.map((member, idx) => {
            return (
              <div key={idx} className="flex flex-col group cursor-pointer">
                {/* Profile Card Container - 3:4 aspect ratio */}
                <div className="w-full aspect-[3/4] rounded-2xl bg-card-bg border border-neutral-300/40 flex items-center justify-center relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:scale-[1.02] mb-4">
                  <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-brand/5 transition-all duration-500 pointer-events-none" />
                  {defaultAvatar}
                  <span className="absolute bottom-4 left-4 text-[9px] font-mono tracking-widest text-neutral-400 select-none pointer-events-none group-hover:text-neutral-500">
                    3:4 • ROSTER
                  </span>
                </div>
                
                {/* Profile details */}
                <h3 className="text-base font-bold text-foreground leading-tight">
                  {member.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {member.role}
                </p>
              </div>
            );
          })}

          {/* Card 5: Full Roster (dashed) */}
          <div className="flex flex-col group cursor-pointer">
            {/* Dashed Profile Card Container - 3:4 aspect ratio */}
            <div className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-neutral-300 hover:border-brand flex items-center justify-center relative overflow-hidden transition-all duration-500 hover:shadow-md hover:scale-[1.02] mb-4 bg-transparent">
              <div className="text-3xl font-black text-neutral-400 group-hover:text-brand transition-colors duration-500">
                +{extraCount}
              </div>
              <span className="absolute bottom-4 left-4 text-[9px] font-mono tracking-widest text-neutral-400 select-none pointer-events-none group-hover:text-brand/60">
                3:4 • ROSTER
              </span>
            </div>
            
            {/* Details */}
            <h3 className="text-base font-bold text-foreground leading-tight group-hover:text-brand transition-colors duration-300">
              Full roster
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              on Studio
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
