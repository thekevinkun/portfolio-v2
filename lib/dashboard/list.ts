// Swaps a row with its neighbor; the list is returned unchanged at the edge
export function moved<T>(list: T[], index: number, step: -1 | 1): T[] {
  const first = list[index];
  const second = list[index + step];
  if (first === undefined || second === undefined) return list;
  const next = [...list];
  next[index] = second;
  next[index + step] = first;
  return next;
}
