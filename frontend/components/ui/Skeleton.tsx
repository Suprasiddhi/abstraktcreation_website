"use client";

import React from "react";

/* ------------------------------------------------------------------
   Abstrakt skeleton kit — personalized, smooth, on-brand.
   Each skeleton mirrors the real section's shape (not generic boxes)
   so the page doesn't jump when content lands. All motion is
   compositor-only (opacity / transform / background-position) and
   disabled under prefers-reduced-motion in globals.css.
------------------------------------------------------------------- */

type Tone = "light" | "dark";

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Skeleton({
  className,
  tone = "light",
  delay = 0,
  style,
  label,
}: {
  className?: string;
  tone?: Tone;
  delay?: number;
  style?: React.CSSProperties;
  label?: string;
}) {
  return (
    <div
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "status" : undefined}
      className={cx("ab-skeleton", tone === "dark" && "ab-skeleton--dark", className)}
      style={{ animationDelay: `${delay}ms`, ...style }}
    />
  );
}

/** Small brand pulse shown next to "Fetching fresh content…" copy. */
export function SkeletonPulse({ tone = "light" }: { tone?: Tone }) {
  return (
    <span
      aria-hidden
      className={cx("ab-skel-pulse", tone === "dark" && "ab-skel-pulse--dark")}
    />
  );
}

function Shell({
  tone = "light",
  label,
  eyebrow,
  children,
  minHeight,
  dark,
}: {
  tone?: Tone;
  label: string;
  eyebrow?: string;
  children: React.ReactNode;
  minHeight?: number | string;
  dark?: boolean;
}) {
  const isDark = dark ?? tone === "dark";
  return (
    <section
      aria-busy="true"
      aria-label={`Loading ${label}`}
      data-screen-label={`${label} (loading)`}
      className="ab-skel-shell"
      style={{
        maxWidth: 1680,
        margin: "0 auto",
        padding: "clamp(44px,6vh,72px) clamp(18px,3.6vw,60px)",
        minHeight,
        background: isDark ? "#0E0E0E" : "transparent",
      }}
    >
      <div className="ab-skel-fade" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SkeletonPulse tone={tone} />
          <span
            className={cx("ab-skel-eyebrow", isDark && "ab-skel-eyebrow--dark")}
          >
            {eyebrow || `Fetching ${label}…`}
          </span>
        </div>
        {children}
      </div>
    </section>
  );
}

/* ------------------------------ HOME ------------------------------ */

export function HeroSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading hero"
      style={{
        position: "relative",
        minHeight: "100svh",
        background: "radial-gradient(120% 90% at 50% 0%, #1B1040 0%, #0E0E0E 62%)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(80px,10vh,120px) clamp(18px,3.6vw,60px)",
      }}
    >
      {/* soft brand glow orbs */}
      <div aria-hidden className="ab-skel-orb" style={{ left: "8%", top: "12%" }} />
      <div aria-hidden className="ab-skel-orb ab-skel-orb--2" style={{ right: "6%", bottom: "10%" }} />
      <div className="ab-skel-fade" style={{ width: "min(880px,100%)", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <Skeleton tone="dark" label="Loading hero badge" style={{ width: 180, height: 30, borderRadius: 999 }} />
        </div>
        <Skeleton tone="dark" style={{ height: "clamp(44px,7vw,84px)", borderRadius: 18 }} />
        <Skeleton tone="dark" delay={90} style={{ height: "clamp(44px,7vw,84px)", borderRadius: 18, marginTop: 14, width: "82%", marginInline: "auto" }} />
        <Skeleton tone="dark" delay={160} style={{ height: 18, borderRadius: 999, marginTop: 26, width: "min(520px,80%)", marginInline: "auto" }} />
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
          <Skeleton tone="dark" delay={220} style={{ width: 170, height: 48, borderRadius: 999 }} />
          <Skeleton tone="dark" delay={280} style={{ width: 170, height: 48, borderRadius: 999 }} />
        </div>
      </div>
    </section>
  );
}

export function WorksSkeleton() {
  return (
    <Shell label="selected work" eyebrow="Fetching selected work…" dark>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
        <Skeleton tone="dark" style={{ height: 44, width: "min(420px,60%)", borderRadius: 14 }} />
        <Skeleton tone="dark" delay={80} style={{ height: 36, width: 140, borderRadius: 999 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 18 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="ab-skel-cardwrap">
            <Skeleton tone="dark" delay={i * 90} style={{ height: 300, borderRadius: 22 }} />
            <Skeleton tone="dark" delay={i * 90 + 60} style={{ height: 18, width: "70%", borderRadius: 999, marginTop: 14 }} />
            <Skeleton tone="dark" delay={i * 90 + 110} style={{ height: 14, width: "45%", borderRadius: 999, marginTop: 8 }} />
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function CapabilitiesSkeleton() {
  return (
    <Shell label="capabilities" eyebrow="Fetching capabilities…">
      <Skeleton style={{ height: 40, width: "min(460px,70%)", borderRadius: 14 }} />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="ab-skel-rowcard"
          style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 18, alignItems: "center" }}
        >
          <Skeleton delay={i * 90} style={{ height: 96, borderRadius: 18 }} />
          <div>
            <Skeleton delay={i * 90 + 50} style={{ height: 22, width: "55%", borderRadius: 999 }} />
            <Skeleton delay={i * 90 + 100} style={{ height: 14, width: "90%", borderRadius: 999, marginTop: 10 }} />
            <Skeleton delay={i * 90 + 140} style={{ height: 14, width: "70%", borderRadius: 999, marginTop: 8 }} />
          </div>
          <Skeleton delay={i * 90 + 120} style={{ height: 40, width: 40, borderRadius: "50%" }} />
        </div>
      ))}
    </Shell>
  );
}

export function LogosSkeleton() {
  return (
    <Shell label="client logos" eyebrow="Fetching client logos…">
      <Skeleton style={{ height: 26, width: 260, borderRadius: 999, marginInline: "auto" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: 14, marginTop: 6 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} delay={i * 70} style={{ height: 64, borderRadius: 16 }} />
        ))}
      </div>
      <div className="ab-stat-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 18, marginTop: 10 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton delay={i * 70} style={{ height: 36, width: "60%", borderRadius: 10 }} />
            <Skeleton delay={i * 70 + 60} style={{ height: 14, width: "80%", borderRadius: 999, marginTop: 10 }} />
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function ProcessSkeleton() {
  return (
    <Shell label="process" eyebrow="Fetching our process…">
      <Skeleton style={{ height: 40, width: "min(380px,60%)", borderRadius: 14 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 16 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton delay={i * 80} style={{ height: 34, width: 34, borderRadius: "50%" }} />
            <Skeleton delay={i * 80 + 50} style={{ height: 20, width: "75%", borderRadius: 999, marginTop: 14 }} />
            <Skeleton delay={i * 80 + 90} style={{ height: 120, borderRadius: 18, marginTop: 12 }} />
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function StudioSkeleton() {
  return (
    <Shell label="studio team" eyebrow="Fetching studio team…">
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
        <Skeleton style={{ height: 40, width: "min(360px,60%)", borderRadius: 14 }} />
        <Skeleton delay={70} style={{ height: 36, width: 150, borderRadius: 999 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 16 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton delay={i * 80} style={{ height: 220, borderRadius: 20 }} />
            <Skeleton delay={i * 80 + 60} style={{ height: 16, width: "70%", borderRadius: 999, marginTop: 12 }} />
            <Skeleton delay={i * 80 + 100} style={{ height: 12, width: "45%", borderRadius: 999, marginTop: 8 }} />
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function FaqSkeleton() {
  return (
    <Shell label="FAQs" eyebrow="Fetching FAQs…">
      <Skeleton style={{ height: 40, width: "min(420px,65%)", borderRadius: 14 }} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", border: "1px solid #E7E6E1", borderRadius: 16, background: "#fff" }}>
          <Skeleton delay={i * 80} style={{ height: 18, flex: 1, borderRadius: 999 }} />
          <Skeleton delay={i * 80 + 60} style={{ height: 32, width: 32, borderRadius: "50%", flexShrink: 0 }} />
        </div>
      ))}
    </Shell>
  );
}

/* ------------------------- ROUTE SKELETONS ------------------------ */

function CardGridSkeleton({
  count = 6,
  dark = false,
  label,
}: {
  count?: number;
  dark?: boolean;
  label: string;
}) {
  const tone: Tone = dark ? "dark" : "light";
  return (
    <div
      aria-busy="true"
      aria-label={label}
      role="status"
      className="ab-skel-fade"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(320px,100%),1fr))", gap: "2.5rem" }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton
            tone={tone}
            delay={(i % 6) * 80}
            style={{
              width: "100%",
              aspectRatio: "4/5",
              borderRadius: 16,
              background: dark ? undefined : "#111",
            }}
          />
          <Skeleton tone={tone} delay={(i % 6) * 80 + 60} style={{ height: 14, width: "40%", borderRadius: 999, marginTop: 18 }} />
          <Skeleton tone={tone} delay={(i % 6) * 80 + 110} style={{ height: 26, width: "75%", borderRadius: 10, marginTop: 10 }} />
          <Skeleton tone={tone} delay={(i % 6) * 80 + 150} style={{ height: 14, width: "90%", borderRadius: 999, marginTop: 12 }} />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Skeleton tone={tone} style={{ height: 40, width: 40, borderRadius: "50%" }} />
            <Skeleton tone={tone} style={{ height: 40, width: 40, borderRadius: "50%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TeamGridSkeleton({ count = 6 }: { count?: number }) {
  return <CardGridSkeleton count={count} label="Loading team members" />;
}

export function ServicesGridSkeleton({ count = 6 }: { count?: number }) {
  return <CardGridSkeleton count={count} dark label="Loading services" />;
}

export function AdminSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading admin panel"
      role="status"
      className="ab-skel-fade"
      style={{ maxWidth: 1400, margin: "3rem auto 0", padding: "0 1.5rem", width: "100%" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <SkeletonPulse />
        <span className="ab-skel-eyebrow">Fetching panel configuration…</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }} className="ab-skel-admin">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} delay={i * 60} style={{ height: 46, borderRadius: 12 }} />
          ))}
        </div>
        <div style={{ border: "1px solid #E7E6E1", borderRadius: 16, padding: 32, background: "#fff" }}>
          <Skeleton style={{ height: 26, width: "35%", borderRadius: 10 }} />
          <Skeleton delay={80} style={{ height: 14, width: "50%", borderRadius: 999, marginTop: 10 }} />
          <Skeleton delay={140} style={{ height: 52, borderRadius: 12, marginTop: 26 }} />
          <Skeleton delay={200} style={{ height: 120, borderRadius: 12, marginTop: 14 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
            <Skeleton delay={260} style={{ height: 52, borderRadius: 12 }} />
            <Skeleton delay={300} style={{ height: 52, borderRadius: 12 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 26 }}>
            <Skeleton delay={340} style={{ height: 44, width: 170, borderRadius: 999 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
