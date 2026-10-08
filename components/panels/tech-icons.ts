import {
  Binary,
  Cloud,
  CreditCard,
  Database,
  Gem,
  HardHat,
  Link2,
  Monitor,
  Network,
  Plug,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import type { ComponentType } from "react";
import {
  SiDocker,
  SiExpress,
  SiFramer,
  SiGit,
  SiGithubactions,
  SiGraphql,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiRedis,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import type { TechIconKey } from "@/types/skills";

export type TechIcon = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

// Keys used by data/skill-groups.ts. Brand logos where the Simple Icons export
// is certain; lucide fallbacks for the rest. Index it directly
// (TECH_ICONS[key]): the Record type makes a missing key a compile error.
export const TECH_ICONS: Record<TechIconKey, TechIcon> = {
  // Group icons
  monitor: Monitor,
  terminal: Terminal,
  database: Database,
  zap: Zap,
  // Items
  nextjs: SiNextdotjs,
  react: SiReact,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  motion: SiFramer,
  nodejs: SiNodedotjs,
  express: SiExpress,
  api: Plug,
  graphql: SiGraphql,
  "credit-card": CreditCard,
  postgresql: SiPostgresql,
  supabase: SiSupabase,
  mongodb: SiMongodb,
  redis: SiRedis,
  vector: Network,
  openai: Sparkles,
  docker: SiDocker,
  vercel: SiVercel,
  aws: Cloud,
  "github-actions": SiGithubactions,
  solidity: Gem,
  hardhat: HardHat,
  wagmi: Link2,
  c: Binary,
  git: SiGit,
};
