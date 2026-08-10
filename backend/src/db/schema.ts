import { integer, pgTable, varchar, text, timestamp, serial } from "drizzle-orm/pg-core";

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
    label: varchar("label", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    tag: varchar("tag", { length: 255 }).notNull(),
    badge: varchar("badge", { length: 255 }).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. Selected Work Projects Table
export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    subtitle: varchar("subtitle", { length: 255 }).notNull(),
    ratio: varchar("ratio", { length: 20 }).notNull(),
    category: varchar("category", { length: 255 }).notNull(),
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
    sortOrder: integer("sort_order").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
