// The card number follows the card's position, so a number typed at the start
// is dropped ("01 / CLIENT & UI" -> "CLIENT & UI")
export function plainIndexLabel(value: string): string {
  return value.replace(/^\s*\d+\s*\/\s*/, "").trim();
}

export function formatIndexLabel(position: number, label: string): string {
  return `${String(position).padStart(2, "0")} / ${plainIndexLabel(label)}`;
}
