import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FieldRowProps {
  label: string;
  // Must match the control's id. The hint and error get the ids
  // `${htmlFor}-hint` and `${htmlFor}-error` for aria-describedby.
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}

const FieldRow = ({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: FieldRowProps) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-fg-high"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-fg-low">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default FieldRow;
