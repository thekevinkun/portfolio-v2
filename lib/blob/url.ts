const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

// Site paths like /images/profile-picture.png are never Blob URLs
export function isBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}
