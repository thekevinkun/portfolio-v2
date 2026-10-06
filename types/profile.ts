export interface Profile {
  name: string;
  handle: string;
  locationLabel: string;
  timezone: string; // IANA id, e.g. "Asia/Jakarta"; drives the clock
  availability: string;
  avatarUrl: string | null;
}
