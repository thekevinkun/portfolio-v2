const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// "2019-01" -> "Jan 2019"
export function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  const name = MONTHS[Number(month) - 1];
  return name && year ? `${name} ${year}` : value;
}

// endDate null = present
export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}
