"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Hero from "../components/sections/Hero";
import LogoMarquee from "../components/sections/LogoMarquee";
import Position from "../components/sections/Position";
import Capabilities from "../components/sections/Capabilities";
import SelectedWork from "../components/sections/SelectedWork";
import Faq from "../components/sections/Faq";
import Process from "../components/sections/Process";
import People from "../components/sections/People";
import ContactBanner from "../components/sections/ContactBanner";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/ui/ScrollToTop";

export default function Home() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/api/content")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error("Failed to load dynamic content from API:", err));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-brand/20 selection:text-brand">
      {/* Header section */}
      <Header />

      {/* Main hero section content */}
      <main className="flex-1 flex flex-col justify-start items-stretch">
        <Hero data={content?.hero} />
        <LogoMarquee />
        <Position data={content?.position} />
        <Capabilities data={content?.capabilities} />
        <SelectedWork data={content?.work} />
        <Faq data={content?.faq} />
        <Process data={content?.process} />
        <People data={content?.people} />
        <ContactBanner />
      </main>

      {/* Footer layout */}
      <Footer />

      {/* Floating scroll to top button */}
      <ScrollToTop />
    </div>
  );
}





