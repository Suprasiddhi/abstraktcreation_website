"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PlaceholderSlot from "./PlaceholderSlot";
import SectionHeading from "./SectionHeading";
import { displayFont, LINE } from "./tokens";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface MemberData {
  name: string;
  role: string;
  description?: string;
  /** Admin-cropped avatar; `originalAvatarUrl` is the pre-crop upload kept so
   *  the cropper can be reopened. Either may be a base64 data URI rather than
   *  a URL, which is why these render through a plain <img> — next/image has
   *  nothing to optimise on a data URI and would need every CMS host allowed
   *  in remotePatterns for the ones that are real URLs. */
  avatarUrl?: string;
  originalAvatarUrl?: string;
}

interface StudioV2Props {
  data?: { team: MemberData[] };
}

export default function StudioV2({ data }: StudioV2Props) {
  const team = data?.team || [];
  const sectionRef = useRef<HTMLElement>(null);

  // Port of the Codrops OnScrollLayoutFormations "data-grid-second" effect:
  // cards fly up from below the viewport, fanned outward from center — left
  // cards rotate positive, right cards negative, scaled by distance from
  // center — scrubbed as the section scrolls into view (no pin).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = section.querySelectorAll<HTMLElement>("[data-studio-card]");
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      const middleIndex = Math.floor(cards.length / 2);
      gsap
        .timeline({
          defaults: { ease: "power3" },
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "center center",
            scrub: 0.5,
          },
        })
        .from(cards, {
          stagger: { amount: 0.3, from: "center" },
          y: () => window.innerHeight,
          transformOrigin: "50% 0%",
          rotation: (pos: number) => {
            const distanceFromCenter = Math.abs(pos - middleIndex);
            return pos < middleIndex ? distanceFromCenter * 3 : distanceFromCenter * -3;
          },
        });
    }, section);

    return () => ctx.revert();
  }, [team]);

  if (team.length === 0) return null;

  return (
    // Ground matches the page cream (--ab-bg) rather than the darker #EAE9E4
    // stone it used to be: the testimonials section directly below has no
    // background of its own, so the mismatch showed as a hard grey-to-white
    // step across the full width. data-depth is "flat" for the same reason —
    // the lift shadow only reads on a genuine ground change, and on a
    // same-colour handoff it just smudges the seam.
    <section ref={sectionRef} id="studio" data-reveal="1" data-depth="flat" data-screen-label="People" style={{ position: "relative", padding: "clamp(60px,9vh,110px) 0", background: "#F7F6F3", scrollMarginTop: 80, overflow: "hidden" }}>
      <div data-depth-inner="1" style={{ position: "relative", maxWidth: 1680, margin: "0 auto", padding: "0 clamp(18px,3.6vw,60px)" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            paddingBottom: "clamp(24px,4vh,44px)",
            // The shared hairline token, not the #D6D5CF that was picked to
            // read against the old darker stone ground — on cream that reads
            // heavier than every other divider on the page.
            borderBottom: `1px solid ${LINE}`,
            marginBottom: "clamp(28px,4.5vh,52px)",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(32px,5.2vw,78px)", lineHeight: 0.94, letterSpacing: "-.04em" }}>
              <span data-rv="line"><span><SectionHeading accent={2}>Who you actually work with</SectionHeading></span></span>
            </h2>
          </div>
          <span data-rv="eyebrow" style={{ ["--rv-i" as string]: 2, fontSize: 12, fontWeight: 600, letterSpacing: ".16em", color: "#8B8A84", paddingBottom: 8 }}>TAP + TO READ</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "clamp(14px,1.6vw,24px)" }}>
          {team.map((member, i) => (
            <div key={i}>
              <div data-studio-card="1">
                <PersonCard member={member} />
              </div>
            </div>
          ))}
        </div>

        {/* Through to the full roster. Sits below the grid rather than up in
            the header row: the cards here are a preview, so the invitation to
            see everyone reads as the step after them. Not wrapped in
            [data-rv] — the GSAP timeline above animates [data-studio-card]
            from a scroll-scrubbed offset, and a reveal transition on a
            sibling of that would fire on a different clock. */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(28px,4.5vh,52px)" }}>
          <Link
            className="ab-btn ab-btn--ink"
            href="/team"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              height: 56,
              padding: "0 30px",
              borderRadius: 999,
              background: "#0E0E0E",
              color: "#F7F6F3",
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {/* Label and glyph each in their own span: .ab-btn lifts only
                direct children above the fill pseudo-element. */}
            <span>Meet the whole team</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PersonCard({ member, compact = false }: { member: MemberData; compact?: boolean }) {
  const pad = compact ? 20 : 24;
  const btnSize = compact ? 46 : 54;
  const iconSize = compact ? 14 : 16;
  // Cropped avatar first, raw upload as the fallback — same precedence the
  // team page uses, so a member shows the same photo in both places.
  const imgSrc = member.avatarUrl || member.originalAvatarUrl;

  return (
    <div data-person="1" style={{ position: "relative", aspectRatio: "3/4", borderRadius: compact ? 18 : 20, overflow: "hidden", background: "#2A0E70" }}>
      {imgSrc ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={member.name}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* The name/role label and the + button are white on whatever the
              photo happens to be. This scrim keeps the bottom third dark
              enough for both to hold contrast over a light or busy image —
              the flat purple placeholder never needed one. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top,rgba(14,14,14,.72) 0%,rgba(14,14,14,.28) 34%,transparent 62%)",
              pointerEvents: "none",
            }}
          />
        </>
      ) : (
        <PlaceholderSlot label={member.name} tone="purple" />
      )}
      <div
        data-circle="1"
        style={{
          position: "absolute",
          left: `calc(100% - ${btnSize - 13}px)`,
          top: `calc(100% - ${btnSize - 13}px)`,
          width: 0,
          height: 0,
          transform: "translate(-50%,-50%)",
          borderRadius: 999,
          background: "#ffffff",
          transition: "width .68s cubic-bezier(.76,0,.24,1),height .68s cubic-bezier(.76,0,.24,1)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <div
        data-panel="1"
        style={{
          position: "absolute",
          inset: 0,
          padding: pad,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#0E0E0E",
          zIndex: 4,
          opacity: 0,
          transform: "translateY(22px)",
          transition: "opacity .34s .22s,transform .34s .22s",
          pointerEvents: "none",
        }}
      >
        <p style={{ margin: 0, fontSize: compact ? 15 : "clamp(15px,1.3vw,20px)", lineHeight: 1.45, fontWeight: 500 }}>
          {member.description || "Part of the studio team."}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: compact ? 16 : 19 }}>{member.name}</span>
          <span style={{ fontSize: compact ? 13 : 14, opacity: 0.8 }}>{member.role}</span>
        </div>
      </div>
      <button
        type="button"
        data-action="toggle-person"
        aria-label="Read bio"
        style={{
          position: "absolute",
          bottom: compact ? 12 : 14,
          right: compact ? 12 : 14,
          width: btnSize,
          height: btnSize,
          borderRadius: 999,
          background: "#ffffff",
          border: 0,
          padding: 0,
          cursor: "pointer",
          zIndex: 3,
          transition: "width .68s cubic-bezier(.76,0,.24,1),height .68s cubic-bezier(.76,0,.24,1),transform .68s cubic-bezier(.76,0,.24,1)",
        }}
      >
        <span
          data-plus-icon="1"
          style={{ position: "absolute", bottom: compact ? 16 : 19, right: compact ? 16 : 19, display: "block", width: iconSize, height: iconSize, transition: "transform .5s cubic-bezier(.34,1.5,.64,1)" }}
        >
          <span style={{ position: "absolute", top: iconSize / 2 - 1, left: 0, width: iconSize, height: 2, background: "#0E0E0E", borderRadius: 2 }} />
          <span style={{ position: "absolute", left: iconSize / 2 - 1, top: 0, width: 2, height: iconSize, background: "#0E0E0E", borderRadius: 2 }} />
        </span>
      </button>
      <div data-label="1" style={{ position: "absolute", left: compact ? 16 : 20, bottom: compact ? 18 : 22, color: "#ffffff", transition: "opacity .3s", pointerEvents: "none" }}>
        <span style={{ display: "block", fontFamily: displayFont, fontWeight: 700, fontSize: compact ? 16 : 19 }}>{member.name}</span>
        <span style={{ fontSize: compact ? 12 : 13, opacity: 0.75 }}>{member.role}</span>
      </div>
    </div>
  );
}
