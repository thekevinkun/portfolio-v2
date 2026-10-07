import type { ExperienceItem } from "@/types/experience";

export const experienceItems: ExperienceItem[] = [
  {
    kind: "work",
    title: "Independent Full Stack Developer",
    organization: "Self-Employed / Personal Projects",
    startDate: "2019-01",
    endDate: null,
    summary:
      "Building and deploying full-stack applications focused on payments, booking systems, backend reliability and real-time data.",
    bullets: [
      "Built a court-booking platform with Midtrans payments: webhook validation, payment verification and idempotency to prevent duplicate transactions (Padel Court)",
      "Built a digital bookstore with Stripe and secure file delivery so only verified buyers can read purchased books (Kun Bookshop)",
      "Developed AI assistants on contextual data: product search and cart help in Kun Bookshop, document-trained support in Kundesk",
      "Used Supabase Realtime subscriptions for live admin dashboard updates (Padel Court)",
    ],
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Supabase",
      "Midtrans",
      "Stripe",
    ],
    sort: 1,
    visible: true,
  },
  {
    kind: "education",
    title: "Computer Science & Web Development",
    organization: "Self-directed",
    startDate: "2019-01",
    endDate: null,
    summary:
      "Self-directed study in computer science and modern web development, through structured coursework and hands-on projects.",
    bullets: [
      "CS50 (Harvard University) — programming, algorithms and data structures in C",
      "freeCodeCamp — full-stack web development: HTML, CSS, JavaScript, React and backend fundamentals",
      "Modern web stack (self-directed) — Next.js, TypeScript, PostgreSQL and real-world application architecture",
    ],
    tags: [
      "Full-stack system design",
      "Payment integration",
      "Real-time data handling",
      "API integration & performance",
    ],
    sort: 2,
    visible: true,
  },
];
