import { integer, pgTable, varchar, text, timestamp, serial, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

// 1. Hero Section Table
export const hero = pgTable("hero", {
    id: integer("id").primaryKey().default(1),
    location: varchar("location", { length: 255 }).notNull(),
    headlineLine1: varchar("headline_line1", { length: 255 }).notNull(),
    headlineLine2: varchar("headline_line2", { length: 255 }).notNull(),
    headlineLine3: varchar("headline_line3", { length: 255 }).notNull(),
    description: text("description").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Position Section Table (Brand Statement)
export const position = pgTable("position", {
    id: integer("id").primaryKey().default(1),
    statement: text("statement").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Capabilities Section Table (Pillars)
export const capabilities = pgTable("capabilities", {
    id: varchar("id", { length: 50 }).primaryKey(), // digital, identity, campaign, creative
    slotId: varchar("slot_id", { length: 10 }).notNull(), // 01, 02, 03, 04
    label: varchar("label", { length: 255 }).notNull().default(""),
    title: varchar("title", { length: 255 }).notNull().default(""),
    description: text("description").notNull().default(""),
    imageUrl: text("image_url").notNull().default(""),
    tag: varchar("tag", { length: 255 }).notNull().default(""),
    badge: varchar("badge", { length: 255 }).notNull().default(""),
    isBookmarked: boolean("is_bookmarked").notNull().default(false),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. Selected Work Projects Table
export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    subtitle: varchar("subtitle", { length: 255 }).notNull(),
    serviceType: varchar("service_type", { length: 255 }).notNull().default(""),
    startDate: varchar("start_date", { length: 100 }).notNull().default(""),
    endDate: varchar("end_date", { length: 100 }).notNull().default(""),
    client: varchar("client", { length: 255 }).notNull().default(""),
    clientType: varchar("client_type", { length: 50 }).notNull().default("brand"),
    ratio: varchar("ratio", { length: 20 }).notNull().default("16:10"),
    category: varchar("category", { length: 255 }).notNull().default("Digital Marketing"),
    logoUrl: text("logo_url").notNull().default(""),
    thumbnailUrl: text("thumbnail_url").notNull().default(""),
    videoThumbnailUrl: text("video_thumbnail_url").notNull().default(""),
    isBookmarked: boolean("is_bookmarked").notNull().default(false),
    bodySections: text("body_sections").notNull().default("[]"),
    sortOrder: integer("sort_order").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 5. FAQ Section Metadata
export const faqsMetadata = pgTable("faqs_metadata", {
    id: integer("id").primaryKey().default(1),
    badge: varchar("badge", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    buttonText: varchar("button_text", { length: 255 }).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 6. FAQ Section Items
export const faqsItems = pgTable("faqs_items", {
    id: serial("id").primaryKey(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    sortOrder: integer("sort_order").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 7. Process Steps Table
export const processSteps = pgTable("process_steps", {
    id: serial("id").primaryKey(),
    stepId: varchar("step_id", { length: 10 }).notNull(), // 01, 02, 03, 04
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    sortOrder: integer("sort_order").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 8. People Section Metadata
export const peopleMetadata = pgTable("people_metadata", {
    id: integer("id").primaryKey().default(1),
    extraCount: integer("extra_count").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 9. Team Members Table
export const teamMembers = pgTable("team_members", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 255 }).notNull(),
    description: text("description").notNull().default(""),
    avatarUrl: text("avatar_url").notNull().default(""),
    originalAvatarUrl: text("original_avatar_url").notNull().default(""),
    socials: text("socials").notNull().default("[]"),
    isBookmarked: boolean("is_bookmarked").notNull().default(false),
    sortOrder: integer("sort_order").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 10. Logos Table
export const logos = pgTable("logos", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    imageUrl: text("image_url").notNull().default(""), // base64 data URL of the logo image
    sortOrder: integer("sort_order").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 11. Stats Table
export const companyStats = pgTable("company_stats", {
    id: serial("id").primaryKey(),
    value: integer("value").notNull().default(0),
    suffix: varchar("suffix", { length: 50 }).notNull().default(""),
    display: varchar("display", { length: 50 }).notNull().default(""),
    label: varchar("label", { length: 255 }).notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 12. Testimonials Table
export const testimonials = pgTable("testimonials", {
    id: serial("id").primaryKey(),
    quote: text("quote").notNull().default(""),
    authorName: varchar("author_name", { length: 255 }).notNull().default(""),
    authorRole: varchar("author_role", { length: 255 }).notNull().default(""),
    theme: varchar("theme", { length: 20 }).notNull().default("light"),
    sortOrder: integer("sort_order").notNull().default(0),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 13. Careers Metadata Table
export const careersMetadata = pgTable("careers_metadata", {
    id: integer("id").primaryKey().default(1),
    badge: varchar("badge", { length: 255 }).notNull().default("CAREERS"),
    title: varchar("title", { length: 255 }).notNull().default("We are hiring"),
    description: text("description").notNull().default(""),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 14. Careers Roles Table
export const careersRoles = pgTable("careers_roles", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull().default(""),
    location: varchar("location", { length: 255 }).notNull().default(""),
    type: varchar("type", { length: 100 }).notNull().default("Full-time"),
    sortOrder: integer("sort_order").notNull().default(0),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 15. Contact Info Table
export const contactInfo = pgTable("contact_info", {
    id: integer("id").primaryKey().default(1),
    headlineLine1: varchar("headline_line1", { length: 255 }).notNull().default("Let's make"),
    headlineLine2: varchar("headline_line2", { length: 255 }).notNull().default("the thing."),
    description: text("description").notNull().default("Tell us what you are trying to launch and roughly when. You will get a scope and a number, not a deck."),
    email: varchar("email", { length: 255 }).notNull().default("abstraktcreation@gmail.com"),
    phone: varchar("phone", { length: 255 }).notNull().default("+977 9823901866"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 16. Contact Skills / CTA Pills Table
export const contactSkills = pgTable("contact_skills", {
    id: serial("id").primaryKey(),
    label: varchar("label", { length: 255 }).notNull(),
    accent: boolean("accent").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
