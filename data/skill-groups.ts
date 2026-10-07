import type { SkillGroup, SkillItem } from "@/types/skills";

export const skillGroups: SkillGroup[] = [
  {
    indexLabel: "01 / CLIENT & UI",
    title: "Frontend & Client UI",
    subtitle: "Interface layer",
    badge: "INTERFACE",
    iconKey: "monitor",
    items: [
      { name: "Next.js", iconKey: "nextjs", status: "used" },
      { name: "React", iconKey: "react", status: "used" },
      { name: "TypeScript", iconKey: "typescript", status: "used" },
      { name: "Tailwind CSS", iconKey: "tailwind", status: "used" },
      { name: "Framer Motion", iconKey: "motion", status: "used" },
    ],
    highlights: [
      "Server-rendered Next.js App Router apps deployed on Vercel",
      "In-browser PDF/EPUB book reader (Kun Bookshop)",
      "Figma-to-code landing pages with Framer Motion animations",
      "Interactive maps with Leaflet and Google Places (Carikopi)",
    ],
    sort: 1,
    visible: true,
  },
  {
    indexLabel: "02 / SERVER & APIS",
    title: "Backend & Runtime",
    subtitle: "Services and APIs",
    badge: "SERVICES",
    iconKey: "terminal",
    items: [
      { name: "Node.js", iconKey: "nodejs", status: "used" },
      { name: "Express", iconKey: "express", status: "used" },
      { name: "REST APIs", iconKey: "api", status: "used" },
      { name: "GraphQL", iconKey: "graphql", status: "used" },
      { name: "Payments", iconKey: "credit-card", status: "used" },
    ],
    highlights: [
      "Midtrans webhook validation and idempotent payment handling (Padel Court)",
      "Stripe checkout with secure file delivery (Kun Bookshop)",
      "JWT authentication with admin dashboards",
      "REST and GraphQL (Apollo Server) APIs (Kun Bookshop)",
    ],
    sort: 2,
    visible: true,
  },
  {
    indexLabel: "03 / DATA & STORAGE",
    title: "Data & Persistence",
    subtitle: "Databases and caching",
    badge: "PERSISTENCE",
    iconKey: "database",
    items: [
      { name: "PostgreSQL", iconKey: "postgresql", status: "used" },
      { name: "Supabase", iconKey: "supabase", status: "used" },
      { name: "MongoDB", iconKey: "mongodb", status: "used" },
      { name: "Redis", iconKey: "redis", status: "used" },
      { name: "pgvector", iconKey: "vector", status: "used" },
    ],
    highlights: [
      "Supabase Auth and Realtime subscriptions (Padel Court)",
      "pgvector embeddings for document-based AI answers (Kundesk)",
      "Neon PostgreSQL with Drizzle ORM (Kundesk)",
      "Server-side Redis caching (PacoMovies)",
    ],
    sort: 3,
    visible: true,
  },
  {
    indexLabel: "04 / AI & CLOUD",
    title: "AI & Cloud",
    subtitle: "Models and deployment",
    badge: "AI & OPS",
    iconKey: "zap",
    items: [
      { name: "OpenAI API", iconKey: "openai", status: "used" },
      { name: "Docker", iconKey: "docker", status: "used" },
      { name: "Vercel", iconKey: "vercel", status: "used" },
      { name: "AWS S3", iconKey: "aws", status: "used" },
      { name: "GitHub Actions", iconKey: "github-actions", status: "used" },
    ],
    highlights: [
      "AI assistants on OpenAI models (Kundesk, Kun Bookshop)",
      "Docker for Kun Bookshop; apps deployed on Vercel and Railway",
      "GitHub Actions CI/CD with Vitest and Playwright tests (Kundesk)",
      "AWS S3 file storage (Kundesk)",
    ],
    sort: 4,
    visible: true,
  },
];

// Optional bottom strip. Moves to the profile row when profile is extended.
export const techStrip: SkillItem[] = [
  { name: "Solidity", iconKey: "solidity", status: "used" },
  { name: "Hardhat", iconKey: "hardhat", status: "used" },
  { name: "Wagmi", iconKey: "wagmi", status: "used" },
  { name: "C / C++", iconKey: "c", status: "used" },
  { name: "Git", iconKey: "git", status: "used" },
];
