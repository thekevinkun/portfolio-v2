import { cn } from "@/lib/cn";
import type { TechIcon } from "./tech-icons";

interface TechLogoProps {
  // The resolved icon, or null for the letter fallback
  icon: TechIcon | null;
  name: string;
  className?: string;
}

// A tech logo, or the first letter of its name in a small box when none exists
const TechLogo = ({ icon: Icon, name, className }: TechLogoProps) => {
  if (Icon) return <Icon className={className} aria-hidden />;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center rounded-[3px] border border-glass-border text-[8px] leading-none font-bold",
        className,
      )}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
};

export default TechLogo;
