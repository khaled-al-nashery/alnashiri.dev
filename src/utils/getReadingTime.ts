/**
 * Estimates reading time from raw markdown/HTML body text.
 *
 * Uses 200 words-per-minute (WPM) — the industry average for
 * technical content. Strips code blocks and HTML tags before counting.
 *
 * @param body - Raw markdown or HTML string from a post body.
 * @returns Human-readable reading time, e.g. "5 min read".
 */
export function getReadingTime(body: string): string {
  // Strip fenced code blocks (``` … ```) — readers scan code, not read it word-by-word
  const withoutCode = body.replace(/```[\s\S]*?```/g, "");

  // Strip inline code (`…`), HTML tags, and markdown link/image syntax
  const plainText = withoutCode
    .replace(/`[^`]*`/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // [text](url) → text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // ![alt](url) → alt
    .replace(/[#*_~>|]/g, ""); // strip remaining markdown syntax chars

  const words = plainText
    .split(/\s+/)
    .filter(word => word.length > 0).length;

  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
