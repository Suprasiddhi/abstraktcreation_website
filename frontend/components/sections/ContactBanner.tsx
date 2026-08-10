import React from "react";

export default function ContactBanner() {
  return (
    <section id="contact" className="w-full bg-neutral-950 text-white py-24 md:py-32 px-6 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
        {/* Headline */}
        <h2 className="text-[38px] sm:text-[56px] md:text-[76px] lg:text-[84px] font-black tracking-tight leading-[0.95] text-white uppercase max-w-4xl mb-6 select-none">
          GOT SOMETHING<br />TO BUILD?
        </h2>
        
        {/* Subtext */}
        <p className="text-neutral-400 text-sm sm:text-base md:text-lg mb-10 max-w-md font-medium">
          Tell us what it is. We reply within a working day.
        </p>

        {/* CTA Button */}
        <button className="bg-white hover:bg-neutral-150 hover:scale-[1.02] active:scale-[0.98] text-neutral-950 font-semibold text-[15px] py-[14px] px-8 rounded-full shadow-lg transition-all duration-300 cursor-pointer">
          Start a project
        </button>
      </div>
    </section>
  );
}
