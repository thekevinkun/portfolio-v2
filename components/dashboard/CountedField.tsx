import type { ReactNode } from "react";
import { FieldRow, Input, Textarea } from "./ui";
import { cn } from "@/lib/cn";

interface CountedFieldProps {
  id: string;
  label: string;
  value: string;
  max: number;
  onChange: (value: string) => void;
  // Set for a multi-line field
  rows?: number;
  hint?: ReactNode;
  error?: string;
  disabled?: boolean;
}

// Controlled text field with a live character counter. The server trims, so
// the count is of the trimmed text.
const CountedField = ({
  id,
  label,
  value,
  max,
  onChange,
  rows,
  hint,
  error,
  disabled,
}: CountedFieldProps) => {
  const length = value.trim().length;
  const over = length > max;
  const describedBy = error ? `${id}-hint ${id}-error` : `${id}-hint`;

  const shared = {
    id,
    name: id,
    value,
    disabled,
    "aria-invalid": error !== undefined || over ? true : undefined,
    "aria-describedby": describedBy,
  };

  return (
    <FieldRow
      label={label}
      htmlFor={id}
      error={error}
      hint={
        <>
          {hint ? <>{hint} </> : null}
          <span className={cn("font-mono", over && "text-danger")}>
            {length} / {max}
          </span>
        </>
      }
    >
      {rows ? (
        <Textarea
          rows={rows}
          {...shared}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      ) : (
        <Input
          type="text"
          {...shared}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      )}
    </FieldRow>
  );
};

export default CountedField;
