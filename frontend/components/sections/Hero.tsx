"use client";

import React, { useState, useEffect } from "react";
import Button from "../ui/Button";

interface HeroProps {
  data?: {
    location: string;
    headlineLines: string[];
    description: string;
  };
}

export default function Hero({ data }: HeroProps) {
  const [activeTab, setActiveTab] = useState<"design" | "build" | "grow">("design");
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; speed: number }[]>([]);
  const [clickCount, setClickCount] = useState(0);

  // Generate some random floating particles for the interactive canvas
  useEffect(() => {
    const tempParticles = Array.from({ length: 15 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.5 + 0.2,
    }));
    setParticles(tempParticles);

    // Animating the particles subtly
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          y: p.y - p.speed < 0 ? 100 : p.y - p.speed,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

        {/* Left Column: Heading, Subheading & CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          {/* Location Badge */}
          <span
            className="text-[11px] md:text-xs font-semibold tracking-[0.25em] text-brand mb-6 block uppercase"
            style={{ color: "var(--brand)" }}
          >
            {data?.location || "SANEPA, NEPAL — DALLAS, TX"}
          </span>

          {/* Large Headline */}
          <h1 className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[110px] font-black tracking-tight leading-[0.9] text-foreground mb-8 select-none">
            {(data?.headlineLines || ["DESIGN.", "BUILD.", "GROW."]).map((line: string, i: number) => (
              <span key={i} className="block hover:text-brand transition-colors duration-300">
                {line}
              </span>
            ))}
          </h1>

          {/* Paragraph Description */}
          <p className="text-lg md:text-xl text-neutral-600 max-w-lg mb-10 leading-relaxed">
            {data?.description || "From web solutions and digital marketing to video, music, 3D and graphic design."}
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap gap-4 items-center">
            <a href="#work">
              <Button variant="primary">
                See the work
              </Button>
            </a>
            <a href="#capabilities">
              <Button variant="secondary">
                What we do
              </Button>
            </a>
          </div>
        </div>



      </div>
    </section>
  );
}
