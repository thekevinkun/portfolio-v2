import { SectionHeader } from "@/components/ui";
import type { SkillGroup, SkillItem } from "@/types/skills";
import SkillGroupCard from "./SkillGroupCard";
import { TECH_ICONS } from "./tech-icons";

interface TechStackPanelProps {
  groups: SkillGroup[];
  strip: SkillItem[];
}

// Header, a grid of group cards (4 / 2×2 / 2×2 compact) and an "also used"
// strip. Detail drops with panel height; see SkillGroupCard and globals.css.
const TechStackPanel = ({ groups, strip }: TechStackPanelProps) => (
  <div className="tier-container h-full">
    <div className="flex h-full flex-col gap-3 px-5 pt-2 pb-4 md:px-12 tier-regular:gap-4">
      <SectionHeader
        title="Tech Stack"
        subtitle="Grouped by layer. Everything here has shipped in a real project."
        titleId="heading-tech-stack"
        className="shrink-0"
      />

      <div className="grid min-h-0 flex-1 grid-cols-2 content-center gap-3 lg:grid-cols-4">
        {groups.map((group) => (
          <SkillGroupCard key={group.indexLabel} group={group} />
        ))}
      </div>

      {strip.length > 0 && (
        <div className="hidden shrink-0 flex-wrap items-center gap-x-4 gap-y-2 rounded-card border border-glass-border bg-glass-fill px-4 py-2 md:flex">
          <span className="font-mono text-[10px] font-semibold tracking-wider text-fg-high uppercase">
            Also used
          </span>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {strip.map((item) => {
              const Icon = TECH_ICONS[item.iconKey];
              return (
                <li
                  key={item.name}
                  className="flex items-center gap-1.5 font-mono text-[10px] text-fg-low"
                >
                  <Icon className="size-3.5 shrink-0" aria-hidden />
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  </div>
);

export default TechStackPanel;
