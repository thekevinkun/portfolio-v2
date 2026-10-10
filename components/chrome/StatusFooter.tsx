import type { Profile } from "@/types/profile";

interface StatusFooterProps {
  profile: Profile;
}

// Only true or derived information: availability, hosting note, location, year
const StatusFooter = ({ profile }: StatusFooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative z-30 hidden shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-1 
      border-t border-glass-border bg-canvas/90 px-5 py-3 font-mono text-xs text-fg-low md:flex md:px-14"
    >
      <div className="flex items-center gap-2 text-fg-medium">
        <span
          aria-hidden="true"
          className="size-2 animate-pulse rounded-full bg-accent shadow-dot-glow"
        />
        {profile.availability}
      </div>

      <div className="flex items-center gap-3">
        <span>{profile.locationLabel}</span>
        <span aria-hidden="true" className="text-fg-faint">
          •
        </span>
        <span>
          © {year} {profile.name}
        </span>
      </div>
    </footer>
  );
};

export default StatusFooter;
