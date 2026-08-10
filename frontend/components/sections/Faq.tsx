"use client";

import React, { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  data?: {
    badge: string;
    title: string;
    description: string;
    buttonText: string;
    questions: FaqItem[];
  };
}

export default function Faq({ data }: FaqProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const defaultData = {
    badge: "GOT QUESTIONS?",
    title: "FREQUENTLY ASKED QUESTIONS",
    description: "Find answers to the most common questions about Abstrakt Creation and our comprehensive digital, creative, and branding services.",
    buttonText: "VIEW ALL FAQS +",
    questions: [
      {
        question: "What services does Abstrakt Creation offer?",
        answer: "We provide end-to-end design, digital, growth, and creative solutions. This includes web application development, UI/UX systems, brand identity guidelines, marketing campaigns, 3D animations, video production, and sound design."
      },
      {
        question: "How long does a typical project take?",
        answer: "Timelines vary depending on scope. A standard brand design or website development project usually takes between 4 to 8 weeks. Larger campaigns or complex Web3 platforms can take 12 weeks or more. We establish clear phases during planning."
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes, we work globally. We are physically situated in Lalitpur, Nepal and Dallas, Texas, allowing us to collaborate seamlessly with clients across the US, Europe, and South Asia."
      },
      {
        question: "What is your pricing structure?",
        answer: "We operate on flat project-based pricing or ongoing monthly retainers depending on what fits your workflow. Every project starts with a detailed scoping phase where we provide a transparent, all-inclusive budget before starting."
      }
    ]
  };

  const faqData = data || defaultData;
  const questions = faqData.questions || defaultData.questions;

  const toggleAccordion = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  // Custom typography layout for the title to implement the dot-accent above Q
  const renderTitle = (titleText: string) => {
    const parts = titleText.split("QUESTIONS");
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <span className="relative inline-block">
            Q
            <span className="absolute -top-1 md:-top-2 left-[40%] w-[6px] h-[6px] md:w-[8px] md:h-[8px] bg-white rounded-full" />
          </span>
          UESTIONS
          {parts[1]}
        </>
      );
    }
    return titleText;
  };

  return (
    <section className="w-full bg-black text-white py-24 px-6 md:px-12 border-b border-neutral-800 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
        {/* Blue Badge */}
        <span className="text-[11px] md:text-xs font-bold tracking-[0.25em] text-brand mb-6 block uppercase">
          {faqData.badge || defaultData.badge}
        </span>

        {/* Big Bold Title */}
        <h2 className="text-[34px] sm:text-[48px] md:text-[68px] lg:text-[76px] font-black tracking-tight leading-[1.0] text-white uppercase max-w-5xl mb-6 select-none">
          {renderTitle(faqData.title || defaultData.title)}
        </h2>

        {/* Description */}
        <p className="text-neutral-400 text-sm sm:text-base md:text-lg mb-10 max-w-3xl leading-relaxed">
          {faqData.description || defaultData.description}
        </p>

        {/* VIEW ALL FAQS Button */}
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (isExpanded) setOpenIndex(null); // reset individual items on collapse
          }}
          className="border border-neutral-800 hover:border-brand bg-neutral-950/50 hover:bg-brand/10 text-white font-semibold text-[13px] tracking-wider py-[14px] px-8 rounded-full transition-all duration-300 uppercase cursor-pointer flex items-center gap-2 select-none"
        >
          {isExpanded ? "CLOSE FAQS -" : (faqData.buttonText || defaultData.buttonText)}
        </button>

        {/* Expandable Accordion List */}
        <div
          className={`w-full max-w-4xl mx-auto transition-all duration-700 ease-in-out overflow-hidden ${
            isExpanded
              ? "max-h-[1000px] mt-16 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col text-left border-t border-neutral-800/80">
            {questions.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border-b border-neutral-800/80 py-6 transition-all duration-300">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between text-left group focus:outline-none cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-100 group-hover:text-brand transition-colors duration-200">
                      {faq.question}
                    </span>
                    <span className="ml-4 flex-shrink-0 text-neutral-500 group-hover:text-brand transition-all duration-300 transform">
                      {isOpen ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      )}
                    </span>
                  </button>

                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[300px] mt-4 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-3xl">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
