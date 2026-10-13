export const PROFILE_ASSET_KINDS = ["avatar", "portrait", "resume"] as const;
export type ProfileAssetKind = (typeof PROFILE_ASSET_KINDS)[number];

export const ASSET_KINDS = [...PROFILE_ASSET_KINDS, "logo"] as const;
export type AssetKind = (typeof ASSET_KINDS)[number];

export function isAssetKind(value: unknown): value is AssetKind {
  return (
    typeof value === "string" &&
    (ASSET_KINDS as readonly string[]).includes(value)
  );
}

export const ASSET_MIMES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
] as const;
export type AssetMime = (typeof ASSET_MIMES)[number];

export const MIME_EXTENSIONS: Record<AssetMime, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export const BYTES_PER_MB = 1024 * 1024;

export interface AssetRule {
  mimes: readonly AssetMime[];
  maxMb: number;
  description: string;
}

const IMAGE_MIMES = ["image/png", "image/jpeg", "image/webp"] as const;

// SVG is deliberately not allowed: it can carry scripts (D94)
export const ASSET_RULES: Record<AssetKind, AssetRule> = {
  avatar: {
    mimes: IMAGE_MIMES,
    maxMb: 2,
    description: "PNG, JPEG or WebP, up to 2 MB",
  },
  portrait: {
    mimes: IMAGE_MIMES,
    maxMb: 2,
    description: "PNG, JPEG or WebP, up to 2 MB",
  },
  resume: {
    mimes: ["application/pdf"],
    maxMb: 4,
    description: "PDF, up to 4 MB",
  },
  logo: {
    mimes: IMAGE_MIMES,
    maxMb: 2,
    description: "PNG, JPEG or WebP, up to 2 MB",
  },
};

// A file picked in the form but not uploaded yet. It uploads on Save (D101).
export interface PendingAsset {
  file: File;
  previewUrl: string;
}

// undefined = unchanged · null = remove on save · PendingAsset = new file on save
export type AssetChange = PendingAsset | null | undefined;
