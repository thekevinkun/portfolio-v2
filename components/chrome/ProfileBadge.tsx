import Image from "next/image";
import type { Profile } from "@/types/profile";

interface ProfileBadgeProps {
  profile: Profile;
}

// Avatar with online beacon, plus handle and availability (hidden on phones)
const ProfileBadge = ({ profile }: ProfileBadgeProps) => {
  const initials = profile.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="relative size-10 overflow-hidden rounded-full border-2 border-accent/80 bg-charcoal">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              fill
              sizes="40px"
              className="object-cover object-top grayscale"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-xs font-bold">
              {initials}
            </span>
          )}
        </div>
        <span
          aria-hidden="true"
          className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-canvas bg-accent shadow-dot-glow"
        />
      </div>

      <div className="hidden flex-col sm:flex">
        <span className="text-xs leading-tight font-bold tracking-wide text-fg-high">
          {profile.handle}
        </span>
        <span className="flex items-center gap-1 font-mono text-[10px] tracking-tight text-fg-low">
          <span
            aria-hidden="true"
            className="size-1.5 animate-pulse rounded-full bg-accent"
          />
          {profile.availability}
        </span>
      </div>
    </div>
  );
};

export default ProfileBadge;
