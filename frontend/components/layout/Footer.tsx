"use client";

import React, { useState, useEffect } from "react";

export default function Footer() {
  const [nepalTime, setNepalTime] = useState<string>("");
  const [dallasTime, setDallasTime] = useState<string>("");

  useEffect(() => {
    const updateClocks = () => {
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      try {
        const npt = new Intl.DateTimeFormat("en-US", {
          ...options,
          timeZone: "Asia/Kathmandu",
        }).format(new Date());

        const ct = new Intl.DateTimeFormat("en-US", {
          ...options,
          timeZone: "America/Chicago",
        }).format(new Date());

        setNepalTime(npt);
        setDallasTime(ct);
      } catch (e) {
        // Fallback static strings if Intl fails
        setNepalTime("12:00");
        setDallasTime("01:15");
      }
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-background py-16 md:py-20 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        {/* Top 4-Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* Column 1: Brand & Addresses */}
          <div className="lg:col-span-5 flex flex-col items-start gap-4">
            <a 
              href="/" 
              className="text-xl md:text-2xl font-black tracking-tight text-foreground"
            >
              ABSTRAKT
            </a>
            
            <div className="text-[13px] md:text-sm text-neutral-500 leading-relaxed font-medium">
              <p>Sanepa, Lalitpur, Nepal</p>
              <p>3620 Adelaide, The Colony, TX</p>
            </div>

            {/* Live Clock Display */}
            {nepalTime && dallasTime && (
              <span className="font-mono text-xs text-neutral-400 font-semibold mt-2 select-none">
                {nepalTime} NPT — {dallasTime} CT
              </span>
            )}
          </div>

          {/* Column 2: Pages Links */}
          <div className="lg:col-span-2 flex flex-col items-start gap-3">
            <span className="font-mono text-[10px] md:text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase mb-1">
              PAGES
            </span>
            <div className="flex flex-col gap-2.5 text-[13px] md:text-sm font-semibold text-neutral-600">
              <a href="#work" className="hover:text-brand transition-colors duration-200">Work</a>
              <a href="#capabilities" className="hover:text-brand transition-colors duration-200">Capabilities</a>
              <a href="#studio" className="hover:text-brand transition-colors duration-200">Studio</a>
              <a href="#contact" className="hover:text-brand transition-colors duration-200">Contact</a>
            </div>
          </div>

          {/* Column 3: Social Links */}
          <div className="lg:col-span-2 flex flex-col items-start gap-3">
            <span className="font-mono text-[10px] md:text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase mb-1">
              SOCIAL
            </span>
            <div className="flex flex-col gap-2.5 text-[13px] md:text-sm font-semibold text-neutral-600">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors duration-200">Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors duration-200">LinkedIn</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors duration-200">Facebook</a>
            </div>
          </div>

          {/* Column 4: Direct Contacts */}
          <div className="lg:col-span-3 flex flex-col items-start gap-3">
            <span className="font-mono text-[10px] md:text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase mb-1">
              DIRECT
            </span>
            <div className="flex flex-col gap-2.5 text-[13px] md:text-sm font-semibold text-neutral-600">
              <a href="mailto:abstraktcreation@gmail.com" className="hover:text-brand transition-colors duration-200">
                abstraktcreation@gmail.com
              </a>
              <a href="tel:+9779823901866" className="hover:text-brand transition-colors duration-200">
                +977 9823901866
              </a>
              <a href="tel:+18173309194" className="hover:text-brand transition-colors duration-200">
                +1 (817) 330-9194
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-200/60 pt-8 mt-4 gap-4">
          <span className="font-mono text-[10px] md:text-xs font-bold tracking-widest text-neutral-400 uppercase">
            &copy; 2026 ABSTRAKT CREATION
          </span>
          <div className="flex gap-4 font-mono text-[10px] md:text-xs font-bold tracking-widest text-neutral-400 uppercase">
            <a href="#privacy" className="hover:text-brand transition-colors duration-200">PRIVACY</a>
            <span>•</span>
            <a href="#legal" className="hover:text-brand transition-colors duration-200">LEGAL</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
