"use client";

import { Button } from "@/components/ui";
import CountedField from "./CountedField";
import { moved } from "@/lib/dashboard/list";

// key is stable across reordering, so errors and inputs stay with their row
export interface TitledRow {
  key: string;
  title: string;
  body: string;
}

interface TitledRowsProps {
  // Prefix of the row error keys: `${idPrefix}.${row.key}.title|body`
  idPrefix: string;
  itemLabel: string;
  addLabel: string;
  bodyLabel: string;
  titleHint?: string;
  bodyHint?: string;
  rows: TitledRow[];
  onChange: (rows: TitledRow[]) => void;
  max: number;
  titleMax: number;
  bodyMax: number;
  bodyRows: number;
  errors: Record<string, string>;
  // An error about the whole list, e.g. too many rows
  listError?: string;
  disabled?: boolean;
}

// A repeatable list of title + text rows with add, remove and up/down reorder
const TitledRows = ({
  idPrefix,
  itemLabel,
  addLabel,
  bodyLabel,
  titleHint,
  bodyHint,
  rows,
  onChange,
  max,
  titleMax,
  bodyMax,
  bodyRows,
  errors,
  listError,
  disabled = false,
}: TitledRowsProps) => {
  const update = (key: string, patch: Partial<Omit<TitledRow, "key">>) =>
    onChange(rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  const add = () =>
    onChange([...rows, { key: crypto.randomUUID(), title: "", body: "" }]);

  return (
    <div className="space-y-4">
      {rows.length === 0 ? (
        <p className="text-sm text-fg-low">
          None yet. This section stays hidden on the site while it is empty.
        </p>
      ) : null}

      <ol className="space-y-4">
        {rows.map((row, index) => {
          const name = `${itemLabel} ${index + 1}`;
          return (
            <li
              key={row.key}
              className="space-y-3 rounded-lg border border-glass-border p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-fg-high">{name}</p>
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
                    onClick={() =>
                      onChange(rows.filter((item) => item.key !== row.key))
                    }
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <CountedField
                id={`${idPrefix}-${row.key}-title`}
                label="Title"
                value={row.title}
                max={titleMax}
                hint={titleHint}
                error={errors[`${idPrefix}.${row.key}.title`]}
                disabled={disabled}
                onChange={(title) => update(row.key, { title })}
              />
              <CountedField
                id={`${idPrefix}-${row.key}-body`}
                label={bodyLabel}
                value={row.body}
                max={bodyMax}
                rows={bodyRows}
                hint={bodyHint}
                error={errors[`${idPrefix}.${row.key}.body`]}
                disabled={disabled}
                onChange={(body) => update(row.key, { body })}
              />
            </li>
          );
        })}
      </ol>

      {listError ? (
        <p role="alert" className="text-xs text-danger">
          {listError}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="secondary"
          disabled={disabled || rows.length >= max}
          className="disabled:opacity-50"
          onClick={add}
        >
          {addLabel}
        </Button>
        <span className="font-mono text-xs text-fg-low">
          {rows.length} / {max}
        </span>
      </div>
    </div>
  );
};

export default TitledRows;
