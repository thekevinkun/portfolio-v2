"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui";
import { createPending, revokePending } from "@/lib/dashboard/pending-asset";
import {
  ASSET_RULES,
  BYTES_PER_MB,
  type AssetChange,
  type AssetKind,
} from "@/types/assets";

interface AssetFieldProps {
  kind: AssetKind;
  label: string;
  // What the database holds now
  savedUrl: string | null;
  // What the user changed in the form; nothing is uploaded until Save
  change: AssetChange;
  disabled?: boolean;
  onChange: (change: AssetChange) => void;
}

const AssetField = ({
  kind,
  label,
  savedUrl,
  change,
  disabled = false,
  onChange,
}: AssetFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const rule = ASSET_RULES[kind];
  const isImage = kind !== "resume";

  const imageSrc = change === undefined ? savedUrl : change?.previewUrl;
  const description =
    change === undefined
      ? (savedUrl ?? "None")
      : change === null
        ? "Will be removed"
        : change.file.name;
  const hasValue = change === undefined ? savedUrl !== null : change !== null;

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    // Reset so picking the same file again still fires onChange
    event.currentTarget.value = "";
    if (!file) return;

    // Quick checks only; the server checks the real file header on Save
    if (file.size > rule.maxMb * BYTES_PER_MB) {
      setError(`The file is too large (max ${rule.maxMb} MB).`);
      return;
    }
    if (!(rule.mimes as readonly string[]).includes(file.type)) {
      setError(`Unsupported file. Use: ${rule.description}.`);
      return;
    }

    setError(null);
    revokePending(change);
    onChange(createPending(file));
  };

  const remove = () => {
    setError(null);
    revokePending(change);
    // Nothing saved yet means nothing to remove: just drop the pending file
    onChange(savedUrl === null ? undefined : null);
  };

  const undo = () => {
    setError(null);
    revokePending(change);
    onChange(undefined);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-fg-high">{label}</p>
      <div className="flex flex-wrap items-center gap-4">
        {isImage && imageSrc ? (
          // A plain img: the source can be a local blob: preview
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            width={64}
            height={64}
            className="size-16 rounded-lg border border-glass-border object-cover"
          />
        ) : null}
        <div className="min-w-0 flex-1 space-y-2">
          <p className="font-mono text-xs break-all text-fg-medium">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={disabled}
              className="disabled:opacity-50"
              onClick={() => inputRef.current?.click()}
            >
              {hasValue ? "Replace" : "Upload"}
            </Button>
            {hasValue ? (
              <Button
                size="sm"
                variant="secondary"
                disabled={disabled}
                className="disabled:opacity-50"
                onClick={remove}
              >
                Remove
              </Button>
            ) : null}
            {change !== undefined ? (
              <Button
                size="sm"
                variant="secondary"
                disabled={disabled}
                className="disabled:opacity-50"
                onClick={undo}
              >
                Undo change
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={rule.mimes.join(",")}
        onChange={handleFile}
      />
      <p className="text-xs text-fg-low">{rule.description}</p>
      {change !== undefined ? (
        <p className="text-xs text-fg-medium">
          Not saved yet: nothing is uploaded until you press Save changes.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default AssetField;
