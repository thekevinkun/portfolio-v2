import type { AssetMime } from "@/types/assets";

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((byte, index) => bytes[offset + index] === byte);

// Reads the first bytes of the file: the type the browser reports can be anything
export function sniffMime(bytes: Uint8Array): AssetMime | null {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png";
  }
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  // WebP is "RIFF" + 4 size bytes + "WEBP"
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return "image/webp";
  }
  if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46])) return "application/pdf";
  return null;
}
