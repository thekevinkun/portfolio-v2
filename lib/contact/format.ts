// "https://www.linkedin.com/in/name/" -> "linkedin.com/in/name"
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

// "Asia/Makassar" -> "UTC+8" (derived, so it follows the profile timezone)
export function utcOffsetLabel(timeZone: string, date = new Date()): string {
  const value = new Intl.DateTimeFormat("en", {
    timeZone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;
  return value ? value.replace("GMT", "UTC") : "";
}
