import { SECTIONS } from "./sections";

// Maps the catch-all route segments to a section index; -1 means unknown URL
export function getSectionIndex(segments: string[] | undefined): number {
  const path = "/" + (segments?.join("/") ?? "");
  return SECTIONS.findIndex((s) => s.path === path);
}
