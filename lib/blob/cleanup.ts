import { del } from "@vercel/blob";
import { blobEnv } from "./env";

const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

// Site paths like /images/profile-picture.png are never deleted
export function isBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

// Best effort: a failed delete leaves an orphan file, never a failed save (D94)
export async function deleteBlobs(urls: string[]) {
  if (urls.length === 0) return;
  try {
    await del(urls, { token: blobEnv.BLOB_READ_WRITE_TOKEN });
  } catch (error) {
    console.error("Could not delete replaced blobs:", error);
  }
}
