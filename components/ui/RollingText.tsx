import { cn } from "@/lib/cn";

interface RollingTextProps {
  /** Text to show; every digit rolls when it changes, other characters stay */
  value: string;
  className?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// One digit = a window one row high over a column of 0-9. Moving the column
// by digit × 10% of its own height (ten rows) lands on the right row.
// transform only; the transition is off under reduced motion.
const RollingDigit = ({ digit }: { digit: number }) => (
  <span className="inline-block h-[1.2em] overflow-hidden">
    <span
      className="block motion-safe:transition-transform motion-safe:duration-(--duration-enter) motion-safe:ease-out-expo"
      style={{ transform: `translate3d(0, ${digit * -10}%, 0)` }}
    >
      {DIGITS.map((d) => (
        <span key={d} className="block h-[1.2em] leading-[1.2em]">
          {d}
        </span>
      ))}
    </span>
  </span>
);

// Needs a monospace font so every column has the same width. Screen readers
// get the plain text; the rolling columns are hidden from them.
const RollingText = ({ value, className }: RollingTextProps) => {
  const chars = Array.from(value);

  return (
    <span className={cn("inline-flex h-[1.2em]", className)}>
      <span className="sr-only">{value}</span>
      {/* The line height is set here, not on the outer span: cn() would drop
          it whenever className has a text-* size (tailwind-merge) */}
      <span aria-hidden="true" className="inline-flex leading-[1.2em]">
        {chars.map((char, i) => {
          // Keyed from the end, so "9:59" → "10:00" keeps each column
          const key = chars.length - i;
          return /\d/.test(char) ? (
            <RollingDigit key={key} digit={Number(char)} />
          ) : (
            <span key={key} className="h-[1.2em] whitespace-pre">
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
};

export default RollingText;
