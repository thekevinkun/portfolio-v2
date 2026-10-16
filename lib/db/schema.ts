import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
// Relative imports on purpose: drizzle-kit loads this file without the @/ alias
import {
  EXPERIENCE_KINDS,
  type ExperienceProject,
} from "../../types/experience";
import type { ProjectDetails } from "../../types/details";
import type { SocialLink } from "../../types/profile";
import { PROJECT_STATUSES, type ProjectLink } from "../../types/projects";
import type { SkillItem, TechIconKey } from "../../types/skills";

export const projectStatusEnum = pgEnum("project_status", PROJECT_STATUSES);
export const experienceKindEnum = pgEnum("experience_kind", EXPERIENCE_KINDS);

// Shared column shapes (D65, D66)
const textList = (name: string) =>
  text(name)
    .array()
    .notNull()
    .default(sql`'{}'::text[]`);
const sort = () => integer("sort").notNull().default(0);
const visible = () => boolean("visible").notNull().default(true);

// "YYYY-MM" text (D45), checked so a hand edit can't store a typo
const yearMonth = sql.raw(`'^[0-9]{4}-(0[1-9]|1[0-2])$'`);

// One row, id fixed to 1
export const profile = pgTable(
  "profile",
  {
    id: integer("id").primaryKey().default(1),
    name: text("name").notNull(),
    username: text("username").notNull(),
    handle: text("handle").notNull(),
    roleLabel: text("role_label").notNull(),
    headline: text("headline").notNull(),
    intro: text("intro").notNull(),
    contactHeadline: text("contact_headline").notNull(),
    contactIntro: text("contact_intro").notNull(),
    locationLabel: text("location_label").notNull(),
    timezone: text("timezone").notNull(), // IANA id
    availability: text("availability").notNull(),
    availabilityShort: text("availability_short").notNull(),
    email: text("email").notNull(),
    avatarUrl: text("avatar_url"),
    portraitUrl: text("portrait_url"),
    resumeUrl: text("resume_url"),
    socials: jsonb("socials").$type<SocialLink[]>().notNull(),
    chips: text("chips").array().notNull(),
    focusAreas: text("focus_areas").array().notNull(),
    seoTitle: text("seo_title").notNull(),
    seoDescription: text("seo_description").notNull(),
  },
  (t) => [check("profile_singleton", sql`${t.id} = 1`)],
);

export const skillGroups = pgTable("skill_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  indexLabel: text("index_label").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  badge: text("badge").notNull(),
  iconKey: text("icon_key").$type<TechIconKey>().notNull(),
  items: jsonb("items").$type<SkillItem[]>().notNull(),
  highlights: textList("highlights"),
  sort: sort(),
  visible: visible(),
});

// The tabs on the Projects page (D105)
export const projectCategories = pgTable("project_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  sort: sort(),
  visible: visible(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  kicker: text("kicker").notNull(),
  summary: text("summary").notNull(),
  // A category slug; the foreign key keeps it valid
  filter: text("filter_type")
    .notNull()
    .references(() => projectCategories.slug),
  status: projectStatusEnum("status").notNull(),
  iconUrl: text("icon_url"),
  logoUrl: text("logo_url"),
  tech: textList("tech"),
  links: jsonb("links").$type<ProjectLink[]>().notNull(),
  // The structured write-up for the project overlay (D112); null = none
  details: jsonb("details").$type<ProjectDetails>(),
  featured: boolean("featured").notNull().default(false),
  sort: sort(),
  visible: visible(),
});

export const experienceItems = pgTable(
  "experience_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    kind: experienceKindEnum("kind").notNull(),
    title: text("title").notNull(),
    organization: text("organization").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date"), // null = present
    summary: text("summary").notNull(),
    summaryShort: text("summary_short"),
    bullets: textList("bullets"),
    shipped: jsonb("shipped").$type<ExperienceProject[]>(),
    tags: textList("tags"),
    sort: sort(),
    visible: visible(),
  },
  (t) => [
    check("experience_start_format", sql`${t.startDate} ~ ${yearMonth}`),
    check(
      "experience_end_format",
      sql`${t.endDate} is null or ${t.endDate} ~ ${yearMonth}`,
    ),
  ],
);
