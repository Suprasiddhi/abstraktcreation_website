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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/api/content")
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dynamic content from API:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center selection:bg-brand/20 selection:text-brand">
        <div className="flex flex-col items-center gap-4">
          <span className="text-3xl font-black tracking-tight text-foreground animate-pulse font-sans">
            ABSTRAKT
          </span>
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-brand/20 selection:text-brand">
      {/* Header section */}
      <Header />

      {/* Main hero section content */}
      <main className="flex-1 flex flex-col justify-start items-stretch">
        <Hero data={content?.hero} />
        <LogoMarquee data={content?.logos} />
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





