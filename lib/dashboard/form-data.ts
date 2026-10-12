// Trimmed text of a form field ("" when missing)
export function readText(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

// One item per line, blank lines dropped
export function readLines(data: FormData, name: string): string[] {
  const value = data.get(name);
  if (typeof value !== "string") return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function joinLines(items: string[]): string {
  return items.join("\n");
}
