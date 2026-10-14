"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { toast } from "sonner";
import {
  loadIconSets,
  resolveTechIcon,
  type IconSets,
} from "@/components/panels/resolve-tech-icon";
import TechLogo from "@/components/panels/TechLogo";
import { Button, ButtonLink } from "@/components/ui";
import FormSection from "./FormSection";
import IconSelect from "./IconSelect";
import TextField from "./TextField";
import { FieldRow, Input, Select } from "./ui";
import { cn } from "@/lib/cn";
import { updateSkillGroup } from "@/lib/dashboard/actions/skill-groups";
import { oneOf, readText } from "@/lib/dashboard/form-data";
import { toFormErrors } from "@/lib/dashboard/form-errors";
import { plainIndexLabel } from "@/lib/skills/index-label";
import type { AdminSkillGroup } from "@/types/admin";
import {
  MAX_HIGHLIGHT_LENGTH,
  MAX_SKILL_HIGHLIGHTS,
  MAX_SKILL_ITEMS,
} from "@/types/limits";
import {
  GROUP_ICON_KEYS,
  SKILL_STATUSES,
  type SkillStatus,
  type TechIconKey,
} from "@/types/skills";

interface ItemRow {
  key: number;
  name: string;
  // Empty = find the logo from the name
  iconKey: string;
  status: SkillStatus;
}

interface HighlightRow {
  key: number;
  text: string;
}

const STATUS_LABELS: Record<SkillStatus, string> = {
  used: "Used in a real project",
  learning: "Learning",
};

// Swaps a row with its neighbor; the list is returned unchanged at the edge
function moved<T>(list: T[], index: number, step: -1 | 1): T[] {
  const first = list[index];
  const second = list[index + step];
  if (first === undefined || second === undefined) return list;
  const next = [...list];
  next[index] = second;
  next[index + step] = first;
  return next;
}

const SkillGroupForm = ({ group }: { group: AdminSkillGroup }) => {
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [groupIcon, setGroupIcon] = useState<TechIconKey>(group.iconKey);
  // The icon sets load in the browser only here, for the live preview
  const [iconSets, setIconSets] = useState<IconSets | null>(null);
  // Row keys are counters, so the server and the browser render the same ids
  const nextKey = useRef(group.items.length + group.highlights.length);
  const [items, setItems] = useState<ItemRow[]>(() =>
    group.items.map((item, key) => ({ key, ...item })),
  );
  const [highlights, setHighlights] = useState<HighlightRow[]>(() =>
    group.highlights.map((text, index) => ({
      key: group.items.length + index,
      text,
    })),
  );

  useEffect(() => {
    let active = true;
    void loadIconSets().then((sets) => {
      if (active) setIconSets(sets);
    });
    return () => {
      active = false;
    };
  }, []);

  const addItem = () => {
    const key = nextKey.current++;
    setItems((previous) =>
      previous.length >= MAX_SKILL_ITEMS
        ? previous
        : // Learning until it has shipped in a real project (R4)
          [...previous, { key, name: "", iconKey: "", status: "learning" }],
    );
  };

  const changeItem = (key: number, patch: Partial<Omit<ItemRow, "key">>) =>
    setItems((previous) =>
      previous.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );

  const addHighlight = () => {
    const key = nextKey.current++;
    setHighlights((previous) =>
      previous.length >= MAX_SKILL_HIGHLIGHTS
        ? previous
        : [...previous, { key, text: "" }],
    );
  };

  const changeHighlight = (key: number, text: string) =>
    setHighlights((previous) =>
      previous.map((row) => (row.key === key ? { ...row, text } : row)),
    );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => readText(data, name);

    // A blank highlight row is dropped; a blank item name is an error
    const kept = highlights.filter((row) => row.text.trim() !== "");

    const content = {
      slug: group.slug,
      indexLabel: plainIndexLabel(text("indexLabel")),
      title: text("title"),
      subtitle: text("subtitle"),
      badge: text("badge"),
      iconKey: groupIcon,
      items: items.map(({ name, iconKey, status }) => ({
        name: name.trim(),
        iconKey: iconKey.trim(),
        status,
      })),
      highlights: kept.map((row) => row.text.trim()),
    };

    // Server paths ("items.2.name", "highlights.1") to the row that shows them
    const rename = (key: string): string => {
      const item = /^items\.(\d+)\.(name|iconKey|status)$/.exec(key);
      if (item) {
        const row = items[Number(item[1])];
        return row ? `item.${row.key}.${item[2]}` : "items";
      }
      const highlight = /^highlights\.(\d+)$/.exec(key);
      if (highlight) {
        const row = kept[Number(highlight[1])];
        return row ? `highlight.${row.key}` : "highlights";
      }
      return key;
    };

    startTransition(async () => {
      try {
        const result = await updateSkillGroup(content);
        if (!result.ok) {
          setErrors(toFormErrors(result.fieldErrors, rename));
          toast.error(result.error);
          return;
        }
        setErrors({});
        setHighlights(kept);
        toast.success("Group saved");
      } catch (error) {
        console.error("Could not save the group:", error);
        toast.error(
          "Could not save the group. Check your connection and try again.",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormSection title="Group">
        <TextField
          name="indexLabel"
          label="Label"
          defaultValue={plainIndexLabel(group.indexLabel)}
          hint='The small label at the top left of the card, for example "CLIENT & UI". Don&apos;t type a number: the card number follows its position.'
          error={errors.indexLabel}
        />
        <TextField
          name="title"
          label="Title"
          defaultValue={group.title}
          error={errors.title}
        />
        <TextField
          name="subtitle"
          label="Subtitle"
          defaultValue={group.subtitle}
          error={errors.subtitle}
        />
        <TextField
          name="badge"
          label="Badge"
          defaultValue={group.badge}
          hint="The short tag at the top right of the card."
          error={errors.badge}
        />
        <FieldRow
          label="Group icon"
          htmlFor="group-icon"
          error={errors.iconKey}
        >
          <IconSelect
            id="group-icon"
            label="Group icon"
            value={groupIcon}
            keys={GROUP_ICON_KEYS}
            onChange={setGroupIcon}
          />
        </FieldRow>
      </FormSection>

      <FormSection
        title="Items"
        description={`Up to ${MAX_SKILL_ITEMS}. The icon is found from the name (Python, Go, FastAPI, Database...); leave the icon box empty for that. If none is found, a letter is shown. To pick one yourself, type its name in the icon box: a brand from simpleicons.org (tailwindcss) or a generic icon from lucide.dev/icons (shield-check, lock, bug). Write lucide: before a name to force a lucide icon. Mark an item "Used" only after it has shipped in a real project; everything else is "Learning".`}
      >
        <ul className="space-y-3">
          {items.map((row, index) => {
            const id = `item-${row.key}`;
            const error =
              errors[`item.${row.key}.name`] ??
              errors[`item.${row.key}.iconKey`] ??
              errors[`item.${row.key}.status`];
            const icon = resolveTechIcon(iconSets, row.name, row.iconKey);
            const unresolved =
              iconSets !== null &&
              icon === null &&
              (row.name.trim() !== "" || row.iconKey.trim() !== "");
            return (
              <li key={row.key} className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    id={`${id}-name`}
                    aria-label={`Item ${index + 1} name`}
                    placeholder="Name, for example Python"
                    value={row.name}
                    aria-invalid={error ? true : undefined}
                    className="min-w-0 flex-1 basis-40"
                    onChange={(event) =>
                      changeItem(row.key, { name: event.target.value })
                    }
                  />
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-glass-border bg-glass-fill text-fg-high"
                  >
                    <TechLogo
                      icon={icon}
                      name={row.name || row.iconKey || "?"}
                      className="size-4"
                    />
                  </span>
                  <Input
                    id={`${id}-icon`}
                    aria-label={`Item ${index + 1} icon name (optional)`}
                    placeholder="icon: auto"
                    value={row.iconKey}
                    className="w-36"
                    onChange={(event) =>
                      changeItem(row.key, { iconKey: event.target.value })
                    }
                  />
                  <Select
                    id={`${id}-status`}
                    aria-label={`Item ${index + 1} status`}
                    value={row.status}
                    className="w-auto"
                    onChange={(event) =>
                      changeItem(row.key, {
                        status: oneOf(
                          SKILL_STATUSES,
                          event.target.value,
                          row.status,
                        ),
                      })
                    }
                  >
                    {SKILL_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </Select>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Move item ${index + 1} up`}
                      disabled={index === 0}
                      className="disabled:opacity-40"
                      onClick={() =>
                        setItems((previous) => moved(previous, index, -1))
                      }
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Move item ${index + 1} down`}
                      disabled={index === items.length - 1}
                      className="disabled:opacity-40"
                      onClick={() =>
                        setItems((previous) => moved(previous, index, 1))
                      }
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Remove item ${index + 1}`}
                      onClick={() =>
                        setItems((previous) =>
                          previous.filter((item) => item.key !== row.key),
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                {unresolved ? (
                  <p className="text-xs text-fg-low">
                    No icon found, so a letter is shown. Type an icon name in
                    the icon box: a brand from simpleicons.org or a generic icon
                    from lucide.dev/icons.
                  </p>
                ) : null}
                {error ? (
                  <p role="alert" className="text-xs text-danger">
                    {error}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
        {errors.items ? (
          <p role="alert" className="text-xs text-danger">
            {errors.items}
          </p>
        ) : null}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            disabled={items.length >= MAX_SKILL_ITEMS}
            className="disabled:opacity-40"
            onClick={addItem}
          >
            Add item
          </Button>
          <span className="font-mono text-xs text-fg-low">
            {items.length} / {MAX_SKILL_ITEMS}
          </span>
        </div>
      </FormSection>

      <FormSection
        title="Highlights"
        description={`Up to ${MAX_SKILL_HIGHLIGHTS}, one line each on the card, at most ${MAX_HIGHLIGHT_LENGTH} characters. Empty rows are dropped when you save.`}
      >
        <ul className="space-y-3">
          {highlights.map((row, index) => {
            const length = row.text.trim().length;
            const error = errors[`highlight.${row.key}`];
            return (
              <li key={row.key} className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    id={`highlight-${row.key}`}
                    aria-label={`Highlight ${index + 1}`}
                    value={row.text}
                    aria-invalid={error ? true : undefined}
                    className="min-w-0 flex-1 basis-56"
                    onChange={(event) =>
                      changeHighlight(row.key, event.target.value)
                    }
                  />
                  <span
                    className={cn(
                      "w-12 text-right font-mono text-xs",
                      length > MAX_HIGHLIGHT_LENGTH
                        ? "text-danger"
                        : "text-fg-low",
                    )}
                  >
                    {length}/{MAX_HIGHLIGHT_LENGTH}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Move highlight ${index + 1} up`}
                      disabled={index === 0}
                      className="disabled:opacity-40"
                      onClick={() =>
                        setHighlights((previous) => moved(previous, index, -1))
                      }
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Move highlight ${index + 1} down`}
                      disabled={index === highlights.length - 1}
                      className="disabled:opacity-40"
                      onClick={() =>
                        setHighlights((previous) => moved(previous, index, 1))
                      }
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Remove highlight ${index + 1}`}
                      onClick={() =>
                        setHighlights((previous) =>
                          previous.filter((item) => item.key !== row.key),
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                {error ? (
                  <p role="alert" className="text-xs text-danger">
                    {error}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
        {errors.highlights ? (
          <p role="alert" className="text-xs text-danger">
            {errors.highlights}
          </p>
        ) : null}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            disabled={highlights.length >= MAX_SKILL_HIGHLIGHTS}
            className="disabled:opacity-40"
            onClick={addHighlight}
          >
            Add highlight
          </Button>
          <span className="font-mono text-xs text-fg-low">
            {highlights.length} / {MAX_SKILL_HIGHLIGHTS}
          </span>
        </div>
      </FormSection>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-glass-border bg-obsidian px-6 py-3 lg:-mx-10 lg:px-10">
        <ButtonLink href="/dashboard/tech-stack" variant="secondary">
          Back to list
        </ButtonLink>
        <Button
          type="submit"
          disabled={pending}
          className="disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
};

export default SkillGroupForm;
