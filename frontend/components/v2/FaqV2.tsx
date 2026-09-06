import React from "react";
import { displayFont, LINE, MUTED, BODY_MUTED } from "./tokens";
import SectionHeading from "./SectionHeading";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqV2Props {
  data?: { questions?: FaqItem[]; standfirst?: string };
}

/** Sits under the heading and tells the reader what this list is for, so
 *  the section opens with a reason to read rather than a bare question
 *  stack. Overridable from the CMS once the schema carries the field. */
const DEFAULT_STANDFIRST =
  "The real questions clients ask before starting a project with us — scope, timelines, pricing and how we work.";

export default function FaqV2({ data }: FaqV2Props) {
  const questions = data?.questions || [];
  const standfirst = data?.standfirst || DEFAULT_STANDFIRST;
  if (questions.length === 0) return null;

  return (
    <section data-reveal="1" data-depth="flat" data-screen-label="FAQ" style={{ maxWidth: 1680, margin: "0 auto", padding: "clamp(60px,9vh,110px) clamp(18px,3.6vw,60px)" }}>
      <div data-depth-inner="dim" className="ab-grid-split" style={{ display: "grid", gridTemplateColumns: "minmax(0,.8fr) minmax(0,1.8fr)", gap: "clamp(28px,4vw,72px)", alignItems: "start" }}>
        <div className="ab-sticky-head" style={{ position: "sticky", top: 120 }}>
          <h2 style={{ margin: 0, fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(30px,4.2vw,62px)", lineHeight: 0.96, letterSpacing: "-.04em" }}>
            <span data-rv="line"><span><SectionHeading>Asked often</SectionHeading></span></span>
          </h2>
          <p
            data-rv="up"
            style={{
              ["--rv-i" as string]: 1,
              margin: "22px 0 0",
              maxWidth: "34ch",
              fontSize: "clamp(14px,1.15vw,17px)",
              lineHeight: 1.6,
              color: BODY_MUTED,
            }}
          >
            {standfirst}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", borderTop: `1px solid ${LINE}` }}>
          {questions.map((faq, i) => (
            <div key={i} data-faq="1" data-rv="left" style={{ ["--rv-i" as string]: i + 1, borderBottom: `1px solid ${LINE}` }}>
              <button
                type="button"
                data-action="toggle-faq"
                aria-expanded={i === 0}
                className="ab-faq-btn"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(14px,2vw,28px)",
                  padding: "26px 0",
                  background: "transparent",
                  border: 0,
                  textAlign: "left",
                  cursor: "pointer",
                  color: "#0E0E0E",
                }}
              >
                {/* Plus on the left, as a static list marker — it is the
                    circular chevron on the right that carries the open
                    state, so the two never contradict each other. */}
                <span
                  aria-hidden="true"
                  style={{ flex: "0 0 auto", position: "relative", width: 16, height: 16 }}
                >
                  <span style={{ position: "absolute", top: 7, left: 0, width: 16, height: 2, background: "#501EBD" }} />
                  <span style={{ position: "absolute", left: 7, top: 0, width: 2, height: 16, background: "#501EBD" }} />
                </span>
                <span
                  style={{
                    flex: 1,
                    fontFamily: displayFont,
                    fontWeight: 600,
                    fontSize: "clamp(17px,1.8vw,27px)",
                    letterSpacing: "-.02em",
                    lineHeight: 1.2,
                  }}
                >
                  {faq.question}
                </span>
                <span
                  data-faq-icon="1"
                  aria-hidden="true"
                  className="ab-faq-chevron"
                  style={{
                    flex: "0 0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 38,
                    height: 38,
                    borderRadius: 999,
                    background: "#501EBD",
                    color: "#fff",
                    fontSize: 15,
                    lineHeight: 1,
                    // Closed points down-right; the hook's 45° turn on open
                    // swings it to point up-right, reading as "collapse".
                    transition: "transform .4s cubic-bezier(.34,1.5,.64,1)",
                    transform: "rotate(0deg)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 3h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 3 3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div data-faq-body="1" style={{ maxHeight: 0, overflow: "hidden", transition: "max-height .5s cubic-bezier(.22,1,.36,1)" }}>
                <p
                  style={{
                    margin: 0,
                    // Indented to clear the plus marker so the answer reads
                    // as belonging to its question rather than to the list.
                    padding: "0 clamp(0px,6vw,64px) 30px calc(16px + clamp(14px,2vw,28px))",
                    maxWidth: "70ch",
                    fontSize: "clamp(14px,1.15vw,18px)",
                    lineHeight: 1.7,
                    color: BODY_MUTED,
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
