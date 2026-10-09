import { Mail } from "lucide-react";
import type { ComponentType } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import type { SocialLink } from "@/types/profile";

export type ContactIconKey = "email" | SocialLink["kind"];

// Indexed directly (never returned from a function): React Compiler lint
export const CONTACT_ICONS: Record<
  ContactIconKey,
  ComponentType<{ className?: string }>
> = {
  email: Mail,
  linkedin: FaLinkedin,
  github: FaGithub,
};
