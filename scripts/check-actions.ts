import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Every dashboard server action goes through adminAction and every admin page
// calls requireAdmin (D84). Runs at the start of `npm run build`.
const ACTIONS_DIR = "lib/dashboard/actions";
const ADMIN_PAGES_DIR = "app/dashboard/(admin)";
// Signing out must work even when the session is already invalid
const OPEN_ACTIONS = new Set(["signOutAdmin"]);

const problems: string[] = [];

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

let actionCount = 0;
for (const file of walk(ACTIONS_DIR).filter((path) => path.endsWith(".ts"))) {
  const source = readFileSync(file, "utf8");
  if (!source.trimStart().startsWith('"use server"')) {
    problems.push(`${file}: must start with "use server"`);
  }

  for (const line of source.split("\n")) {
    if (!line.startsWith("export ")) continue;

    const built = /^export const (\w+) = (\w+)\(/.exec(line);
    if (built) {
      actionCount += 1;
      if (built[2] !== "adminAction") {
        problems.push(`${file}: ${built[1]} is not built with adminAction`);
      }
      continue;
    }

    const open = /^export async function (\w+)/.exec(line);
    if (open && OPEN_ACTIONS.has(open[1] ?? "")) {
      actionCount += 1;
      continue;
    }

    problems.push(`${file}: unexpected export: ${line.trim()}`);
  }
}

let pageCount = 0;
const pages = walk(ADMIN_PAGES_DIR).filter((path) =>
  /(^|[\\/])page\.tsx$/.test(path),
);
for (const file of pages) {
  pageCount += 1;
  if (!readFileSync(file, "utf8").includes("requireAdmin(")) {
    problems.push(`${file}: the page does not call requireAdmin()`);
  }
}

if (problems.length > 0) {
  console.error(`Dashboard guard check failed:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Dashboard guard check: ${actionCount} actions and ${pageCount} pages OK`,
);
