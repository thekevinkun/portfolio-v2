import type { Profile } from "@/types/profile";

// Seed input only: scripts/seed.ts loads this into Neon. The site reads the database (D72).
export const profile: Profile = {
  name: "Kevin Mahendra",
  username: "thekevinkun",
  handle: "kevinmahendra",
  locationLabel: "Samarinda, Indonesia",
  timezone: "Asia/Makassar",
  availability: "Open to freelance & full-time",
  availabilityShort: "Open to work",
  avatarUrl: "/placeholder/avatar.svg",
  roleLabel: "Full Stack Developer",
  headline: "Building real-world web applications from end to end",
  intro:
    "Self-taught full stack developer building production-grade web apps, with a focus on payments, booking flows and backend reliability. Mainly Next.js, React, TypeScript and PostgreSQL.",
  contactHeadline: "Let's work together.",
  contactIntro:
    "Open to freelance projects and full-time roles. Email is the best way to reach me; you'll also find me on LinkedIn and GitHub, and my resume is one click away.",
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
  seoTitle: "Kevin Mahendra — Full Stack Developer",
  seoDescription:
    "Self-taught full stack developer building production-grade web apps: payments, booking flows and backend reliability. Next.js, React, TypeScript, PostgreSQL.",
};

export { projects } from "./projects";
export { skillGroups } from "./skill-groups";
export { experienceItems } from "./experience";
