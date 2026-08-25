import React from "react";
import { PersonCard } from "./StudioV2";
import { displayFont } from "./tokens";

interface Role {
  title: string;
  location: string;
  type: string;
}

interface HiringMember {
  name: string;
  role: string;
  description?: string;
}

interface CareersV2Props {
  data?: { badge?: string; title?: string; description?: string; roles?: Role[] };
  hiringTeam?: HiringMember[];
}

const MARQUEE_ITEMS = ["OPEN ROLES", "SEND YOUR BEST WORK", "LALITPUR & DALLAS"];

export default function CareersV2({ data, hiringTeam = [] }: CareersV2Props) {
  const roles = data?.roles || [];

  return (
    <section
      id="careers"
      data-screen-label="Careers"
      style={{ position: "relative", margin: "clamp(30px,5vh,60px) clamp(18px,3.6vw,60px)", borderRadius: 28, overflow: "hidden", background: "#501EBD", color: "#ffffff", scrollMarginTop: 80 }}
    >
      <div style={{ position: "relative", padding: "clamp(40px,7vh,86px) clamp(22px,3.4vw,56px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(0,1fr)", gap: "clamp(28px,4vw,64px)", alignItems: "end" }}>
          <div>
            <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: "rgba(255,255,255,.72)", marginBottom: 16 }}>
              (07) {data?.badge || "CAREERS"}
            </span>
            <h2 style={{ margin: "0 0 22px", fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(32px,5.4vw,80px)", lineHeight: 0.94, letterSpacing: "-.04em" }}>
              {data?.title || "We are hiring"}
            </h2>
            <p style={{ margin: "0 0 26px", maxWidth: "40ch", fontSize: "clamp(15px,1.25vw,19px)", lineHeight: 1.6, color: "rgba(255,255,255,.82)" }}>
              {data?.description || "Send the project you are proudest of. If it is good we will find a seat for you, listed role or not."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, borderTop: "1px solid rgba(255,255,255,.24)" }}>
              {roles.map((role, i) => (
                <a
                  key={i}
                  href="#contact"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "16px 0",
                    borderBottom: "1px solid rgba(255,255,255,.24)",
                    color: "#ffffff",
                  }}
                >
                  <span style={{ fontFamily: displayFont, fontWeight: 600, fontSize: "clamp(17px,1.7vw,25px)" }}>{role.title}</span>
                  <span style={{ fontSize: 13, opacity: 0.75 }}>
                    {role.location} · {role.type} →
                  </span>
                </a>
              ))}
            </div>
          </div>
          {hiringTeam.length > 0 && (
            <div>
              <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".26em", color: "rgba(255,255,255,.72)", marginBottom: 16 }}>
                MEET THE HIRING TEAM
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 14 }}>
                {hiringTeam.map((member, i) => (
                  <PersonCard key={i} member={member} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ position: "relative", background: "#501EBD", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,.24)", padding: "14px 0" }}>
        <div style={{ display: "flex", width: "max-content", animation: "abMarqB 26s linear infinite" }}>
          {[0, 1].map((rep) => (
            <div key={rep} style={{ display: "flex", gap: 36, paddingRight: 36 }}>
              {MARQUEE_ITEMS.map((item, i) => (
                <React.Fragment key={i}>
                  <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(20px,2.4vw,34px)", letterSpacing: "-.02em", color: "rgba(255,255,255,.9)" }}>
                    {item}
                  </span>
                  <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(20px,2.4vw,34px)", color: "rgba(255,255,255,.35)" }}>·</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
