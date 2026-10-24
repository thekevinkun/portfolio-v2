import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Keeps the icon sets out of the public JS (D131). A client component that
// reaches them through a barrel ships thousands of icons to every visitor.
// Source checks only: they see direct imports, not longer chains.
// Runs at the start of `npm run build`.
const ROOTS = ["app", "components", "lib"];
const PANELS_DIR = "components/panels/";
// Admin code is not a public bundle, and its icon preview is allowed (D108)
const DASHBOARD_DIRS = ["components/dashboard/", "app/dashboard/"];
const RESOLVER = "components/panels/resolve-tech-icon.ts";
const RESOLVER_USERS = new Set([
  "components/panels/SkillGroupCard.tsx",
  RESOLVER,
]);

// "./", "." or the panels barrel by its alias
const BARREL_IMPORT = /from\s+["'](\.\/?|@\/components\/panels\/?)["']/g;
const RESOLVER_IMPORT =
  /(?:from\s+|import\(\s*)["'][^"']*resolve-tech-icon["']/;
const ICON_SET_IMPORT =
  /import\(\s*["'](?:lucide-react|react-icons\/[^"']*)["']\s*\)/;

const problems: string[] = [];

const normalize = (path: string) => path.replaceAll("\\", "/");

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

let fileCount = 0;
for (const root of ROOTS) {
  const files = walk(root)
    .map(normalize)
    .filter((path) => /\.tsx?$/.test(path));

  for (const file of files) {
    if (DASHBOARD_DIRS.some((dir) => file.startsWith(dir))) continue;
    fileCount += 1;

    const source = readFileSync(file, "utf8");
    const isClient = source.trimStart().startsWith('"use client"');

    if (isClient) {
      for (const match of source.matchAll(BARREL_IMPORT)) {
        const spec = match[1] ?? "";
        // Inside the panels folder any barrel import counts; elsewhere only
        // the panels barrel does
        if (file.startsWith(PANELS_DIR) || spec.startsWith("@/")) {
          problems.push(
            `${file}: client component imports a barrel ("${spec}"); import the file directly`,
          );
        }
      }
    }

    if (RESOLVER_IMPORT.test(source) && !RESOLVER_USERS.has(file)) {
      problems.push(`${file}: only SkillGroupCard may use resolve-tech-icon`);
    }

    if (ICON_SET_IMPORT.test(source) && file !== RESOLVER) {
      problems.push(
        `${file}: the icon sets may only be imported inside resolve-tech-icon.ts`,
      );
    }
  }
}

if (problems.length > 0) {
  console.error(`Client graph check failed:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}

console.log(`Client graph check: ${fileCount} files OK`);
