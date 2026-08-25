import React from "react";
import { displayFont, LINE, MUTED, BODY_MUTED } from "./tokens";

interface Step {
  id: string;
  title: string;
  description: string;
}

interface ProcessV2Props {
  data?: { steps: Step[] };
}

export default function ProcessV2({ data }: ProcessV2Props) {
  const steps = data?.steps || [];
  if (steps.length === 0) return null;

  return (
    <section data-proc-sec="1" data-screen-label="Process" style={{ position: "relative", padding: "clamp(70px,11vh,130px) 0" }}>
      <div style={{ maxWidth: 1680, margin: "0 auto", padding: "0 clamp(18px,3.6vw,60px)", display: "grid", gridTemplateColumns: "minmax(0,.9fr) minmax(0,2.1fr)", gap: "clamp(28px,5vw,80px)", alignItems: "start" }}>
        <div style={{ position: "sticky", top: 120 }}>
          <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: MUTED, marginBottom: 14 }}>
            (04) PROCESS
          </span>
          <h2 style={{ margin: "0 0 22px", fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(32px,4.6vw,68px)", lineHeight: 0.94, letterSpacing: "-.04em" }}>
            How it runs
          </h2>
          <p style={{ margin: 0, maxWidth: "30ch", fontSize: 15, lineHeight: 1.6, color: "#6B7280" }}>
            Four steps, no proposal theatre. You always know what is being made and what it costs.
          </p>
        </div>
        <div style={{ position: "relative", paddingLeft: "clamp(24px,3vw,52px)" }}>
          <div style={{ position: "absolute", left: 0, top: 6, bottom: 6, width: 2, background: LINE }}>
            <div data-proc-fill="1" style={{ width: "100%", height: "0%", background: "#501EBD" }} />
          </div>
          {steps.map((step, i) => (
            <div
              key={step.id}
              data-step="1"
              style={{ position: "relative", padding: i === steps.length - 1 ? 0 : "0 0 clamp(40px,7vh,80px)", transition: "opacity .5s", opacity: 0.4 }}
            >
              <span
                data-step-dot="1"
                style={{
                  position: "absolute",
                  left: "clamp(-24px,-3vw,-52px)",
                  top: 6,
                  marginLeft: -5,
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: LINE,
                  transition: "background .4s,transform .4s",
                }}
              />
              <span style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: ".2em", color: "#501EBD", marginBottom: 12 }}>{step.id}</span>
              <h3 style={{ margin: "0 0 10px", fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(24px,3.1vw,46px)", lineHeight: 1.02, letterSpacing: "-.03em" }}>
                {step.title}
              </h3>
              <p style={{ margin: 0, maxWidth: "46ch", fontSize: "clamp(14px,1.15vw,18px)", lineHeight: 1.6, color: BODY_MUTED }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
