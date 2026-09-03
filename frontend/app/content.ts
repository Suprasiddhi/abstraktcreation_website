// Static content for the Home landing page — no backend/API involved.
// Copy is taken directly from the "Abstrakt Home" Claude Design source.

export const heroContent = {
  headlineLine1: "One studio for the site, the brand, and everything that carries it.",
  description:
    "Web solutions, brand systems, campaigns, video, 3D and sound. Built in house, from the first call to the thing that ships.",
};

export const positionContent = {
  statement:
    "We build the digital side of a business and the creative work around it. The site, the identity, the campaign, the content. One team, in house.",
};

export const logosContent = [
  { name: "VERTEX" },
  { name: "KINETIC" },
  { name: "APEX" },
  { name: "SPECTRUM" },
  { name: "COSMOS" },
  { name: "QUANTUM" },
  { name: "NEXUS" },
  { name: "ELEVATE" },
];

export const statsContent = [
  { value: 48, suffix: "+", label: "Projects shipped" },
  { value: 6, suffix: "", label: "Disciplines under one roof" },
  { value: 2, suffix: "", label: "Studios, one team" },
  { value: 4, suffix: " wks", label: "From brief to launch, typical" },
];

export const capabilitiesContent = {
  pillars: {
    digital: {
      id: "01",
      label: "LEADING",
      title: "DIGITAL",
      description:
        "High-performance web engineering and interface systems. Sites that load fast, scale cleanly and stay easy to run.",
      tag: "Web platforms, UI/UX systems",
    },
    identity: {
      id: "02",
      label: "SHAPING",
      title: "IDENTITY",
      description: "Brand architecture, bespoke type and art direction. A system your team can hold to, not a logo on a slide.",
      tag: "Brand systems, Typography",
    },
    campaign: {
      id: "03",
      label: "ENGAGING",
      title: "CAMPAIGN",
      description: "Digital marketing, funnel work and content that earns attention and then converts it. Measured, not guessed.",
      tag: "Performance, Content strategy",
    },
    creative: {
      id: "04",
      label: "EXPRESSING",
      title: "CREATIVE",
      description: "3D, video production, motion and sound design. The assets that make the rest of the work land.",
      tag: "Motion & 3D, Sound design",
    },
  },
};

export const workContent = {
  projects: [
    { id: 1, title: "Zuus x Shake Shaq", subtitle: "Cold-pressed juice x milkshake collab campaign", category: "Campaign", image: "/images/zuus-shakeshaq-campaign.png" },
    { id: 2, title: "Serena Moon", subtitle: "Private digital exhibition & membership site", category: "Digital", image: "/images/serena-moon-website.png" },
    { id: 3, title: "Arbitrary", subtitle: "Music platform — records, events, artists", category: "Digital", image: "/images/arbitrary-website.png" },
    { id: 4, title: "Zuus x Shake Shaq", subtitle: "Cold-pressed juice x milkshake collab campaign", category: "Campaign", image: "/images/zuus-shakeshaq-campaign.png" },
    { id: 5, title: "Serena Moon", subtitle: "Private digital exhibition & membership site", category: "Digital", image: "/images/serena-moon-website.png" },
  ],
};

export const processContent = {
  steps: [
    {
      id: "01",
      title: "Brief",
      description: "A call, a scope, a number. We tell you on the first call whether we are the right studio for it.",
    },
    { id: "02", title: "Plan", description: "Structure, references and a budget you sign off before anyone opens a file." },
    {
      id: "03",
      title: "Make",
      description: "Design, build, shoot, edit. One team, in house, with weekly review builds you can click.",
    },
    { id: "04", title: "Launch", description: "Ship it, measure it, keep it running. Handover docs included, retainer optional." },
  ],
};

export const peopleContent = {
  team: [
    {
      name: "Aabhiskar KC",
      role: "CEO",
      description: "Runs the studio and sits on every brief. If the scope changes, he is the one who tells you.",
    },
    {
      name: "Yashmine Gurung",
      role: "Creative Lead",
      description: "Holds the art direction across brand, campaign and film so the work looks like one studio made it.",
    },
    {
      name: "Nisika Shrestha",
      role: "People & Operations",
      description: "Hiring, onboarding and the reason projects have the right people on them in the right week.",
    },
    {
      name: "Nikhil Tuladhar",
      role: "Engineering",
      description: "Builds and maintains what we ship. Infrastructure, performance and the parts nobody sees.",
    },
  ],
};

export const testimonialsContent = [
  {
    quote:
      "They rebuilt the site and the brand in the same pass, so nothing felt bolted on. First month after launch, enquiries doubled.",
    authorName: "Kiran Gurung",
    authorRole: "Founder, Vertex",
    theme: "light" as const,
  },
  {
    quote: "The build is stable and the handover was clean. Our own team picked it up in a week without a single call.",
    authorName: "Sushma Bhandari",
    authorRole: "Product Lead, Kinetic",
    theme: "light" as const,
  },
  {
    quote:
      "We came for a video and left with a whole system: identity, site, launch campaign. One team, one invoice, one standard.",
    authorName: "Daniel Reyes",
    authorRole: "CMO, Apex",
    theme: "light" as const,
  },
  {
    quote: "Timelines held. That is rarer than it should be, and it is why we are on the third project with them.",
    authorName: "Priya Adhikari",
    authorRole: "Director, Spectrum",
    theme: "dark" as const,
  },
];

export const careersContent = {
  badge: "CAREERS",
  title: "We are hiring",
  description: "Send the project you are proudest of. If it is good we will find a seat for you, listed role or not.",
  roles: [
    { title: "Frontend Engineer", location: "Lalitpur", type: "Full-time" },
    { title: "Motion Designer", location: "Hybrid", type: "Full-time" },
    { title: "Growth Strategist", location: "Dallas", type: "Contract" },
  ],
};

export const hiringTeamContent = [
  { name: "Nisika Shrestha", role: "People & Operations", description: "Reads every application herself. Send work, not a cover letter." },
  { name: "Aabhiskar KC", role: "CEO", description: "Takes the second interview. Expect questions about how you decide, not what you know." },
];

export const faqContent = {
  questions: [
    {
      question: "What does Abstrakt actually do?",
      answer:
        "Web platforms and interface systems, brand identity, campaigns and content, plus 3D, video and sound. Most clients start with one and end up using three.",
    },
    {
      question: "How long does a project take?",
      answer:
        "A site or identity runs four to eight weeks. Larger platforms and multi-market campaigns run twelve or more. You get the phase dates before we start, not after.",
    },
    {
      question: "Do you work with clients outside Nepal?",
      answer: "Yes. We run from Lalitpur and Dallas, which covers US, European and South Asian hours between the two desks.",
    },
    {
      question: "How do you price?",
      answer: "Flat project fee or a monthly retainer. Either way the number is fixed at scoping and includes everything listed there.",
    },
  ],
};
