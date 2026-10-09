import type { Profile } from "@/types/profile";

// Mirrors the future `profile` table (P4).
export const profile: Profile = {
  name: "Kevin Mahendra",
  handle: "kevinmahendra",
  locationLabel: "Samarinda, Indonesia",
  timezone: "Asia/Makassar",
  availability: "Open to freelance & full-time",
  avatarUrl: "/placeholder/avatar.svg",
  roleLabel: "Full Stack Developer",
  headline: "Building real-world web applications from end to end",
  intro:
    "Self-taught full stack developer building production-grade web apps, with a focus on payments, booking flows and backend reliability. Mainly Next.js, React, TypeScript and PostgreSQL.",
  email: "kevinmahendra.idn@gmail.com",
  portraitUrl: "/images/profile-picture.png",
  resumeUrl: "/resume/Kevin_Mahendra_FullStackDeveloper_Resume.pdf",
  socials: [
    {
      kind: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/kevinmahendra1997/",
    },
    {
      kind: "github",
      label: "GitHub",
      url: "https://github.com/thekevinkun",
    },
  ],
  chips: [
    "Next.js",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Supabase",
    "Node.js",
    "AI / LLM",
  ],
  focusAreas: [
    "AI SaaS",
    "Booking Systems",
    "Payment Systems",
    "Admin Dashboards",
  ],
};

export { projects } from "./projects";
export { skillGroups } from "./skill-groups";
export { experienceItems } from "./experience";
