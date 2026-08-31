import React from "react";
import { displayFont, LINE, MUTED, BODY_MUTED } from "./tokens";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqV2Props {
  data?: { questions?: FaqItem[] };
}

export default function FaqV2({ data }: FaqV2Props) {
  const questions = data?.questions || [];
  if (questions.length === 0) return null;

  return (
    <section data-reveal="1" data-depth="1" data-screen-label="FAQ" style={{ maxWidth: 1680, margin: "0 auto", padding: "clamp(60px,9vh,110px) clamp(18px,3.6vw,60px)" }}>
      <div data-depth-inner="dim" style={{ display: "grid", gridTemplateColumns: "minmax(0,.8fr) minmax(0,1.8fr)", gap: "clamp(28px,4vw,72px)", alignItems: "start" }}>
        <div style={{ position: "sticky", top: 120 }}>
          <span data-rv="eyebrow" style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: MUTED, marginBottom: 14 }}>
            (08) QUESTIONS
          </span>
          <h2 style={{ margin: 0, fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(30px,4.2vw,62px)", lineHeight: 0.96, letterSpacing: "-.04em" }}>
            <span data-rv="line"><span>Asked often</span></span>
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", borderTop: `1px solid ${LINE}` }}>
          {questions.map((faq, i) => (
            <div key={i} data-faq="1" data-rv="left" style={{ ["--rv-i" as string]: i + 1, borderBottom: `1px solid ${LINE}` }}>
              <button
                type="button"
                data-action="toggle-faq"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 20,
                  padding: "24px 0",
                  background: "transparent",
                  border: 0,
                  textAlign: "left",
                  cursor: "pointer",
                  color: "#0E0E0E",
                }}
              >
                <span style={{ fontFamily: displayFont, fontWeight: 600, fontSize: "clamp(17px,1.8vw,27px)", letterSpacing: "-.02em" }}>
                  {faq.question}
                </span>
                <span data-faq-icon="1" style={{ flex: "0 0 auto", position: "relative", width: 18, height: 18, transition: "transform .4s cubic-bezier(.34,1.5,.64,1)" }}>
                  <span style={{ position: "absolute", top: 8, left: 0, width: 18, height: 2, background: "#501EBD" }} />
                  <span style={{ position: "absolute", left: 8, top: 0, width: 2, height: 18, background: "#501EBD" }} />
                </span>
              </button>
              <div data-faq-body="1" style={{ maxHeight: 0, overflow: "hidden", transition: "max-height .5s cubic-bezier(.22,1,.36,1)" }}>
                <p style={{ margin: 0, padding: "0 0 26px", maxWidth: "62ch", fontSize: "clamp(14px,1.15vw,18px)", lineHeight: 1.65, color: BODY_MUTED }}>
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
