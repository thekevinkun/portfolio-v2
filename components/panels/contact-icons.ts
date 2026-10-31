import type { ComponentType } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiUpwork } from "react-icons/si";
import type { SocialLink } from "@/types/profile";

export type ContactIconKey = SocialLink["kind"];

// Indexed directly (never returned from a function): React Compiler lint
export const CONTACT_ICONS: Record<
  ContactIconKey,
  ComponentType<{ className?: string }>
> = {
  linkedin: FaLinkedin,
  upwork: SiUpwork,
  github: FaGithub,
};
