import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log("DATABASE_URL connection string is loaded:", process.env.DATABASE_URL ? "YES" : "NO");
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import {
  hero,
  position,
  capabilities,
  projects,
  faqsMetadata,
  faqsItems,
  processSteps,
  peopleMetadata,
  teamMembers,
  logos,
  companyStats,
  testimonials,
  careersMetadata,
  careersRoles,
  contactInfo
} from './db/schema';

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const dbUrl = (process.env.DATABASE_URL || "").trim();
const poolConfig = {
  connectionString: dbUrl,
  ssl: dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') ? undefined : { rejectUnauthorized: false }
};

const pool = new pg.Pool(poolConfig);
const db = drizzle({ client: pool });

// Automatically ensure schema columns exist
async function initDbSchema() {
  try {
    await pool.query('ALTER TABLE capabilities ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT \'\';');
    await pool.query('ALTER TABLE capabilities ADD COLUMN IF NOT EXISTS is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE;');
    await pool.query('ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE;');
    await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT \'\';');
    await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS avatar_url TEXT NOT NULL DEFAULT \'\';');
    await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS original_avatar_url TEXT NOT NULL DEFAULT \'\';');
    await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS socials TEXT NOT NULL DEFAULT \'[]\';');
    await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE;');

    // Ensure new dynamic tables exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_stats (
        id SERIAL PRIMARY KEY,
        value INTEGER NOT NULL DEFAULT 0,
        suffix VARCHAR(50) NOT NULL DEFAULT '',
        display VARCHAR(50) NOT NULL DEFAULT '',
        label VARCHAR(255) NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        quote TEXT NOT NULL DEFAULT '',
        author_name VARCHAR(255) NOT NULL DEFAULT '',
        author_role VARCHAR(255) NOT NULL DEFAULT '',
        theme VARCHAR(20) NOT NULL DEFAULT 'light',
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS careers_metadata (
        id INTEGER PRIMARY KEY DEFAULT 1,
        badge VARCHAR(255) NOT NULL DEFAULT 'CAREERS',
        title VARCHAR(255) NOT NULL DEFAULT 'We are hiring',
        description TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS careers_roles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL DEFAULT '',
        location VARCHAR(255) NOT NULL DEFAULT '',
        type VARCHAR(100) NOT NULL DEFAULT 'Full-time',
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_info (
        id INTEGER PRIMARY KEY DEFAULT 1,
        headline_line1 VARCHAR(255) NOT NULL DEFAULT 'Let''s make',
        headline_line2 VARCHAR(255) NOT NULL DEFAULT 'the thing.',
        description TEXT NOT NULL DEFAULT '',
        email VARCHAR(255) NOT NULL DEFAULT 'abstraktcreation@gmail.com',
        phone VARCHAR(255) NOT NULL DEFAULT '+977 9823901866',
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Ensure default row for contact_info
    await pool.query(`
      INSERT INTO contact_info (id, headline_line1, headline_line2, description, email, phone)
      VALUES (1, 'Let''s make', 'the thing.', 'Tell us what you are trying to launch and roughly when. You will get a scope and a number, not a deck.', 'abstraktcreation@gmail.com', '+977 9823901866')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Ensure default row for careers_metadata
    await pool.query(`
      INSERT INTO careers_metadata (id, badge, title, description)
      VALUES (1, 'CAREERS', 'We are hiring', 'Send the project you are proudest of. If it is good we will find a seat for you, listed role or not.')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Ensure default company_stats if empty
    const statsRes = await pool.query('SELECT COUNT(*) FROM company_stats;');
    if (parseInt(statsRes.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO company_stats (value, suffix, display, label, sort_order) VALUES
        (30, '+', '', 'Projects Delivered', 0),
        (15, '+', '', 'Clients Worked With', 1),
        (6, '+', '', 'Creative Capabilities', 2),
        (0, '', '∞', 'Ideas Turned Real', 3);
      `);
    }

    // Ensure default testimonials if empty
    const testRes = await pool.query('SELECT COUNT(*) FROM testimonials;');
    if (parseInt(testRes.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO testimonials (quote, author_name, author_role, theme, sort_order) VALUES
        ('They rebuilt the site and the brand in the same pass, so nothing felt bolted on. First month after launch, enquiries doubled.', 'Kiran Gurung', 'Founder, Vertex', 'light', 0),
        ('The build is stable and the handover was clean. Our own team picked it up in a week without a single call.', 'Sushma Bhandari', 'Product Lead, Kinetic', 'light', 1),
        ('We came for a video and left with a whole system: identity, site, launch campaign. One team, one invoice, one standard.', 'Daniel Reyes', 'CMO, Apex', 'light', 2),
        ('Timelines held. That is rarer than it should be, and it is why we are on the third project with them.', 'Priya Adhikari', 'Director, Spectrum', 'dark', 3);
      `);
    }

    // Ensure default careers_roles if empty
    const rolesRes = await pool.query('SELECT COUNT(*) FROM careers_roles;');
    if (parseInt(rolesRes.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO careers_roles (title, location, type, sort_order) VALUES
        ('Frontend Engineer', 'Lalitpur', 'Full-time', 0),
        ('Motion Designer', 'Hybrid', 'Full-time', 1),
        ('Growth Strategist', 'Dallas', 'Contract', 2);
      `);
    }

    console.log("Database schema migration: successfully ensured all columns and dynamic tables.");
  } catch (err) {
    console.error("Database schema init warning:", err);
  }
}
initDbSchema();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-admin-password'],
}));
app.use(express.json({ limit: '10mb' }));

// Seeding function
async function seedDatabase() {
  if (process.env.SKIP_SEED === 'true') {
    console.log("Database seeding skipped via SKIP_SEED environment variable.");
    return;
  }
  console.log("Checking database content...");
  try {
    try {
      await pool.query('ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE;');
    } catch (e) {
      console.log("Column migration check:", e);
    }
    // 1. Seed Hero
    const heroCount = await db.select().from(hero);
    if (heroCount.length === 0) {
      console.log("Seeding default Hero content...");
      await db.insert(hero).values({
        id: 1,
        location: "SANEPA, NEPAL — DALLAS, TX",
        headlineLine1: "DESIGN.",
        headlineLine2: JSON.stringify(["BUILD.", "GROW."]),
        headlineLine3: "",
        description: "From web solutions and digital marketing to video, music, 3D and graphic design."
      });
    }

    // 2. Seed Position
    const positionCount = await db.select().from(position);
    if (positionCount.length === 0) {
      console.log("Seeding default Position content...");
      await db.insert(position).values({
        id: 1,
        statement: "We build the digital side of a business and the creative work that surrounds it — the site, the identity, the campaign and the content, from one team."
      });
    }

    // 3. Seed Capabilities
    const capabilitiesCount = await db.select().from(capabilities);
    if (capabilitiesCount.length === 0) {
      console.log("Seeding default Capabilities...");
      const defaultPillars = [
        {
          id: "digital",
          slotId: "01",
          label: "LEADING",
          title: "DIGITAL",
          description: "Web solutions — high-performance engineering and UI/UX systems, in the studio's own words.",
          imageUrl: "",
          tag: "Web Solutions",
          badge: "LEAD PILLAR — SWAPPABLE SLOT",
          isBookmarked: false
        },
        {
          id: "identity",
          slotId: "02",
          label: "SHAPING",
          title: "IDENTITY",
          description: "Brand architecture — premium corporate design systems, bespoke typography, and art direction.",
          imageUrl: "",
          tag: "Brand Architecture",
          badge: "BRAND SYSTEM — SWAPPABLE SLOT",
          isBookmarked: false
        },
        {
          id: "campaign",
          slotId: "03",
          label: "ENGAGING",
          title: "CAMPAIGN",
          description: "Creative storytelling — digital marketing, conversion funnel optimization, and content strategies.",
          imageUrl: "",
          tag: "Campaign Launch",
          badge: "MARKETING — SWAPPABLE SLOT",
          isBookmarked: false
        },
        {
          id: "creative",
          slotId: "04",
          label: "EXPRESSING",
          title: "CREATIVE",
          description: "Multimedia assets — 3D modeling, premium video production, sound design, and motion graphics.",
          imageUrl: "",
          tag: "Motion & 3D",
          badge: "CREATIVE — SWAPPABLE SLOT",
          isBookmarked: false
        }
      ];

      for (const pillar of defaultPillars) {
        await db.insert(capabilities).values(pillar);
      }
    }

    // 4. Seed Projects
    const projectsCount = await db.select().from(projects);
    if (projectsCount.length === 0) {
      console.log("Seeding default Projects...");
      const defaultProjects = [
        { title: "COSMOS AUDIO", subtitle: "3D soundscapes & motion scoring", ratio: "3:4", category: "CREATIVE", sortOrder: 0 },
        { title: "VERTEX PORTAL", subtitle: "Web3 finance interface & systems", ratio: "2:3", category: "DIGITAL", sortOrder: 1 },
        { title: "KINETIC ENGINE", subtitle: "Conversion growth systems", ratio: "4:3", category: "GROWTH", sortOrder: 2 },
        { title: "APEX IDENTITY", subtitle: "Corporate brand guidelines", ratio: "16:10", category: "DESIGN", sortOrder: 3 },
        { title: "NEXUS MOBILE", subtitle: "Cross-platform core application", ratio: "2:3", category: "DIGITAL", sortOrder: 4 }
      ];
      for (const p of defaultProjects) {
        await db.insert(projects).values(p);
      }
    }

    // 5. Seed FAQ Metadata
    const faqMetaCount = await db.select().from(faqsMetadata);
    if (faqMetaCount.length === 0) {
      console.log("Seeding default FAQ Metadata...");
      await db.insert(faqsMetadata).values({
        id: 1,
        badge: "GOT QUESTIONS?",
        title: "FREQUENTLY ASKED QUESTIONS",
        description: "Find answers to the most common questions about Abstrakt Creation and our comprehensive digital, creative, and branding services.",
        buttonText: "VIEW ALL FAQS +"
      });
    }

    // 6. Seed FAQ Items
    const faqItemsCount = await db.select().from(faqsItems);
    if (faqItemsCount.length === 0) {
      console.log("Seeding default FAQ items...");
      const defaultQuestions = [
        {
          question: "What services does Abstrakt Creation offer?",
          answer: "We provide end-to-end design, digital, growth, and creative solutions. This includes web application development, UI/UX systems, brand identity guidelines, marketing campaigns, 3D animations, video production, and sound design.",
          sortOrder: 0
        },
        {
          question: "How long does a typical project take?",
          answer: "Timelines vary depending on scope. A standard brand design or website development project usually takes between 4 to 8 weeks. Larger campaigns or complex Web3 platforms can take 12 weeks or more. We establish clear phases during planning.",
          sortOrder: 1
        },
        {
          question: "Do you work with international clients?",
          answer: "Yes, we work globally. We are physically situated in Lalitpur, Nepal and Dallas, Texas, allowing us to collaborate seamlessly with clients across the US, Europe, and South Asia.",
          sortOrder: 2
        },
        {
          question: "What is your pricing structure?",
          answer: "We operate on flat project-based pricing or ongoing monthly retainers depending on what fits your workflow. Every project starts with a detailed scoping phase where we provide a transparent, all-inclusive budget before starting.",
          sortOrder: 3
        }
      ];
      for (const q of defaultQuestions) {
        await db.insert(faqsItems).values(q);
      }
    }

    // 7. Seed Process Steps
    const processStepsCount = await db.select().from(processSteps);
    if (processStepsCount.length === 0) {
      console.log("Seeding default Process steps...");
      const defaultSteps = [
        { stepId: "01", title: "Brief", description: "A call, a scope, a number. No proposal theatre.", sortOrder: 0 },
        { stepId: "02", title: "Plan", description: "Structure, references and a budget you sign off.", sortOrder: 1 },
        { stepId: "03", title: "Make", description: "Design, build, shoot, edit. One team, in house.", sortOrder: 2 },
        { stepId: "04", title: "Launch", description: "Ship it, measure it, keep it running.", sortOrder: 3 }
      ];
      for (const step of defaultSteps) {
        await db.insert(processSteps).values(step);
      }
    }

    // 8. Seed People Metadata
    const peopleMetaCount = await db.select().from(peopleMetadata);
    if (peopleMetaCount.length === 0) {
      console.log("Seeding default People Metadata...");
      await db.insert(peopleMetadata).values({
        id: 1,
        extraCount: 6
      });
    }

    // 9. Seed Team Members
    const teamCount = await db.select().from(teamMembers);
    if (teamCount.length === 0) {
      console.log("Seeding default Team members...");
      const defaultTeam = [
        { name: "Aabhiskar KC", role: "CEO", sortOrder: 0 },
        { name: "Yashmine Gurung", role: "Creative Lead", sortOrder: 1 },
        { name: "Nisika Shrestha", role: "HR", sortOrder: 2 },
        { name: "Nikhil Tuladhar", role: "IT", sortOrder: 3 }
      ];
      for (const member of defaultTeam) {
        await db.insert(teamMembers).values(member);
      }
    }

    // 10. Seed Logos
    const logosCount = await db.select().from(logos);
    if (logosCount.length === 0) {
      console.log("Seeding default Logos...");
      const defaultLogos = [
        { name: "VERTEX", imageUrl: "", sortOrder: 0 },
        { name: "KINETIC", imageUrl: "", sortOrder: 1 },
        { name: "APEX", imageUrl: "", sortOrder: 2 },
        { name: "SPECTRUM", imageUrl: "", sortOrder: 3 },
        { name: "COSMOS", imageUrl: "", sortOrder: 4 },
        { name: "QUANTUM", imageUrl: "", sortOrder: 5 },
        { name: "NEXUS", imageUrl: "", sortOrder: 6 },
        { name: "ELEVATE", imageUrl: "", sortOrder: 7 }
      ];
      for (const logo of defaultLogos) {
        await db.insert(logos).values(logo);
      }
    }

    // 11. Seed Stats
    const statsCount = await db.select().from(companyStats);
    if (statsCount.length === 0) {
      console.log("Seeding default Company Stats...");
      const defaultStats = [
        { value: 30, suffix: "+", display: "", label: "Projects Delivered", sortOrder: 0 },
        { value: 15, suffix: "+", display: "", label: "Clients Worked With", sortOrder: 1 },
        { value: 6, suffix: "+", display: "", label: "Creative Capabilities", sortOrder: 2 },
        { value: 0, suffix: "", display: "∞", label: "Ideas Turned Real", sortOrder: 3 },
      ];
      for (const s of defaultStats) {
        await db.insert(companyStats).values(s);
      }
    }

    // 12. Seed Testimonials
    const testimonialsCount = await db.select().from(testimonials);
    if (testimonialsCount.length === 0) {
      console.log("Seeding default Testimonials...");
      const defaultTestimonials = [
        {
          quote: "They rebuilt the site and the brand in the same pass, so nothing felt bolted on. First month after launch, enquiries doubled.",
          authorName: "Kiran Gurung",
          authorRole: "Founder, Vertex",
          theme: "light",
          sortOrder: 0
        },
        {
          quote: "The build is stable and the handover was clean. Our own team picked it up in a week without a single call.",
          authorName: "Sushma Bhandari",
          authorRole: "Product Lead, Kinetic",
          theme: "light",
          sortOrder: 1
        },
        {
          quote: "We came for a video and left with a whole system: identity, site, launch campaign. One team, one invoice, one standard.",
          authorName: "Daniel Reyes",
          authorRole: "CMO, Apex",
          theme: "light",
          sortOrder: 2
        },
        {
          quote: "Timelines held. That is rarer than it should be, and it is why we are on the third project with them.",
          authorName: "Priya Adhikari",
          authorRole: "Director, Spectrum",
          theme: "dark",
          sortOrder: 3
        }
      ];
      for (const t of defaultTestimonials) {
        await db.insert(testimonials).values(t);
      }
    }

    // 13. Seed Careers Metadata
    const careersMetaCount = await db.select().from(careersMetadata);
    if (careersMetaCount.length === 0) {
      console.log("Seeding default Careers metadata...");
      await db.insert(careersMetadata).values({
        id: 1,
        badge: "CAREERS",
        title: "We are hiring",
        description: "Send the project you are proudest of. If it is good we will find a seat for you, listed role or not."
      });
    }

    // 14. Seed Careers Roles
    const careersRolesCount = await db.select().from(careersRoles);
    if (careersRolesCount.length === 0) {
      console.log("Seeding default Careers roles...");
      const defaultRoles = [
        { title: "Frontend Engineer", location: "Lalitpur", type: "Full-time", sortOrder: 0 },
        { title: "Motion Designer", location: "Hybrid", type: "Full-time", sortOrder: 1 },
        { title: "Growth Strategist", location: "Dallas", type: "Contract", sortOrder: 2 }
      ];
      for (const r of defaultRoles) {
        await db.insert(careersRoles).values(r);
      }
    }

    // 15. Seed Contact Info
    const contactCount = await db.select().from(contactInfo);
    if (contactCount.length === 0) {
      console.log("Seeding default Contact info...");
      await db.insert(contactInfo).values({
        id: 1,
        headlineLine1: "Let's make",
        headlineLine2: "the thing.",
        description: "Tell us what you are trying to launch and roughly when. You will get a scope and a number, not a deck.",
        email: "abstraktcreation@gmail.com",
        phone: "+977 9823901866"
      });
    }

    console.log("Database seed verification complete.");
  } catch (error) {
    console.error("Database seed failed. Make sure to run 'pnpm run db:push'.", error);
  }
}

let cachedContentData: any = null;

// REST GET: Fetch all sections
app.get('/api/content', async (req, res) => {
  try {
    if (cachedContentData) {
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.json(cachedContentData);
    }
    const [
      heroRows,
      positionRows,
      capabilitiesRows,
      projectRows,
      faqMetaRows,
      faqItemRows,
      processRows,
      peopleMetaRows,
      teamRows,
      logoRows,
      statRows,
      testimonialRows,
      careersMetaRows,
      careersRoleRows,
      contactRows
    ] = await Promise.all([
      db.select().from(hero),
      db.select().from(position),
      db.select().from(capabilities),
      db.select().from(projects),
      db.select().from(faqsMetadata),
      db.select().from(faqsItems),
      db.select().from(processSteps),
      db.select().from(peopleMetadata),
      db.select().from(teamMembers),
      db.select().from(logos),
      db.select().from(companyStats),
      db.select().from(testimonials),
      db.select().from(careersMetadata),
      db.select().from(careersRoles),
      db.select().from(contactInfo)
    ]);

    // Format & sort arrays
    const subHeadlineLines = (() => {
      try {
        const val = heroRows[0]?.headlineLine2 || "";
        if (val.startsWith("[")) {
          return JSON.parse(val);
        }
      } catch (e) {}
      return [heroRows[0]?.headlineLine2, heroRows[0]?.headlineLine3].filter(Boolean);
    })();

    const formattedHero = heroRows[0] ? {
      location: heroRows[0].location,
      headlineLine1: heroRows[0].headlineLine1,
      subHeadlineLines: subHeadlineLines,
      headlineLines: [heroRows[0].headlineLine1, ...subHeadlineLines],
      description: heroRows[0].description
    } : undefined;

    const formattedPosition = positionRows[0] ? {
      statement: positionRows[0].statement
    } : undefined;

    const formattedCapabilities = {
      pillars: capabilitiesRows.reduce((acc, row) => {
        acc[row.id] = {
          id: row.slotId,
          label: row.label,
          title: row.title,
          description: row.description,
          imageUrl: row.imageUrl || "",
          tag: row.tag,
          badge: row.badge,
          isBookmarked: Boolean(row.isBookmarked)
        };
        return acc;
      }, {} as Record<string, any>)
    };

    const getProjectDateVal = (p: any) => {
      const end = (p.endDate || "").trim().toLowerCase();
      const start = (p.startDate || "").trim().toLowerCase();
      if (end.includes("present") || end.includes("current") || start.includes("present") || start.includes("current")) {
        return 999999;
      }
      const matches = `${end} ${start}`.match(/\b(19|20)\d{2}\b/g);
      if (matches && matches.length > 0) {
        return Math.max(...matches.map(y => parseInt(y, 10)));
      }
      return 0;
    };

    const formattedWork = {
      projects: projectRows
        .sort((a, b) => {
          if (Boolean(a.isBookmarked) !== Boolean(b.isBookmarked)) {
            return a.isBookmarked ? -1 : 1;
          }
          const dateA = getProjectDateVal(a);
          const dateB = getProjectDateVal(b);
          if (dateA !== dateB) {
            return dateB - dateA;
          }
          return a.sortOrder - b.sortOrder;
        })
        .map(p => ({
          id: p.id,
          title: p.title || "",
          subtitle: p.subtitle || "",
          serviceType: p.serviceType || "",
          startDate: p.startDate || "",
          endDate: p.endDate || "",
          client: p.client || "",
          clientType: p.clientType || "brand",
          ratio: p.ratio || "16:10",
          category: p.category || "Digital Marketing",
          logoUrl: p.logoUrl || "",
          thumbnailUrl: p.thumbnailUrl || "",
          videoThumbnailUrl: p.videoThumbnailUrl || "",
          isBookmarked: Boolean(p.isBookmarked),
          bodySections: (() => {
            try {
              return JSON.parse(p.bodySections || "[]");
            } catch {
              return [];
            }
          })()
        }))
    };

    const formattedFaq = faqMetaRows[0] ? {
      badge: faqMetaRows[0].badge,
      title: faqMetaRows[0].title,
      description: faqMetaRows[0].description,
      buttonText: faqMetaRows[0].buttonText,
      questions: faqItemRows
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(q => ({
          question: q.question,
          answer: q.answer
        }))
    } : undefined;

    const formattedProcess = {
      steps: processRows
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(s => ({
          id: s.stepId,
          title: s.title,
          description: s.description
        }))
    };

    const formattedPeople = peopleMetaRows[0] ? {
      team: teamRows
        .sort((a, b) => {
          if (Boolean(a.isBookmarked) !== Boolean(b.isBookmarked)) {
            return a.isBookmarked ? -1 : 1;
          }
          return a.sortOrder - b.sortOrder;
        })
        .map(m => ({
          name: m.name || "",
          role: m.role || "",
          description: m.description || "",
          avatarUrl: m.avatarUrl || "",
          originalAvatarUrl: m.originalAvatarUrl || "",
          isBookmarked: Boolean(m.isBookmarked),
          socials: (() => {
            try {
              return JSON.parse(m.socials || "[]");
            } catch {
              return [];
            }
          })()
        })),
      extraCount: peopleMetaRows[0].extraCount
    } : undefined;

    const formattedLogos = logoRows
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(logo => ({
        id: logo.id,
        name: logo.name,
        imageUrl: logo.imageUrl
      }));

    const formattedStats = statRows
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(s => ({
        id: s.id,
        value: s.value,
        suffix: s.suffix,
        display: s.display || undefined,
        label: s.label
      }));

    const formattedTestimonials = testimonialRows
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(t => ({
        id: t.id,
        quote: t.quote,
        authorName: t.authorName,
        authorRole: t.authorRole,
        theme: (t.theme as "light" | "dark") || "light"
      }));

    const formattedCareers = {
      badge: careersMetaRows[0]?.badge || "CAREERS",
      title: careersMetaRows[0]?.title || "We are hiring",
      description: careersMetaRows[0]?.description || "",
      roles: careersRoleRows
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(r => ({
          id: r.id,
          title: r.title,
          location: r.location,
          type: r.type
        }))
    };

    const formattedContact = {
      headlineLine1: contactRows[0]?.headlineLine1 || "Let's make",
      headlineLine2: contactRows[0]?.headlineLine2 || "the thing.",
      description: contactRows[0]?.description || "Tell us what you are trying to launch and roughly when. You will get a scope and a number, not a deck.",
      email: contactRows[0]?.email || "abstraktcreation@gmail.com",
      phone: contactRows[0]?.phone || "+977 9823901866"
    };

    const responseData = {
      hero: formattedHero,
      position: formattedPosition,
      capabilities: formattedCapabilities,
      work: formattedWork,
      faq: formattedFaq,
      process: formattedProcess,
      people: formattedPeople,
      logos: formattedLogos,
      stats: formattedStats,
      testimonials: formattedTestimonials,
      careers: formattedCareers,
      contact: formattedContact
    };

    cachedContentData = responseData;
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(responseData);
  } catch (error) {
    console.error("Failed to load site content from database tables:", error);
    res.status(500).json({ error: "Failed to load dynamic site content" });
  }
});

// REST POST: Verify admin password
app.post('/api/auth/verify', (req, res) => {
  const { password } = req.body;
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === expectedPassword) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid password' });
  }
});

// REST POST: Clear all data from all sections
app.post('/api/content/clear', async (req, res) => {
  const password = req.headers['x-admin-password'];

  // Check admin password
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (password !== expectedPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid password' });
  }

  try {
    // 1. Clear Hero
    await db.update(hero)
      .set({
        location: "",
        headlineLine1: "",
        headlineLine2: "[]",
        headlineLine3: "",
        description: "",
        updatedAt: new Date()
      })
      .where(eq(hero.id, 1));

    // 2. Clear Position
    await db.update(position)
      .set({
        statement: "",
        updatedAt: new Date()
      })
      .where(eq(position.id, 1));

    // 3. Clear Capabilities (reset values of digital, identity, campaign, creative)
    await db.delete(capabilities);
    const defaultKeys = ['digital', 'identity', 'campaign', 'creative'];
    const slotIds = ['01', '02', '03', '04'];
    const labels = ['LEADING', 'SHAPING', 'ENGAGING', 'EXPRESSING'];
    for (let i = 0; i < defaultKeys.length; i++) {
      await db.insert(capabilities).values({
        id: defaultKeys[i],
        slotId: slotIds[i],
        label: labels[i],
        title: "",
        description: "",
        imageUrl: "",
        tag: "",
        badge: "",
        isBookmarked: false
      });
    }

    // 4. Delete all Projects
    await db.delete(projects);

    // 5. Clear FAQ Metadata
    await db.update(faqsMetadata)
      .set({
        badge: "",
        title: "",
        description: "",
        buttonText: "",
        updatedAt: new Date()
      })
      .where(eq(faqsMetadata.id, 1));

    // 6. Delete all FAQ items
    await db.delete(faqsItems);

    // 7. Delete all Process steps
    await db.delete(processSteps);

    // 8. Clear People Metadata
    await db.update(peopleMetadata)
      .set({
        extraCount: 0,
        updatedAt: new Date()
      })
      .where(eq(peopleMetadata.id, 1));

    // 9. Delete all Team members
    await db.delete(teamMembers);

    // 10. Delete all Logos
    await db.delete(logos);

    // 11. Delete all Stats
    await db.delete(companyStats);

    // 12. Delete all Testimonials
    await db.delete(testimonials);

    // 13. Clear Careers Metadata & Delete Roles
    await db.update(careersMetadata)
      .set({
        badge: "",
        title: "",
        description: "",
        updatedAt: new Date()
      })
      .where(eq(careersMetadata.id, 1));
    await db.delete(careersRoles);

    // 14. Clear Contact Info
    await db.update(contactInfo)
      .set({
        headlineLine1: "",
        headlineLine2: "",
        description: "",
        email: "",
        phone: "",
        updatedAt: new Date()
      })
      .where(eq(contactInfo.id, 1));

    console.log("Database cleared successfully by admin.");
    cachedContentData = null;
    res.json({ success: true, message: "All content cleared successfully. Ready for manual input." });
  } catch (error: any) {
    console.error("Failed to clear database:", error);
    res.status(500).json({ error: `Failed to clear content: ${error.message || error}` });
  }
});

// REST POST: Save changes to a specific section in its respective SQL table
app.post('/api/content/:id', async (req, res) => {
  const { id } = req.params;
  const contentBody = req.body;
  const password = req.headers['x-admin-password'];

  // Check admin password
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (password !== expectedPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid password' });
  }

  if (!contentBody) {
    return res.status(400).json({ error: 'Missing content body' });
  }

  try {
    if (id === 'hero') {
      const headlineLine1 = contentBody.headlineLine1 !== undefined ? contentBody.headlineLine1 : (contentBody.headlineLines?.[0] || "");
      let headlineLine2 = "[]";
      if (contentBody.subHeadlineLines) {
        headlineLine2 = JSON.stringify(contentBody.subHeadlineLines);
      } else if (contentBody.headlineLines) {
        headlineLine2 = JSON.stringify(contentBody.headlineLines.slice(1));
      }
      await db.update(hero)
        .set({
          location: contentBody.location,
          headlineLine1: headlineLine1,
          headlineLine2: headlineLine2,
          headlineLine3: "",
          description: contentBody.description,
          updatedAt: new Date()
        })
        .where(eq(hero.id, 1));
    }
    else if (id === 'position') {
      await db.update(position)
        .set({
          statement: contentBody.statement,
          updatedAt: new Date()
        })
        .where(eq(position.id, 1));
    }
    else if (id === 'capabilities') {
      try {
        await pool.query('ALTER TABLE capabilities ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT \'\';');
        await pool.query('ALTER TABLE capabilities ADD COLUMN IF NOT EXISTS is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE;');
      } catch (e) {
        console.error("Column check error on capabilities save:", e);
      }
      await db.delete(capabilities);
      for (const [key, pillar] of Object.entries(contentBody.pillars)) {
        const p = pillar as any;
        await db.insert(capabilities).values({
          id: key,
          slotId: p.id || "",
          label: p.label || "",
          title: p.title || "",
          description: p.description || "",
          imageUrl: p.imageUrl || "",
          tag: p.tag || "",
          badge: p.badge || "",
          isBookmarked: Boolean(p.isBookmarked)
        });
      }
    }
    else if (id === 'work') {
      try {
        await pool.query('ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE;');
      } catch (e) {
        console.error("Column check error on work save:", e);
      }
      await db.delete(projects);
      const projectsList = Array.isArray(contentBody)
        ? contentBody
        : Array.isArray(contentBody.projects)
        ? contentBody.projects
        : [];
      for (let i = 0; i < projectsList.length; i++) {
        const p = projectsList[i];
        const sectionsStr = typeof p.bodySections === "string"
          ? p.bodySections
          : JSON.stringify(p.bodySections || []);

        await db.insert(projects).values({
          title: p.title || "",
          subtitle: p.subtitle || "",
          serviceType: p.serviceType || "",
          startDate: p.startDate || "",
          endDate: p.endDate || "",
          client: p.client || "",
          clientType: p.clientType || "brand",
          ratio: p.ratio || "16:10",
          category: p.category || "Digital Marketing",
          logoUrl: p.logoUrl || "",
          thumbnailUrl: p.thumbnailUrl || "",
          videoThumbnailUrl: p.videoThumbnailUrl || "",
          isBookmarked: Boolean(p.isBookmarked),
          bodySections: sectionsStr,
          sortOrder: i
        });
      }
    }
    else if (id === 'faq') {
      const badge = contentBody.badge || "GOT QUESTIONS?";
      const title = contentBody.title || "FREQUENTLY ASKED QUESTIONS";
      const description = contentBody.description || "Find answers to the most common questions about Abstrakt Creation and our comprehensive digital, creative, and branding services.";
      const buttonText = contentBody.buttonText || "VIEW ALL FAQS +";

      await db.update(faqsMetadata)
        .set({
          badge,
          title,
          description,
          buttonText,
          updatedAt: new Date()
        })
        .where(eq(faqsMetadata.id, 1));

      await db.delete(faqsItems);
      const questionsList = contentBody.questions || (Array.isArray(contentBody) ? contentBody : []);
      for (let i = 0; i < questionsList.length; i++) {
        const q = questionsList[i];
        await db.insert(faqsItems).values({
          question: q.question,
          answer: q.answer,
          sortOrder: i
        });
      }
    }
    else if (id === 'process') {
      await db.delete(processSteps);
      for (let i = 0; i < contentBody.steps.length; i++) {
        const step = contentBody.steps[i];
        await db.insert(processSteps).values({
          stepId: step.id,
          title: step.title,
          description: step.description,
          sortOrder: i
        });
      }
    }
    else if (id === 'people') {
      try {
        await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT \'\';');
        await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS avatar_url TEXT NOT NULL DEFAULT \'\';');
        await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS original_avatar_url TEXT NOT NULL DEFAULT \'\';');
        await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS socials TEXT NOT NULL DEFAULT \'[]\';');
        await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE;');
      } catch (e) {
        console.error("Column check error on people save:", e);
      }

      await db.update(peopleMetadata)
        .set({
          extraCount: contentBody.extraCount !== undefined ? contentBody.extraCount : 0,
          updatedAt: new Date()
        })
        .where(eq(peopleMetadata.id, 1));

      await db.delete(teamMembers);
      const teamList = Array.isArray(contentBody.team) ? contentBody.team : [];
      for (let i = 0; i < teamList.length; i++) {
        const m = teamList[i];
        const socialsStr = typeof m.socials === "string"
          ? m.socials
          : JSON.stringify(m.socials || []);

        await db.insert(teamMembers).values({
          name: m.name || "",
          role: m.role || "",
          description: m.description || "",
          avatarUrl: m.avatarUrl || "",
          originalAvatarUrl: m.originalAvatarUrl || "",
          isBookmarked: Boolean(m.isBookmarked),
          socials: socialsStr,
          sortOrder: i
        });
      }
    }
    else if (id === 'logos') {
      await db.delete(logos);
      const logosList = Array.isArray(contentBody)
        ? contentBody
        : Array.isArray(contentBody.logos)
        ? contentBody.logos
        : [];
      for (let i = 0; i < logosList.length; i++) {
        const logo = logosList[i];
        await db.insert(logos).values({
          name: logo.name || "",
          imageUrl: logo.imageUrl || "",
          sortOrder: i
        });
      }
    }
    else if (id === 'stats') {
      await db.delete(companyStats);
      const statsList = Array.isArray(contentBody)
        ? contentBody
        : Array.isArray(contentBody.stats)
        ? contentBody.stats
        : [];
      for (let i = 0; i < statsList.length; i++) {
        const s = statsList[i];
        await db.insert(companyStats).values({
          value: typeof s.value === 'number' ? s.value : parseInt(s.value, 10) || 0,
          suffix: s.suffix || "",
          display: s.display || "",
          label: s.label || "",
          sortOrder: i
        });
      }
    }
    else if (id === 'testimonials') {
      await db.delete(testimonials);
      const testList = Array.isArray(contentBody)
        ? contentBody
        : Array.isArray(contentBody.testimonials)
        ? contentBody.testimonials
        : [];
      for (let i = 0; i < testList.length; i++) {
        const t = testList[i];
        await db.insert(testimonials).values({
          quote: t.quote || "",
          authorName: t.authorName || "",
          authorRole: t.authorRole || "",
          theme: t.theme || "light",
          sortOrder: i
        });
      }
    }
    else if (id === 'careers') {
      const badge = contentBody.badge || "CAREERS";
      const title = contentBody.title || "We are hiring";
      const description = contentBody.description || "";

      await db.update(careersMetadata)
        .set({
          badge,
          title,
          description,
          updatedAt: new Date()
        })
        .where(eq(careersMetadata.id, 1));

      await db.delete(careersRoles);
      const rolesList = contentBody.roles || (Array.isArray(contentBody) ? contentBody : []);
      for (let i = 0; i < rolesList.length; i++) {
        const r = rolesList[i];
        await db.insert(careersRoles).values({
          title: r.title || "",
          location: r.location || "",
          type: r.type || "Full-time",
          sortOrder: i
        });
      }
    }
    else if (id === 'contact') {
      await db.update(contactInfo)
        .set({
          headlineLine1: contentBody.headlineLine1 || "",
          headlineLine2: contentBody.headlineLine2 || "",
          description: contentBody.description || "",
          email: contentBody.email || "",
          phone: contentBody.phone || "",
          updatedAt: new Date()
        })
        .where(eq(contactInfo.id, 1));
    } else {
      return res.status(400).json({ error: `Invalid section ID: '${id}'` });
    }

    cachedContentData = null;
    res.json({ success: true, message: `Section '${id}' updated successfully.` });
  } catch (error: any) {
    console.error(`Failed to update SQL table for section '${id}':`, error);
    res.status(500).json({ error: `Failed to update section content: ${error.message || error}` });
  }
});

app.listen(port, async () => {
  console.log(`Backend Express server is running on http://localhost:${port}`);
  await seedDatabase();
});
