"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAbstraktMotion } from "../lib/v2/useAbstraktMotion";
import { useLenis } from "../lib/v2/useLenis";
import { useSectionReveal } from "../lib/v2/useSectionReveal";
import CustomCursor from "../components/v2/CustomCursor";
import NavV2 from "../components/v2/NavV2";
import ScrollProgressV2 from "../components/v2/ScrollProgressV2";
import HeroV2 from "../components/v2/HeroV2";
import TrustedByV2 from "../components/v2/TrustedByV2";
// CapabilitiesPetals removed from homepage 2026-09-05 — component kept in
// components/v2/CapabilitiesPetals.tsx and backed up to Downloads/my comp
// for reuse on other projects. Uncomment to restore:
// import CapabilitiesPetals from "../components/v2/CapabilitiesPetals";
import CapabilitiesGridV2 from "../components/v2/CapabilitiesGridV2";
import WorksCarousel from "../components/v2/WorksCarousel";
import SelectedWorkV2 from "../components/v2/SelectedWorkV2";
import ProcessV2 from "../components/v2/ProcessV2";
import StudioV2 from "../components/v2/StudioV2";
import TestimonialsV2 from "../components/v2/TestimonialsV2";
import CareersV2 from "../components/v2/CareersV2";
import FaqV2 from "../components/v2/FaqV2";
import ContactV2 from "../components/v2/ContactV2";
import FooterV2 from "../components/v2/FooterV2";
import SectionEmpty from "../components/v2/SectionEmpty";
import {
  HeroSkeleton,
  WorksSkeleton,
  CapabilitiesSkeleton,
  LogosSkeleton,
  ProcessSkeleton,
  StudioSkeleton,
  FaqSkeleton,
} from "../components/ui/Skeleton";
// Stats, testimonials and careers copy have no CMS table and are rendered
// from these directly. The rest are imported for their TYPES only — they
// describe the shape each section expects, but are no longer rendered as
// fallback content: a section with no CMS data shows SectionEmpty instead.
import {
  heroContent,
  positionContent,
  logosContent,
  capabilitiesContent,
  workContent,
  processContent,
  peopleContent,
  faqContent,
  statsContent,
  testimonialsContent,
  careersContent,
  contactContent,
} from "./content";

/** Base URL of the content API. Hardcoding localhost meant every deployed
 *  build fetched a host that does not exist from the visitor's browser —
 *  and on an HTTPS page the request was blocked as mixed content before it
 *  was even attempted, so the site silently served placeholder copy. */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/** The works carousel is all artwork, so CMS work is only worth swapping in
 *  when it actually carries images. The CMS holds unillustrated placeholder
 *  projects; taking those would replace the static reel with blank cards. */
function hasIllustratedProjects(work: unknown): boolean {
  const projects = (work as { projects?: unknown } | null | undefined)?.projects;
  if (!Array.isArray(projects)) return false;
  return projects.some((p) => {
    const proj = p as { image?: string; thumbnailUrl?: string; videoThumbnailUrl?: string } | null;
    return Boolean(proj?.image || proj?.thumbnailUrl || proj?.videoThumbnailUrl);
  });
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  // CMS-backed sections start empty rather than on a static default.
  const [hero, setHero] = useState<typeof heroContent | null>(null);
  const [position, setPosition] = useState<typeof positionContent | null>(null);
  const [logos, setLogos] = useState<typeof logosContent | null>(null);
  const [capabilities, setCapabilities] = useState<typeof capabilitiesContent | null>(null);
  const [work, setWork] = useState<typeof workContent | null>(null);
  const [process, setProcess] = useState<typeof processContent | null>(null);
  const [people, setPeople] = useState<typeof peopleContent | null>(null);
  const [faq, setFaq] = useState<typeof faqContent | null>(null);
  const [stats, setStats] = useState<typeof statsContent | null>(null);
  const [testimonials, setTestimonials] = useState<typeof testimonialsContent | null>(null);
  const [careers, setCareers] = useState<typeof careersContent | null>(null);
  const [contact, setContact] = useState<typeof contactContent | null>(null);

  // "loading" suppresses the fallback message while the request is still in flight
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    // 1. Instant render from client sessionStorage cache — also used by
    //    /service and /team for their first paint.
    const cached = sessionStorage.getItem("abstrakt_content");
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (data?.hero?.headlineLine1) setHero(data.hero);
        if (data?.position?.statement) setPosition(data.position);
        if (Array.isArray(data?.logos) && data.logos.length) setLogos(data.logos);
        const cmsPillars = data?.capabilities?.pillars;
        const pillarValues = Object.values(
          (cmsPillars || {}) as Record<string, { title?: string; label?: string } | null>
        );
        if (pillarValues.some((p) => p?.title || p?.label)) setCapabilities(data.capabilities);
        if (hasIllustratedProjects(data?.work)) setWork(data.work);
        if (Array.isArray(data?.process?.steps) && data.process.steps.length) setProcess(data.process);
        if (Array.isArray(data?.people?.team) && data.people.team.length) setPeople(data.people);
        if (Array.isArray(data?.faq?.questions) && data.faq.questions.length) {
          setFaq({ ...(data.faq || {}), questions: data.faq.questions });
        }
        if (Array.isArray(data?.stats) && data.stats.length) setStats(data.stats);
        if (Array.isArray(data?.testimonials) && data.testimonials.length) setTestimonials(data.testimonials);
        if (data?.careers?.roles || data?.careers?.title) setCareers(data.careers);
        if (data?.contact?.email || data?.contact?.headlineLine1 || data?.contact?.skills) setContact(data.contact);
      } catch (e) {}
    }

    // 2. Fetch fresh content in background and refresh the cache.
    fetch(`${API_BASE}/api/content`)
      .then((res) => {
        if (!res.ok) throw new Error(`content API ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data?.hero?.headlineLine1) setHero(data.hero);
        if (data?.position?.statement) setPosition(data.position);
        if (Array.isArray(data?.logos) && data.logos.length) setLogos(data.logos);
        const cmsPillars = data?.capabilities?.pillars;
        const pillarValues = Object.values(
          (cmsPillars || {}) as Record<string, { title?: string; label?: string } | null>
        );
        if (pillarValues.some((p) => p?.title || p?.label)) setCapabilities(data.capabilities);
        if (hasIllustratedProjects(data?.work)) setWork(data.work);
        if (Array.isArray(data?.process?.steps) && data.process.steps.length) setProcess(data.process);
        if (Array.isArray(data?.people?.team) && data.people.team.length) setPeople(data.people);
        if (Array.isArray(data?.faq?.questions) && data.faq.questions.length) {
          setFaq({ ...(data.faq || {}), questions: data.faq.questions });
        }
        if (Array.isArray(data?.stats) && data.stats.length) setStats(data.stats);
        if (Array.isArray(data?.testimonials) && data.testimonials.length) setTestimonials(data.testimonials);
        if (data?.careers?.roles || data?.careers?.title) setCareers(data.careers);
        if (data?.contact?.email || data?.contact?.headlineLine1 || data?.contact?.skills) setContact(data.contact);

        try {
          sessionStorage.setItem("abstrakt_content", JSON.stringify(data));
        } catch (e) {
          // Ignore if base64 images exceed browser 5MB storage limit.
        }
      })
      .catch((err) => {
        console.warn("[content] fetch failed:", err);
      })
      .finally(() => setStatus("ready"));
  }, []);

  useLenis();
  useAbstraktMotion(rootRef, [hero, position, logos, capabilities, work, process, people, faq]);
  useSectionReveal(rootRef, [hero, position, logos, capabilities, work, process, people, faq]);

  const hiringTeam = people?.team?.slice(0, 2) || [];

  /** A section renders its skeleton while the request is in flight and its
   *  fallback only once the request has settled — so the page never flashes
   *  "unavailable" at a visitor whose content is still a few hundred ms
   *  away, and never jumps from a spinner to mismatched shapes. Each
   *  skeleton mirrors its section's real layout. */
  const gate = (
    content: unknown,
    node: React.ReactNode,
    label: string,
    skeleton?: React.ReactNode
  ) => {
    if (content) return node;
    if (status === "loading") {
      if (skeleton) return skeleton;
      switch (label) {
        case "The homepage":
          return <HeroSkeleton />;
        case "Our work":
          return <WorksSkeleton />;
        case "Our capabilities":
          return <CapabilitiesSkeleton />;
        case "Our clients":
          return <LogosSkeleton />;
        case "Our process":
          return <ProcessSkeleton />;
        case "Our team":
          return <StudioSkeleton />;
        case "Frequently asked questions":
          return <FaqSkeleton />;
        default:
          return skeleton ?? null;
      }
    }
    return <SectionEmpty label={label} />;
  };

  return (
    <div
      className="ab-page-dark-end"
      style={{
        "--ab-bg": "#F7F6F3",
        "--ab-ink": "#0E0E0E",
        "--ab-brand": "#501EBD",
        "--ab-brand-light": "#9A78F5",
        "--ab-card": "#EAE9E4",
        "--ab-ink-deep": "#100A1E",
        fontFamily: "var(--font-manrope), system-ui, sans-serif",
        background: "var(--ab-bg)",
        color: "var(--ab-ink)",
      } as React.CSSProperties}
    >
      <div ref={rootRef} style={{ width: "100%", overflowX: "clip" }}>
        <CustomCursor />
        <ScrollProgressV2 />
        <NavV2 />
        <main id="top" data-screen-label="Home" style={{ width: "100%", overflow: "clip" }}>
          {/* The positioning statement is rendered inside the hero rather
              than as its own section: the hero already ended on an empty
              full-screen black band, and the statement now occupies it. Its
              CMS copy is still fetched separately and passed down, so editing
              it in the admin works exactly as before — it is only gated with
              the hero now, since it no longer has a section of its own to
              hold a fallback. */}
          {gate(hero, <HeroV2 data={hero!} statement={position?.statement} />, "The homepage")}
          {/* Proof before credentials: show the work, then the range behind
              it, then the scale and the client list. The logo marquee earns
              more standing here than it did ahead of any of it. */}
          {gate(work, <WorksCarousel data={work!} />, "Our work")}
          {/* One pass at the CMS `pillars` payload: the bento grid. It was
              previously fed the `work` payload and titled as a work section —
              a second look at the same five projects the carousel above
              already shows. It was always meant to be a capability variant;
              this is that correction. */}
          {/* REMOVED 2026-09-05: petal flower showpiece taken off the homepage.
              Code preserved in components/v2/CapabilitiesPetals.tsx + backup in
              Downloads/my comp. Restore with:
              {gate(capabilities, <CapabilitiesPetals data={capabilities!} />, "Our capabilities")} */}
          {/* {gate(capabilities, <CapabilitiesPetals data={capabilities!} />, "Our capabilities")} */}
          {capabilities ? <CapabilitiesGridV2 data={capabilities} /> : null}
          {/* Client marks and the numbers behind them are one proof block,
              banded off by hairline rules — the stats are rendered inside
              TrustedByV2 rather than as their own section. */}
          {gate(
            logos?.length ? logos : null,
            <TrustedByV2 data={logos!} stats={stats || statsContent} />,
            "Our clients"
          )}
          {gate(process, <ProcessV2 data={process!} />, "Our process")}
          {gate(people, <StudioV2 data={people!} />, "Our team")}
          <TestimonialsV2 data={testimonials || testimonialsContent} />
          <CareersV2 data={careers || careersContent} hiringTeam={hiringTeam} />
          {gate(
            faq?.questions?.length ? faq : null,
            <FaqV2 data={faq!} />,
            "Frequently asked questions"
          )}
          <ContactV2 data={contact || contactContent} />
        </main>
        <FooterV2 />
      </div>
    </div>
  );
}
