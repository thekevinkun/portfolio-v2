"use server";

import { put } from "@vercel/blob";
import { z } from "zod";
import { deleteBlobs } from "@/lib/blob/cleanup";
import { blobEnv } from "@/lib/blob/env";
import { isReferenced } from "@/lib/blob/references";
import { sniffMime } from "@/lib/blob/sniff";
import { isBlobUrl } from "@/lib/blob/url";
import {
  ASSET_RULES,
  BYTES_PER_MB,
  MIME_EXTENSIONS,
  isAssetKind,
} from "@/types/assets";
import { adminAction, fail, ok } from "../admin-action";

// Only creates the file. The URL goes live when the profile form is saved
// (D94), so there is nothing to revalidate.
export const uploadAsset = adminAction(
  z.instanceof(FormData),
  async (formData) => {
    const kind = formData.get("kind");
    const file = formData.get("file");

    if (!isAssetKind(kind)) return fail("Unknown file type.");
    if (!(file instanceof File) || file.size === 0) {
      return fail("Choose a file first.");
    }

    const rule = ASSET_RULES[kind];
    if (file.size > rule.maxMb * BYTES_PER_MB) {
      return fail(`The file is too large (max ${rule.maxMb} MB).`);
    }

    // Trust the file's own header, not the type the browser reports
    const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    const mime = sniffMime(head);
    if (!mime || !rule.mimes.includes(mime)) {
      return fail(`Unsupported file. Use: ${rule.description}.`);
    }

    // addRandomSuffix gives each upload its own URL, so a replaced file is
    // never served stale from the CDN
    const blob = await put(`profile/${kind}.${MIME_EXTENSIONS[mime]}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: mime,
      token: blobEnv.BLOB_READ_WRITE_TOKEN,
    });

    return ok({ url: blob.url });
  },
  { revalidate: false },
);

// Deletes an upload that was never saved (the user uploaded again or pressed
// Remove). Only files under profile/, and never one a saved row uses.
export const discardAsset = adminAction(
  z.object({ url: z.string() }),
  async ({ url }) => {
    if (!isBlobUrl(url) || !new URL(url).pathname.startsWith("/profile/")) {
      return fail("Not an uploaded file.");
    }
    if (await isReferenced(url)) return fail("That file is in use.");
    await deleteBlobs([url]);
    return ok();
  },
  { revalidate: false },
);
