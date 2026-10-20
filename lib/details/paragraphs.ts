// Paragraphs are separated by a blank line (D112); single line breaks stay
// inside a paragraph
export function paragraphs(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}
