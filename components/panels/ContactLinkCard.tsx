import { GlassCard } from "@/components/ui";
import { CONTACT_ICONS } from "./contact-icons";
import type { ContactIconKey } from "./contact-icons";

interface ContactLinkCardProps {
  href: string;
  iconKey: ContactIconKey;
  label: string;
  value: string;
  // http(s) links open in a new tab; mailto stays in place
  external?: boolean;
}

// One way to reach me: the whole card is the link
const ContactLinkCard = ({
  href,
  iconKey,
  label,
  value,
  external = false,
}: ContactLinkCardProps) => {
  const Icon = CONTACT_ICONS[iconKey];

  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="group block rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <GlassCard
        interactive
        className="flex items-center gap-3 p-2.5 tier-regular:p-3 tier-spacious:p-4"
      >
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-glass-border bg-glass-fill text-fg-high tier-regular:size-9"
        >
          <Icon className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[10px] tracking-wider text-fg-low uppercase">
            {label}
          </span>
          <span
            title={value}
            className="block truncate text-xs font-semibold text-fg-high tier-regular:text-sm"
          >
            {value}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="text-fg-low transition-colors group-hover:text-fg-high"
        >
          {external ? "↗" : "→"}
        </span>
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </GlassCard>
    </a>
  );
};

export default ContactLinkCard;
