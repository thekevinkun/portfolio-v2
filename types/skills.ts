// Keys into the icon map in components/panels/tech-icons.ts. A union, so a
// wrong key fails typecheck instead of failing at render.
export type TechIconKey =
  | "monitor"
  | "terminal"
  | "database"
  | "zap"
  | "nextjs"
  | "react"
  | "typescript"
  | "tailwind"
  | "motion"
  | "nodejs"
  | "express"
  | "api"
  | "graphql"
  | "credit-card"
  | "postgresql"
  | "supabase"
  | "mongodb"
  | "redis"
  | "vector"
  | "openai"
  | "docker"
  | "vercel"
  | "aws"
  | "github-actions"
  | "solidity"
  | "hardhat"
  | "wagmi"
  | "c"
  | "git";

// "used" = shipped in a real project · "learning" = not shipped yet (R4)
export type SkillStatus = "used" | "learning";

export type SkillItem = {
  name: string;
  iconKey: TechIconKey;
  status: SkillStatus;
};

export type SkillGroup = {
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
