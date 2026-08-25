"use client";

import React from "react";
import Link from "next/link";

export interface SocialItem {
  platform: "insta" | "linkedin" | "github";
  url: string;
}

interface MemberData {
  name: string;
  role: string;
  description?: string;
  avatarUrl?: string;
  originalAvatarUrl?: string;
  socials?: SocialItem[];
  socialPlatform?: "insta" | "linkedin" | "github";
  socialUrl?: string;
}

interface PeopleProps {
  data?: {
    team: MemberData[];
    extraCount?: number;
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
    <section
      id="studio"
      className="w-full min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-90px)] flex flex-col justify-center py-12 md:py-16 lg:py-20 px-6 md:px-12 bg-background scroll-mt-24"
    >
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-10 md:gap-12">
        
        {/* Header Block */}
        <div className="flex items-end justify-between border-b border-neutral-200/60 pb-8">
          <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-black tracking-tight text-foreground leading-none uppercase">
            THE PEOPLE
          </h2>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-300 hover:border-brand text-foreground hover:text-white bg-transparent hover:bg-brand text-xs font-mono font-bold uppercase transition-all duration-300 shadow-sm cursor-pointer"
          >
            VIEW ALL +
          </Link>
        </div>

        {/* 5-Column Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {/* Team Members */}
          {team.map((member, idx) => {
            const imgSrc = member.avatarUrl || member.originalAvatarUrl;
            const cardContent = (
              <div key={idx} className="flex flex-col group cursor-pointer">
                {/* Profile Card Container - 4:5 aspect ratio */}
                <div className="w-full aspect-[4/5] rounded-2xl bg-card-bg border border-neutral-300/40 flex items-center justify-center relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:scale-[1.02] mb-4">
                  <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-brand/5 transition-all duration-500 pointer-events-none" />
                  {imgSrc ? (
                    <img src={imgSrc} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    defaultAvatar
                  )}
                </div>
                
                {/* Profile details */}
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-base font-bold text-foreground leading-tight group-hover:text-brand transition-colors uppercase">
                    {member.name}
                  </h3>
                  {member.socialUrl && (
                    <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 group-hover:text-brand">
                      ↗
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {member.role}
                </p>
              </div>
            );

            return member.socialUrl ? (
              <a key={idx} href={member.socialUrl} target="_blank" rel="noopener noreferrer">
                {cardContent}
              </a>
            ) : (
              cardContent
            );
          })}
        </div>

      </div>
    </section>
  );
}
