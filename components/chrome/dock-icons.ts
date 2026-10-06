import {
  Briefcase,
  Code,
  FolderOpen,
  Mail,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { SectionId } from "@/types/stage";

// Small key -> icon map shared by the Dock and the mobile TabBar
export const DOCK_ICONS: Record<SectionId, LucideIcon> = {
  overview: Zap,
  "tech-stack": Code,
  projects: FolderOpen,
  experience: Briefcase,
  contact: Mail,
};
