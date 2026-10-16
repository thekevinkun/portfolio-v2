import { YOUTUBE_ID_PATTERN } from "@/types/details";

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

// Paths where the id is the next segment: /embed/<id>, /shorts/<id>, ...
const ID_PATHS = new Set(["embed", "shorts", "live", "v"]);

// A YouTube link or a bare 11-character id in, the id out (null if none).
// Only the id is stored (D119).
export function parseYoutubeId(input: string): string | null {
  const value = input.trim();
  if (YOUTUBE_ID_PATTERN.test(value)) return value;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  const parts = url.pathname.split("/").filter(Boolean);
  let candidate: string | null | undefined = null;

  if (host === "youtu.be") {
    candidate = parts[0];
  } else if (YOUTUBE_HOSTS.has(host)) {
    if (parts[0] === "watch") candidate = url.searchParams.get("v");
    else if (parts[0] && ID_PATHS.has(parts[0])) candidate = parts[1];
  }

  return candidate && YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
}
