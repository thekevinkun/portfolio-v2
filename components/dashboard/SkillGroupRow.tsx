"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/dashboard/ui";
import { Button, ButtonLink, Pill } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  moveSkillGroup,
  setSkillGroupVisible,
} from "@/lib/dashboard/actions/skill-groups";
import type { ActionResult } from "@/types/action";
import type { AdminSkillGroup } from "@/types/admin";

interface SkillGroupRowProps {
  group: AdminSkillGroup;
  isFirst: boolean;
  isLast: boolean;
}

const SkillGroupRow = ({ group, isFirst, isLast }: SkillGroupRowProps) => {
  const [pending, startTransition] = useTransition();
  const learning = group.items.filter((item) => item.status === "learning");

  const run = (action: () => Promise<ActionResult>, success?: string) => {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      if (success) toast.success(success);
    });
  };

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-3 py-4",
        !group.visible && "opacity-70",
      )}
    >
      <div className="min-w-0 flex-1 basis-56">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold text-fg-high">{group.title}</h3>
          <Pill className="px-2 py-0.5 font-mono text-[10px] uppercase">
            {group.badge}
          </Pill>
          {!group.visible ? (
            <Pill className="px-2 py-0.5 font-mono text-[10px] uppercase">
              Hidden
            </Pill>
          ) : null}
        </div>
        <p className="mt-1 truncate font-mono text-xs text-fg-low">
          {group.indexLabel} · {group.items.length}{" "}
          {group.items.length === 1 ? "item" : "items"}
          {learning.length > 0 ? ` (${learning.length} learning)` : ""} ·{" "}
          {group.highlights.length}{" "}
          {group.highlights.length === 1 ? "highlight" : "highlights"}
        </p>
      </div>

      <Switch
        label="Visible"
        checked={group.visible}
        disabled={pending}
        onChange={() =>
          run(
            () =>
              setSkillGroupVisible({ id: group.id, visible: !group.visible }),
            group.visible
              ? `${group.title} is hidden`
              : `${group.title} is visible`,
          )
        }
      />

      <div className="flex items-center gap-2">
        <ButtonLink
          href={`/dashboard/tech-stack/${group.slug}`}
          variant="secondary"
          size="sm"
          aria-label={`Edit ${group.title}`}
        >
          Edit
        </ButtonLink>
        <Button
          size="sm"
          variant="secondary"
          aria-label={`Move ${group.title} up`}
          disabled={isFirst || pending}
          className="disabled:opacity-40"
          onClick={() =>
            run(() => moveSkillGroup({ id: group.id, direction: "up" }))
          }
        >
          ↑
        </Button>
        <Button
          size="sm"
          variant="secondary"
          aria-label={`Move ${group.title} down`}
          disabled={isLast || pending}
          className="disabled:opacity-40"
          onClick={() =>
            run(() => moveSkillGroup({ id: group.id, direction: "down" }))
          }
        >
          ↓
        </Button>
      </div>
    </li>
  );
};

export default SkillGroupRow;
