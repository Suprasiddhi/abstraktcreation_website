import React from "react";
import { displayFont } from "./tokens";
import SkillsPhysics, { SkillPill } from "./SkillsPhysics";

/**
 * Contact, with the skills playground beside it.
 *
 * The physics box sits left of the contact block rather than in a section of
 * its own: it is the "here is what we handle" answer to the "project in
 * mind?" question the heading asks, and putting the two in one band means the
 * reader gets the capability list and the way to act on it in the same look.
 */
export interface ContactData {
  headlineLine1?: string;
  headlineLine2?: string;
  description?: string;
  email?: string;
  phone?: string;
  skills?: SkillPill[];
}

interface ContactV2Props {
  data?: ContactData;
}

export default function ContactV2({ data }: ContactV2Props) {
  const line1 = data?.headlineLine1 || "Let's make";
  const line2 = data?.headlineLine2 || "the thing.";
  const description = data?.description || "Tell us what you are trying to launch and roughly when. You will get a scope and a number, not a deck.";
  const email = data?.email || "abstraktcreation@gmail.com";
  const phone = data?.phone || "+977 9823901866";

  return (
    <section
      id="contact"
      data-reveal="1"
      data-depth="1"
      data-screen-label="Contact"
      data-nav-tone="dark"
      style={{ position: "relative", background: "#0E0E0E", color: "#F7F6F3", padding: "clamp(70px,12vh,150px) clamp(18px,3.6vw,60px)", scrollMarginTop: 0, overflow: "hidden" }}
    >
      <div data-depth-inner="1" style={{ position: "relative", maxWidth: 1680, margin: "0 auto" }}>
        {/* Playground left, the whole ask right. Collapses to one column below
            the breakpoint in v2-animations.css, where a split would leave the
            headline about six characters wide.

            `center` rather than `start`: the right column is the taller of the
            two, so aligning to the top left the playground's lower half — and
            once scrolled, its empty top edge — sitting beside the buttons with
            a long dead gap under it. Centred, the pile stays level with the
            ask no matter which column wins on height. The eyebrow-clearing
            offset that `start` needed is gone with it. */}
        <div
          className="ab-contact-split"
          style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(28px,4vw,64px)", alignItems: "center" }}
        >
          <div data-rv="up">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <span aria-hidden style={{ width: 28, height: 1, background: "#9A78F5", display: "block" }} />
              <span style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#9A78F5" }}>
                Project in mind?
              </span>
            </div>
            <SkillsPhysics skills={data?.skills} />
            <p style={{ margin: "14px 2px 0", fontSize: 13, color: "#6E6E6A" }}>
              Everything we handle, in one box. Drag them around.
            </p>
          </div>

          {/* The headline, the line under it and the two contact buttons are
              one column now. They used to be split: headline here, standfirst
              and buttons in a full-width row beneath the playground — which
              left the ask stranded a screen-width away from the sentence that
              set it up, and stretched a 44ch paragraph across the full 1680px
              container.

              The headline is no longer itself a mailto link. It sat inside an
              <a>, and the buttons cannot be nested inside another anchor
              without producing invalid markup; the email button directly below
              is the same destination, so nothing is lost. */}
          <div>
            <h2
              style={{ margin: 0, fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(40px,6.4vw,116px)", lineHeight: 0.9, letterSpacing: "-.045em", color: "#F7F6F3" }}
            >
              <span data-rv="line" style={{ ["--rv-i" as string]: 1 }}>
                <span>
                  {line1.includes("Let's") ? (
                    <>
                      <span style={{ color: "#9A78F5" }}>Let&apos;s</span>
                      {line1.replace("Let's", "")}
                    </>
                  ) : (
                    line1
                  )}
                </span>
              </span>
              <span data-rv="line" style={{ ["--rv-i" as string]: 2 }}><span>{line2}</span></span>
            </h2>

            <p
              data-rv="up"
              style={{ ["--rv-i" as string]: 4, margin: "clamp(22px,3.4vh,34px) 0 0", maxWidth: "40ch", fontSize: "clamp(15px,1.15vw,18px)", lineHeight: 1.6, color: "#9C9B95" }}
            >
              {description}
            </p>

            <div
              data-rv="up"
              style={{ ["--rv-i" as string]: 5, display: "flex", flexWrap: "wrap", gap: 10, marginTop: "clamp(22px,3.2vh,32px)" }}
            >
              {/* The label is wrapped in its own span: .ab-btn lifts every
                  direct child above the fill pseudo-element, and a bare text
                  node cannot be raised that way — it would be painted over as
                  the fill wipes across. */}
              {/* Ground and label colour live in .ab-btn--solid, NOT here:
                  an inline `color` outranks any stylesheet rule, so the
                  hover state's flip to ink never applied and the label stayed
                  white on the cream fill — invisible on hover. */}
              <a
                className="ab-btn ab-btn--solid"
                href={`mailto:${email}`}
                style={{ display: "inline-flex", alignItems: "center", height: 56, padding: "0 30px", borderRadius: 999, fontSize: 16, fontWeight: 600 }}
              >
                <span>{email}</span>
              </a>
              <a
                className="ab-btn ab-btn--ghost"
                href={`tel:${phone.replace(/\s+/g, "")}`}
                style={{ display: "inline-flex", alignItems: "center", height: 56, padding: "0 30px", borderRadius: 999, border: "1px solid #2A2A2A", color: "#F7F6F3", fontSize: 16, fontWeight: 600 }}
              >
                <span>{phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
