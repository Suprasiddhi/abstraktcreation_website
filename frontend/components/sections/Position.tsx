import React from "react";

interface PositionProps {
  data?: {
    statement: string;
  };
}

export default function Position({ data }: PositionProps) {
  return (
    <section className="w-full border-b border-neutral-200/60 py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
        <div className="md:col-span-9 lg:col-span-8">
          <h2 className="text-2xl sm:text-3xl md:text-[34px] lg:text-[40px] font-normal leading-[1.25] text-foreground tracking-tight max-w-5xl">
            {data?.statement || ""}
          </h2>
        </div>
      </div>
    </section>
  );
}
