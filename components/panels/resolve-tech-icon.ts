import { TECH_ICON_KEYS, type TechIconKey } from "@/types/skills";
import { TECH_ICONS, type TechIcon } from "./tech-icons";

// The whole Simple Icons set from react-icons, looked up by export name
// ("SiPython"). Loaded on demand so its thousands of icons never join an
// initial bundle (D107).
export type SimpleIconSet = Record<string, TechIcon | undefined>;

export async function loadSimpleIcons(): Promise<SimpleIconSet> {
  const set = await import("react-icons/si");
  // The exports are components keyed by name; indexing them by a computed name
  // needs this widening
  return set as unknown as SimpleIconSet;
}

// Simple Icons spells symbols out: "Node.js" -> "nodedotjs", "C++" -> "cplusplus"
const SYMBOLS: [RegExp, string][] = [
  [/\+/g, "plus"],
  [/#/g, "sharp"],
  [/\./g, "dot"],
  [/&/g, "and"],
];

function toSlug(value: string): string {
  let slug = value.toLowerCase();
  for (const [pattern, word] of SYMBOLS) slug = slug.replace(pattern, word);
  return slug.replace(/[^a-z0-9]/g, "");
}

// Common spellings that differ from the Simple Icons name
const ALIASES: Record<string, string> = {
  nextjs: "nextdotjs",
  nodejs: "nodedotjs",
  expressjs: "express",
  vuejs: "vuedotjs",
  reactjs: "react",
  golang: "go",
  js: "javascript",
  ts: "typescript",
  postgres: "postgresql",
  mongo: "mongodb",
  k8s: "kubernetes",
  tailwind: "tailwindcss",
  framermotion: "framer",
};

// Words that often trail a tech name without being part of its logo name
const TRAILING_WORDS = ["api", "sdk", "js", "css", "framework", "library"];

function candidates(value: string): string[] {
  const full = toSlug(value);
  const list = [full, full.replace(/dotjs$/, "")];

  // "OpenAI API" -> "openai"
  const words = value.trim().split(/\s+/);
  const last = words.at(-1)?.toLowerCase();
  if (words.length > 1 && last && TRAILING_WORDS.includes(last)) {
    list.push(toSlug(words.slice(0, -1).join(" ")));
  }

  const withAliases = list.flatMap((slug) => [slug, ALIASES[slug] ?? ""]);
  return [...new Set(withAliases)].filter((slug) => slug !== "");
}

function findSimpleIcon(set: SimpleIconSet, value: string): TechIcon | null {
  for (const slug of candidates(value)) {
    const icon = set[`Si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`];
    if (icon) return icon;
  }
  return null;
}

const isBuiltInKey = (value: string): value is TechIconKey =>
  (TECH_ICON_KEYS as readonly string[]).includes(value);

// 1. a built-in key ("credit-card"), 2. a typed Simple Icons name, 3. the item
// name when the icon box is empty. null means "show the letter fallback".
export function resolveTechIcon(
  set: SimpleIconSet | null,
  name: string,
  iconKey: string,
): TechIcon | null {
  const typed = iconKey.trim();
  if (typed && isBuiltInKey(typed)) return TECH_ICONS[typed];
  if (!set) return null;
  return findSimpleIcon(set, typed || name);
}
