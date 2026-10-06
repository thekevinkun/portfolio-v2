import { LiveClock, ProfileBadge } from "@/components/chrome";
import type { Profile } from "@/types/profile";

interface TopBarProps {
  profile: Profile;
}

const TopBar = ({ profile }: TopBarProps) => {
  return (
    <header className="relative z-30 flex h-18 shrink-0 items-center justify-between px-5 md:px-14">
      <div className="flex items-center gap-3 font-mono text-xs tracking-wider">
        <span
          aria-hidden="true"
          className="size-2 animate-pulse rounded-full bg-accent shadow-dot-glow"
        />
        <span className="font-bold tracking-widest text-fg-high uppercase">
          {profile.name}
        </span>
        <span aria-hidden="true" className="hidden text-fg-faint sm:inline">
          /
        </span>
        <span className="hidden text-[11px] tracking-widest text-fg-low uppercase sm:inline">
          Portfolio
        </span>
      </div>

      <div className="flex items-center gap-6">
        <LiveClock
          timeZone={profile.timezone}
          className="text-sm font-semibold tracking-wider text-fg-medium"
        />
        <ProfileBadge profile={profile} />
      </div>
    </header>
  );
};

export default TopBar;
