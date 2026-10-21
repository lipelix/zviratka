/** The page nearest to a horizontal scroll position, within [0, count). */
export function pageAt(
  scrollLeft: number,
  pageWidth: number,
  count: number,
): number {
  if (count <= 0 || pageWidth <= 0) return 0;
  const page = Math.round(scrollLeft / pageWidth);
  return Math.min(count - 1, Math.max(0, page));
}

/** A page index from the URL hash ("#lev"), or 0 for an unknown or empty hash. */
export function pageFromHash(hash: string, ids: readonly string[]): number {
  const index = ids.indexOf(hash.replace(/^#/, ""));
  return index < 0 ? 0 : index;
}
