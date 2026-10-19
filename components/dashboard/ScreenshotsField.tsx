"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui";
import { moved } from "@/lib/dashboard/list";
import { createPending, revokePending } from "@/lib/dashboard/pending-asset";
import { ASSET_RULES, BYTES_PER_MB, type PendingAsset } from "@/types/assets";
import {
  MAX_DETAIL_ALT,
  MAX_DETAIL_CAPTION,
  MAX_DETAIL_SCREENSHOTS,
} from "@/types/limits";
import CountedField from "./CountedField";

// A saved screenshot has a url; a new one has a pending file that uploads on
// Save (D101). key is stable across reordering.
export interface ScreenshotRow {
  key: string;
  url: string | null;
  pending: PendingAsset | null;
  alt: string;
  caption: string;
}

interface ScreenshotsFieldProps {
  rows: ScreenshotRow[];
  onChange: (rows: ScreenshotRow[]) => void;
  // Keys like `shot.<row key>.alt`
  errors: Record<string, string>;
  // An error about the whole list, e.g. too many screenshots
  listError?: string;
  disabled?: boolean;
}

const rule = ASSET_RULES.screenshot;

const ScreenshotsField = ({
  rows,
  onChange,
  errors,
  listError,
  disabled = false,
}: ScreenshotsFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pickError, setPickError] = useState<string | null>(null);

  const update = (
    key: string,
    patch: Partial<Pick<ScreenshotRow, "alt" | "caption">>,
  ) =>
    onChange(rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  const remove = (row: ScreenshotRow) => {
    revokePending(row.pending);
    onChange(rows.filter((item) => item.key !== row.key));
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    // Reset so picking the same file again still fires onChange
    event.currentTarget.value = "";
    if (files.length === 0) return;

    const free = MAX_DETAIL_SCREENSHOTS - rows.length;
    const added: ScreenshotRow[] = [];
    const problems: string[] = [];

    for (const file of files) {
      if (added.length >= free) {
        problems.push(
          `Only ${MAX_DETAIL_SCREENSHOTS} screenshots fit; the rest were skipped.`,
        );
        break;
      }
      // Quick checks only; the server checks the real file header on Save
      if (file.size > rule.maxMb * BYTES_PER_MB) {
        problems.push(`${file.name}: too large (max ${rule.maxMb} MB).`);
        continue;
      }
      if (!(rule.mimes as readonly string[]).includes(file.type)) {
        problems.push(`${file.name}: unsupported file.`);
        continue;
      }
      added.push({
        key: crypto.randomUUID(),
        url: null,
        pending: createPending(file),
        alt: "",
        caption: "",
      });
    }

    setPickError(problems.length > 0 ? problems.join(" ") : null);
    if (added.length > 0) onChange([...rows, ...added]);
  };

  return (
    <div className="space-y-4">
      {rows.length === 0 ? (
        <p className="text-sm text-fg-low">
          None yet. This section stays hidden on the site while it is empty.
        </p>
      ) : null}

      <ol className="space-y-4">
        {rows.map((row, index) => {
          const name = `Screenshot ${index + 1}`;
          const src = row.pending?.previewUrl ?? row.url ?? "";
          return (
            <li
              key={row.key}
              className="space-y-3 rounded-lg border border-glass-border p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-fg-high">
                  {name}
                  {row.pending ? (
                    <span className="ml-2 font-mono text-xs font-normal text-fg-low">
                      New, uploads on Save
                    </span>
                  ) : null}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    aria-label={`Move ${name} up`}
                    disabled={disabled || index === 0}
                    className="disabled:opacity-40"
                    onClick={() => onChange(moved(rows, index, -1))}
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    aria-label={`Move ${name} down`}
                    disabled={disabled || index === rows.length - 1}
                    className="disabled:opacity-40"
                    onClick={() => onChange(moved(rows, index, 1))}
                  >
                    ↓
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    aria-label={`Remove ${name}`}
                    disabled={disabled}
                    className="border-danger/40 text-danger hover:border-danger disabled:opacity-40"
                    onClick={() => remove(row)}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[14rem_1fr]">
                {/* The same 16:10 crop from the top as the public overlay.
                    A plain img: the source can be a local blob: preview. */}
                <div className="aspect-16/10 w-full overflow-hidden rounded-lg border border-glass-border bg-glass-fill">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="size-full object-cover object-top"
                  />
                </div>
                <div className="space-y-3">
                  <CountedField
                    id={`shot-${row.key}-alt`}
                    label="Alt text"
                    value={row.alt}
                    max={MAX_DETAIL_ALT}
                    hint="What the image shows, for people using a screen reader."
                    error={errors[`shot.${row.key}.alt`]}
                    disabled={disabled}
                    onChange={(alt) => update(row.key, { alt })}
                  />
                  <CountedField
                    id={`shot-${row.key}-caption`}
                    label="Caption (optional)"
                    value={row.caption}
                    max={MAX_DETAIL_CAPTION}
                    hint="Shown under the image."
                    error={errors[`shot.${row.key}.caption`]}
                    disabled={disabled}
                    onChange={(caption) => update(row.key, { caption })}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {listError ? (
        <p role="alert" className="text-xs text-danger">
          {listError}
        </p>
      ) : null}
      {pickError ? (
        <p role="alert" className="text-xs text-danger">
          {pickError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="sm"
          variant="secondary"
          disabled={disabled || rows.length >= MAX_DETAIL_SCREENSHOTS}
          className="disabled:opacity-50"
          onClick={() => inputRef.current?.click()}
        >
          Add screenshots
        </Button>
        <span className="font-mono text-xs text-fg-low">
          {rows.length} / {MAX_DETAIL_SCREENSHOTS}
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept={rule.mimes.join(",")}
          onChange={handleFiles}
        />
      </div>
      <p className="text-xs text-fg-low">
        {rule.description}. About 1600×1000 works best: the frame crops to 16:10
        from the top. Nothing uploads until you press Save details.
      </p>
    </div>
  );
};

export default ScreenshotsField;
