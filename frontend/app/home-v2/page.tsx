"use client";

import React, { useRef } from "react";
import { useAbstraktMotion } from "../../lib/v2/useAbstraktMotion";
import { useLenis } from "../../lib/v2/useLenis";
import CustomCursor from "../../components/v2/CustomCursor";
import NavV2 from "../../components/v2/NavV2";
import HeroV2 from "../../components/v2/HeroV2";
import PositionV2 from "../../components/v2/PositionV2";
import TrustedByV2 from "../../components/v2/TrustedByV2";
import StatsV2 from "../../components/v2/StatsV2";
import CapabilitiesV2 from "../../components/v2/CapabilitiesV2";
import SelectedWorkV2 from "../../components/v2/SelectedWorkV2";
import ProcessV2 from "../../components/v2/ProcessV2";
import StudioV2 from "../../components/v2/StudioV2";
import TestimonialsV2 from "../../components/v2/TestimonialsV2";
import CareersV2 from "../../components/v2/CareersV2";
import FaqV2 from "../../components/v2/FaqV2";
import ContactV2 from "../../components/v2/ContactV2";
import FooterV2 from "../../components/v2/FooterV2";
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
  hiringTeamContent,
  faqContent,
} from "./content";

export default function HomeV2() {
  const rootRef = useRef<HTMLDivElement>(null);
  useLenis();
  useAbstraktMotion(rootRef);

  return (
    <div ref={rootRef} style={{ width: "100%", overflowX: "clip" }}>
      <CustomCursor />
      <NavV2 />
      <main id="top" data-screen-label="Home" style={{ width: "100%", overflow: "clip" }}>
        <HeroV2 data={heroContent} />
        <PositionV2 data={positionContent} />
        <TrustedByV2 data={logosContent} />
        <StatsV2 data={statsContent} />
        <CapabilitiesV2 data={capabilitiesContent} />
        <SelectedWorkV2 data={workContent} />
        <ProcessV2 data={processContent} />
        <StudioV2 data={peopleContent} />
        <TestimonialsV2 data={testimonialsContent} />
        <CareersV2 data={careersContent} hiringTeam={hiringTeamContent} />
        <FaqV2 data={faqContent} />
        <ContactV2 />
      </main>
      <FooterV2 />
    </div>
  );
}
