import React from "react";

interface PositionProps {
  data?: {
    statement: string;
  };
}

export default function Position({ data }: PositionProps) {
  return (
    <section className="w-full border-b border-neutral-200/60 py-16 md:py-24 lg:py-28 px-6 md:px-12 lg:px-16">
      <div className="max-w-[1400px] mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-medium leading-[1.18] text-foreground tracking-tight w-full">
          {data?.statement || ""}
        </h2>
      </div>
    </section>
  );
}
