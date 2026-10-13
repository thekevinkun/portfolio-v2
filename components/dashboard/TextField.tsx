import type { ReactNode } from "react";
import { FieldRow, Input, Textarea } from "./ui";

interface TextFieldProps {
  name: string;
  label: string;
  defaultValue: string;
  hint?: ReactNode;
  error?: string;
  // Set for a multi-line field
  rows?: number;
  type?: "text" | "email";
  // Shown but not editable; still submitted with the form
  readOnly?: boolean;
}

// Uncontrolled field: the form reads it with FormData on submit
const TextField = ({
  name,
  label,
  defaultValue,
  hint,
  error,
  rows,
  type = "text",
  readOnly,
}: TextFieldProps) => {
  const describedBy =
    [hint ? `${name}-hint` : null, error ? `${name}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const shared = {
    id: name,
    name,
    defaultValue,
    readOnly,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  };

  return (
    <FieldRow label={label} htmlFor={name} hint={hint} error={error}>
      {rows ? (
        <Textarea rows={rows} {...shared} />
      ) : (
        <Input type={type} {...shared} />
      )}
    </FieldRow>
  );
};

export default TextField;
