import type { PendingAsset } from "@/types/assets";

// The preview is a local blob: URL; nothing is sent anywhere
export function createPending(file: File): PendingAsset {
  return { file, previewUrl: URL.createObjectURL(file) };
}

export function revokePending(change: PendingAsset | null | undefined) {
  if (change) URL.revokeObjectURL(change.previewUrl);
}
