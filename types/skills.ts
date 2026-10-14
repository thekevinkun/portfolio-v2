// Keys into the icon map in components/panels/tech-icons.ts. A tuple, so the
// Zod schema can read the same list and a wrong key fails typecheck (D64).
export const TECH_ICON_KEYS = [
  "monitor",
  "terminal",
  "database",
  "zap",
  "nextjs",
  "react",
  "typescript",
  "tailwind",
  "motion",
  "nodejs",
  "express",
  "api",
  "graphql",
  "credit-card",
  "postgresql",
  "supabase",
  "mongodb",
  "redis",
  "vector",
  "openai",
  "docker",
  "vercel",
  "aws",
  "github-actions",
  "solidity",
  "hardhat",
  "wagmi",
  "c",
  "git",
] as const;
export type TechIconKey = (typeof TECH_ICON_KEYS)[number];

// "used" = shipped in a real project · "learning" = not shipped yet (R4)
export const SKILL_STATUSES = ["used", "learning"] as const;
export type SkillStatus = (typeof SKILL_STATUSES)[number];

export type SkillItem = {
  name: string;
  // Empty = find the logo from the name (Simple Icons); otherwise a built-in
  // key (TECH_ICON_KEYS) or a Simple Icons name such as "python" (D107)
  iconKey: string;
  status: SkillStatus;
};

export type SkillGroup = {
  slug: string;
  indexLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  iconKey: TechIconKey;
  items: SkillItem[];
  highlights: string[];
  sort: number;
  visible: boolean;
};

// What the dashboard form edits; sort and visible have their own controls
export type SkillGroupContent = Omit<SkillGroup, "sort" | "visible">;

// The generic icons a group (not an item) can use
export const GROUP_ICON_KEYS = [
  "monitor",
  "terminal",
  "database",
  "zap",
] as const satisfies readonly TechIconKey[];
