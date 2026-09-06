"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { TeamGridSkeleton } from "../../components/ui/Skeleton";

interface SocialItem {
  platform: string;
  url: string;
}

interface TeamMember {
  name: string;
  role: string;
  description?: string;
  avatarUrl?: string;
  originalAvatarUrl?: string;
  socials?: SocialItem[];
  socialPlatform?: string;
  socialUrl?: string;
}

function SocialIcon({ platform }: { platform: string }) {
  const p = (platform || "").toLowerCase();
  if (p.includes("linkedin")) {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
      </svg>
    );
  }
  if (p.includes("github")) {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
      </svg>
    );
  }
  if (p.includes("twitter") || p.includes("x")) {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  // Default Instagram
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    // 1. Instant render from client sessionStorage cache
    const cached = sessionStorage.getItem("abstrakt_content");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed?.people?.team) {
          setTeam(parsed.people.team);
          setLoading(false);
        }
      } catch (e) {}
    }

    // 2. Fetch fresh team content in background
    fetch(`${API_BASE}/api/content`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.people?.team) {
          setTeam(data.people.team);
          try {
            sessionStorage.setItem("abstrakt_content", JSON.stringify(data));
          } catch (e) {
            // Ignore if base64 images exceed browser storage quota limit
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch team data:", err);
        setLoading(false);
      });
  }, []);

  const defaultAvatar = (
    <svg
      className="w-24 h-24 text-neutral-600 group-hover:text-brand transition-colors duration-500"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="50" cy="40" r="18" />
      <path d="M22 82c0-15.46 12.54-28 28-28s28 12.54 28 28" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-brand/20 selection:text-brand">
      {/* Global Navigation Header */}
      <Header />

      <main className="flex-1 py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-12 md:gap-16">
          
          {/* Back Button & Hero Section Title */}
          <div className="flex flex-col gap-6 border-b border-neutral-200/80 pb-12">
            <Link
              href="/#studio"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-neutral-500 hover:text-brand transition-colors uppercase w-fit group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO HOME
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-none text-foreground">
                  THE <span className="text-brand font-black">TEAM</span>
                </h1>
                <p className="text-sm md:text-base text-neutral-500 max-w-xl mt-4 font-sans font-normal leading-relaxed">
                  A collective of visionaries, engineers, and artists dedicated to redefining the digital landscape through innovation and design.
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
              </div>
            </div>
          </div>

          {/* Loading State — mirrors the team card grid so cards land in place */}
          {loading ? (
            <TeamGridSkeleton count={6} />
          ) : team.length > 0 ? (
            /* Team Grid (3 columns matching user screenshot layout) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {team.map((member, idx) => {
                const displayNum = String(idx + 1).padStart(2, "0");
                const imgSrc = member.avatarUrl || member.originalAvatarUrl;

                // Collect social links
                const socialList: SocialItem[] = Array.isArray(member.socials) && member.socials.length > 0
                  ? member.socials
                  : member.socialUrl
                  ? [{ platform: member.socialPlatform || "insta", url: member.socialUrl }]
                  : [];

                return (
                  <div key={idx} className="flex flex-col group">
                    {/* Member Image Card Container (Aspect Ratio ~4:5 / Square with Greyscale hover effect) */}
                    <div className="w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center relative overflow-hidden transition-all duration-700 hover:border-brand/40 shadow-md mb-6">
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-500 z-10 pointer-events-none" />
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={member.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                      ) : (
                        defaultAvatar
                      )}
                    </div>

                    {/* Member Details */}
                    <div className="flex flex-col gap-2">
                      {/* Role & Number */}
                      <span className="text-xs font-mono font-bold text-brand uppercase tracking-wider">
                        {displayNum} — {member.role || "TEAM MEMBER"}
                      </span>

                      {/* Name (Black, turns Blue on hover) */}
                      <h3 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight leading-tight group-hover:text-brand transition-colors">
                        {member.name}
                      </h3>

                      {/* Description with Vertical Accent Line */}
                      {member.description && (
                        <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed border-l-2 border-brand/60 pl-3.5 mt-1 mb-2">
                          {member.description}
                        </p>
                      )}

                      {/* Social Links (Black buttons) */}
                      {socialList.length > 0 && (
                        <div className="flex items-center gap-3 mt-2">
                          {socialList.map((soc, sIdx) => {
                            if (!soc.url) return null;
                            return (
                              <a
                                key={sIdx}
                                href={soc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${member.name} ${soc.platform}`}
                                className="w-10 h-10 rounded-full bg-black text-white hover:bg-brand hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
                              >
                                <SocialIcon platform={soc.platform} />
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full py-20 rounded-2xl border border-dashed border-neutral-300 text-center bg-neutral-50/50">
              <p className="text-sm font-mono text-neutral-400 uppercase tracking-wider">
                No team members added yet. Add team members from the admin panel.
              </p>
            </div>
          )}

        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
