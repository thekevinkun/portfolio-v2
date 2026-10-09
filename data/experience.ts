import type { ExperienceItem } from "@/types/experience";

export const experienceItems: ExperienceItem[] = [
  {
    kind: "work",
    title: "Independent Full Stack Developer",
    organization: "Self-Employed / Personal Projects",
    startDate: "2019-01",
    endDate: null,
    summary:
      "Building and deploying full-stack applications focused on payments, booking systems, backend reliability and real-time data. Each project is treated as a production system, not a prototype: transaction safety, secure data access and real-time updates.",
    summaryShort:
      "Building and deploying full-stack apps focused on payments, booking systems, backend reliability and real-time data.",
    bullets: [],
    // The first 3 bullets of each project show in the wide layout; all 5 in the carousel
    shipped: [
      {
        name: "Kundesk",
        bullets: [
          "Built a multi-tenant SaaS where businesses train an AI assistant on their own documents and serve customers through chat links, embeddable widgets and QR codes",
          "Built KUN, the assistant: retrieval-augmented answers using OpenAI embeddings and pgvector search, streamed over SSE, with live handoff from AI to a human agent",
          "Engineered the backend around tenant isolation, webhooks and rate limiting, backed by automated tests",
          "Made for Indonesian SMEs: owners upload menus, FAQs and price lists, and KUN answers customers 24/7 in Bahasa Indonesia",
          "Shipped with CI/CD on GitHub Actions, Vitest and Playwright tests, and Sentry and PostHog monitoring",
        ],
      },
      {
        name: "Padel Court",
        bullets: [
          "Built a real-time court-booking platform with a live admin dashboard and automated booking management",
          "Implemented live availability, scheduling flows and payment processing",
          "Secured payments with webhook signature validation, idempotency keys and Redis rate limiting",
          "Gave owners a dashboard with insight into revenue, bookings, payments and court usage",
          "Used Supabase Auth and Realtime for sign-in and live updates, with transactional email through Resend",
        ],
      },
      {
        name: "Kun Bookshop",
        bullets: [
          "Built a MERN digital bookstore with Stripe payments, secure downloads and a Dockerized deployment",
          "Implemented JWT auth with refresh-token rotation and protected file access through signed URLs",
          "Added KUN, an AI assistant using OpenAI tool calling and SSE streaming that searches books and manages the cart",
          "Built an in-browser reader for purchased PDF and EPUB books, with previews before buying",
          "Built an admin dashboard to manage the store, with a GraphQL (Apollo) API, Zod validation and Helmet",
        ],
      },
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
