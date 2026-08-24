"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

interface ServiceItem {
  id?: string;
  slotId?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  label?: string;
  tag?: string;
  badge?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    // 1. Instant render from client sessionStorage cache
    const cached = sessionStorage.getItem("abstrakt_content");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const raw = parsed?.capabilities?.pillars;
        if (raw) {
          const list: ServiceItem[] = Array.isArray(raw) ? raw : Object.values(raw);
          setServices(list);
          setLoading(false);
        }
      } catch (e) {}
    }

    // 2. Fetch fresh services content in background
    fetch("http://localhost:3001/api/content")
      .then((res) => res.json())
      .then((data) => {
        const raw = data?.capabilities?.pillars;
        if (raw) {
          const list: ServiceItem[] = Array.isArray(raw) ? raw : Object.values(raw);
          setServices(list);
          try {
            sessionStorage.setItem("abstrakt_content", JSON.stringify(data));
          } catch (e) {
            // Ignore if base64 images exceed browser storage quota limit
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch services data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-brand/20 selection:text-brand">
      {/* Global Navigation Header */}
      <Header />

      <main className="flex-1 py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-12 md:gap-16">
          
          {/* Back Button & Hero Section Title */}
          <div className="flex flex-col gap-6 border-b border-neutral-200/80 pb-12">
            <Link
              href="/#capabilities"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-neutral-500 hover:text-brand transition-colors uppercase w-fit group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO HOME
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-none text-foreground">
                  OUR <span className="text-brand font-black">SERVICES</span>
                </h1>
                <p className="text-sm md:text-base text-neutral-500 max-w-xl mt-4 font-sans font-normal leading-relaxed">
                  A comprehensive suite of digital marketing, brand strategy, identity design, and cutting-edge software solutions crafted to elevate your business.
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="w-full py-24 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          ) : services.length > 0 ? (
            /* Services Grid (3 columns matching Team page layout) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {services.map((service, idx) => {
                const displayNum = service.id || String(idx + 1).padStart(2, "0");

                return (
                  <div key={service.id || idx} className="flex flex-col group cursor-pointer">
                    {/* Service Image Card Container */}
                    <div className="w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between p-8 relative overflow-hidden transition-all duration-700 hover:border-brand/60 shadow-xl hover:-translate-y-1.5 mb-6">
                      {/* Background Image or Dark Gradient */}
                      {service.imageUrl ? (
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black group-hover:scale-105 transition-transform duration-700 ease-out" />
                      )}

                      {/* Dark Gradient Overlay for optimal contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black/85 transition-opacity duration-500 pointer-events-none" />

                      {/* Badge / Number tag */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="bg-black/70 backdrop-blur-md border border-neutral-700/60 text-brand text-xs font-mono font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                          {displayNum}
                        </span>
                      </div>

                      {/* Card Title inside container preview */}
                      <div className="relative z-10 flex flex-col justify-end pt-12">
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase group-hover:text-brand transition-colors duration-300 leading-tight">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    {/* Member-style Details Section below Card */}
                    <div className="flex flex-col gap-2">
                      {/* Service Category Tag */}
                      <span className="text-xs font-mono font-bold text-brand uppercase tracking-wider">
                        {displayNum} — {service.tag || service.label || "CAPABILITY & OFFERING"}
                      </span>

                      {/* Service Name (Black, turns Blue on hover) */}
                      <h3 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight leading-tight group-hover:text-brand transition-colors">
                        {service.title}
                      </h3>

                      {/* Description with Vertical Accent Line */}
                      {service.description && (
                        <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed border-l-2 border-brand/60 pl-3.5 mt-1 mb-2">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full py-20 rounded-2xl border border-dashed border-neutral-300 text-center bg-neutral-50/50">
              <p className="text-sm font-mono text-neutral-400 uppercase tracking-wider">
                No services added yet. Add services from the admin panel.
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
