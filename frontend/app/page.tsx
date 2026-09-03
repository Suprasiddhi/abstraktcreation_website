"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAbstraktMotion } from "../lib/v2/useAbstraktMotion";
import { useLenis } from "../lib/v2/useLenis";
import { useSectionReveal } from "../lib/v2/useSectionReveal";
import CustomCursor from "../components/v2/CustomCursor";
import NavV2 from "../components/v2/NavV2";
import ScrollProgressV2 from "../components/v2/ScrollProgressV2";
import HeroV2 from "../components/v2/HeroV2";
import PositionV2 from "../components/v2/PositionV2";
import TrustedByV2 from "../components/v2/TrustedByV2";
import StatsV2 from "../components/v2/StatsV2";
import CapabilitiesStack from "../components/v2/CapabilitiesStack";
import WorksCarousel from "../components/v2/WorksCarousel";
import SelectedWorkV2 from "../components/v2/SelectedWorkV2";
import ProcessV2 from "../components/v2/ProcessV2";
import StudioV2 from "../components/v2/StudioV2";
import TestimonialsV2 from "../components/v2/TestimonialsV2";
import CareersV2 from "../components/v2/CareersV2";
import FaqV2 from "../components/v2/FaqV2";
import ContactV2 from "../components/v2/ContactV2";
import FooterV2 from "../components/v2/FooterV2";
import {
  heroContent,
  positionContent,
  logosContent,
  statsContent,
  capabilitiesContent,
  workContent,
  processContent,
  peopleContent,
  testimonialsContent,
  careersContent,
  faqContent,
} from "./content";

// Sections below have no backing table in the existing CMS schema and are
// intentionally left out of the dynamic wiring — they stay on the static
// copy from ./content.ts: Stats, Testimonials, Careers copy/roles, and the
// Selected Work polaroid gallery (kept static by explicit choice).

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

  // Each section starts on its static default and hot-swaps to live CMS
  // data if/when the fetch resolves with non-empty content — the page
  // never blocks on the network and degrades gracefully if the backend
  // is unreachable or a table is empty.
  const [hero, setHero] = useState(heroContent);
  const [position, setPosition] = useState(positionContent);
  const [logos, setLogos] = useState(logosContent);
  const [capabilities, setCapabilities] = useState(capabilitiesContent);
  const [work, setWork] = useState(workContent);
  const [process, setProcess] = useState(processContent);
  const [people, setPeople] = useState(peopleContent);
  const [faq, setFaq] = useState(faqContent);

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
          setFaq((prev) => ({ ...prev, questions: data.faq.questions }));
        }
      } catch (e) {}
    }

    // 2. Fetch fresh content in background and refresh the cache.
    fetch("http://localhost:3001/api/content")
      .then((res) => res.json())
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
          setFaq((prev) => ({ ...prev, questions: data.faq.questions }));
        }
        try {
          sessionStorage.setItem("abstrakt_content", JSON.stringify(data));
        } catch (e) {
          // Ignore if base64 images exceed browser 5MB storage limit.
        }
      })
      .catch(() => {
        // Backend unreachable — keep the static defaults, no error shown.
      });
  }, []);

  useLenis();
  useAbstraktMotion(rootRef, [hero, position, logos, capabilities, work, process, people, faq]);
  useSectionReveal(rootRef, [hero, position, logos, capabilities, work, process, people, faq]);

  const hiringTeam = people.team.slice(0, 2);

  return (
    <div
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
          <HeroV2 data={hero} />
          <PositionV2 data={position} />
          <TrustedByV2 data={logos} />
          <StatsV2 data={statsContent} />
          <CapabilitiesStack data={capabilities} />
          <WorksCarousel data={work} />
          {/* <SelectedWorkV2 data={workContent} /> */}
          <ProcessV2 data={process} />
          <StudioV2 data={people} />
          <TestimonialsV2 data={testimonialsContent} />
          <CareersV2 data={careersContent} hiringTeam={hiringTeam} />
          <FaqV2 data={faq} />
          <ContactV2 />
        </main>
        <FooterV2 />
      </div>
    </div>
  );
}
