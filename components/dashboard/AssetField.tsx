"use client";

import Image from "next/image";
import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { discardAsset, uploadAsset } from "@/lib/dashboard/actions/assets";
import { ASSET_RULES, BYTES_PER_MB, type AssetKind } from "@/types/assets";

interface AssetFieldProps {
  kind: AssetKind;
  label: string;
  // What the form holds now (may be an unsaved upload)
  value: string | null;
  // What the database holds now
  savedValue: string | null;
  onChange: (url: string | null) => void;
}

const AssetField = ({
  kind,
  label,
  value,
  savedValue,
  onChange,
}: AssetFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const rule = ASSET_RULES[kind];
  const isImage = kind !== "resume";

  // An earlier upload that was never saved is clutter in the store. The server
  // refuses to delete anything a saved row uses, so this is safe to call.
  const discardUnsaved = (url: string | null) => {
    if (url && url !== savedValue) void discardAsset({ url }).catch(() => {});
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    // Reset so picking the same file again still fires onChange
    event.currentTarget.value = "";
    if (!file) return;

    // Quick check before sending; the server checks again
    if (file.size > rule.maxMb * BYTES_PER_MB) {
      setError(`The file is too large (max ${rule.maxMb} MB).`);
      return;
    }

    const data = new FormData();
    data.set("kind", kind);
    data.set("file", file);

    startTransition(async () => {
      try {
        const result = await uploadAsset(data);
        if (result.ok) {
          setError(null);
          discardUnsaved(value);
          onChange(result.data.url);
          toast.success(`${label} uploaded. Save changes to apply it.`);
          return;
        }
        setError(result.error);
        toast.error(result.error);
      } catch {
        setError("Upload failed. Please try again.");
        toast.error("Upload failed. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-fg-high">{label}</p>
      <div className="flex flex-wrap items-center gap-4">
        {isImage && value ? (
          <Image
            src={value}
            alt=""
            width={64}
            height={64}
            unoptimized
            className="size-16 rounded-lg border border-glass-border object-cover"
          />
        ) : null}
        <div className="min-w-0 flex-1 space-y-2">
          <p className="font-mono text-xs break-all text-fg-medium">
            {value ?? "None"}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={pending}
              className="disabled:opacity-50"
              onClick={() => inputRef.current?.click()}
            >
              {pending ? "Uploading…" : value ? "Replace" : "Upload"}
            </Button>
            {value ? (
              <Button
                size="sm"
                variant="secondary"
                disabled={pending}
                className="disabled:opacity-50"
                onClick={() => {
                  setError(null);
                  discardUnsaved(value);
                  onChange(null);
                }}
              >
                Remove
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
      {value !== savedValue ? (
        <p className="text-xs text-fg-medium">
          Not saved yet: press Save changes to apply it.
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
