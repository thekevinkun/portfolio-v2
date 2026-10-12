import { del } from "@vercel/blob";
import { blobEnv } from "./env";

// Best effort: a failed delete leaves an orphan file, never a failed save
// (D94). Returns false when something could not be deleted.
export async function deleteBlobs(urls: string[]): Promise<boolean> {
  if (urls.length === 0) return true;
  try {
    await del(urls, { token: blobEnv.BLOB_READ_WRITE_TOKEN });
    return true;
  } catch (error) {
    console.error("Could not delete blobs:", urls, error);
    return false;
  }
}
