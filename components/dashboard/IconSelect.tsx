import { Select } from "./ui";
import { TECH_ICONS } from "@/components/panels/tech-icons";
import { oneOf } from "@/lib/dashboard/form-data";
import { TECH_ICON_KEYS, type TechIconKey } from "@/types/skills";

interface IconSelectProps {
  id: string;
  // Accessible name; the select has no visible label of its own
  label: string;
  value: TechIconKey;
  // Which icons can be picked (all built-in keys by default)
  keys?: readonly TechIconKey[];
  onChange: (key: TechIconKey) => void;
  className?: string;
}

// A native select of icon keys with the chosen icon shown beside it. Used for
// a group's generic icon; items find their logo from the name instead (D107).
const IconSelect = ({
  id,
  label,
  value,
  keys = TECH_ICON_KEYS,
  onChange,
  className,
}: IconSelectProps) => {
  const Icon = TECH_ICONS[value];

  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-glass-border bg-glass-fill text-fg-high"
      >
        <Icon className="size-4" aria-hidden />
      </span>
      <Select
        id={id}
        aria-label={label}
        value={value}
        className={className}
        onChange={(event) => onChange(oneOf(keys, event.target.value, value))}
      >
        {keys.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default IconSelect;
