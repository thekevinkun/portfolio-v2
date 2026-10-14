import { TECH_ICON_KEYS, type TechIconKey } from "@/types/skills";
import { TECH_ICONS, type TechIcon } from "./tech-icons";

// Icon name -> component. Simple Icons are keyed by export name ("SiPython");
// lucide by the lower-case, letters-and-digits form of its name ("shieldcheck").
type IconIndex = Record<string, TechIcon | undefined>;

export interface IconSets {
  simple: IconIndex;
  lucide: IconIndex;
}

const isIconComponent = (value: unknown): value is TechIcon =>
  typeof value === "function" ||
  (typeof value === "object" && value !== null && "$$typeof" in value);

// "ShieldCheck" -> "shieldcheck": the same form as a typed "shield-check"
const toPlain = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

// Every icon export of lucide-react (PascalCase names); helpers and providers
// are skipped
function indexLucide(namespace: Record<string, unknown>): IconIndex {
  const index: IconIndex = {};
  for (const [name, value] of Object.entries(namespace)) {
    if (!/^[A-Z]/.test(name) || name.endsWith("Provider")) continue;
    if (isIconComponent(value)) index[toPlain(name)] = value;
  }
  return index;
}

// Loaded on demand and once, so the thousands of icons never join an initial
// bundle (D107): on the server for the public cards, in the browser only in
// the dashboard editor.
let cached: Promise<IconSets> | null = null;

export function loadIconSets(): Promise<IconSets> {
  cached ??= (async () => {
    const [simple, lucide] = await Promise.all([
      import("react-icons/si"),
      import("lucide-react"),
    ]);
    return {
      simple: simple as unknown as IconIndex,
      lucide: indexLucide(lucide as unknown as Record<string, unknown>),
    };
  })();
  return cached;
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

function findSimpleIcon(index: IconIndex, value: string): TechIcon | null {
  for (const slug of candidates(value)) {
    const icon = index[`Si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`];
    if (icon) return icon;
  }
  return null;
}

function findLucideIcon(index: IconIndex, value: string): TechIcon | null {
  return index[toPlain(value)] ?? null;
}

const isBuiltInKey = (value: string): value is TechIconKey =>
  (TECH_ICON_KEYS as readonly string[]).includes(value);

// 1. a built-in key ("credit-card"), 2. "lucide:name" to force lucide, 3. the
// typed name, or the item name when the icon box is empty, looked up in Simple
// Icons first and then in lucide. null means "show the letter fallback".
export function resolveTechIcon(
  sets: IconSets | null,
  name: string,
  iconKey: string,
): TechIcon | null {
  const typed = iconKey.trim();
  if (typed && isBuiltInKey(typed)) return TECH_ICONS[typed];
  if (!sets) return null;

  const forced = /^lucide:\s*(.+)$/i.exec(typed);
  if (forced?.[1]) return findLucideIcon(sets.lucide, forced[1]);

  const query = typed || name;
  return (
    findSimpleIcon(sets.simple, query) ?? findLucideIcon(sets.lucide, query)
  );
}
