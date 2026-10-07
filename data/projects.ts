import type { Project } from "@/types/projects";

export const projects: Project[] = [
  {
    slug: "kundesk",
    title: "Kundesk",
    kicker: "AI SAAS PLATFORM",
    summary:
      "Multi-tenant AI customer service SaaS where businesses train an assistant on their own documents.",
    filter: "full-stack",
    status: "live",
    logoUrl: null,
    tech: ["Next.js", "TypeScript", "PostgreSQL", "pgvector", "OpenAI"],
    links: [
      { kind: "live", label: "Live Demo", url: "https://kundesk.vercel.app/" },
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/kundesk",
      },
    ],
    featured: true,
    sort: 1,
    visible: true,
  },
  {
    slug: "padel-court",
    title: "Padel Court Batu Alam Permai",
    kicker: "BOOKING SYSTEM",
    summary:
      "Court booking platform with Midtrans payments and a real-time owner dashboard for revenue and usage.",
    filter: "full-stack",
    status: "live",
    logoUrl: null,
    tech: ["Next.js", "TypeScript", "Supabase", "Midtrans", "Upstash Redis"],
    links: [
      {
        kind: "live",
        label: "Live Demo",
        url: "https://padelbatualampermai.vercel.app/",
      },
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/padel-court",
      },
    ],
    featured: true,
    sort: 2,
    visible: true,
  },
  {
    slug: "kun-bookshop",
    title: "Kun Bookshop",
    kicker: "E-COMMERCE & READER",
    summary:
      "MERN digital bookstore with an in-browser PDF/EPUB reader, Stripe checkout and an AI shopping assistant.",
    filter: "full-stack",
    status: "live",
    logoUrl: null,
    tech: ["React", "Express", "Node.js", "MongoDB", "Stripe", "OpenAI"],
    links: [
      {
        kind: "live",
        label: "Live Demo",
        url: "https://kunbookshop.up.railway.app/",
      },
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/kun-bookshop",
      },
    ],
    featured: true,
    sort: 3,
    visible: true,
  },
  {
    slug: "chainkuns",
    title: "Chainkuns",
    kicker: "WEB3 TICKETING",
    summary:
      "Event ticketing where tickets are NFTs, with on-chain validation and a resale marketplace with royalties.",
    filter: "web3",
    status: "live",
    logoUrl: null,
    tech: ["Next.js", "TypeScript", "Solidity", "Supabase", "Wagmi"],
    links: [
      {
        kind: "live",
        label: "Live Demo",
        url: "https://chainkuns.vercel.app/",
      },
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/chainkuns",
      },
    ],
    featured: false,
    sort: 4,
    visible: true,
  },
  {
    slug: "carikopi",
    title: "Carikopi",
    kicker: "LOCATION & MAPS",
    summary:
      "Location-based coffee finder with Google Places search, map pins, directions and saved favorites.",
    filter: "full-stack",
    status: "live",
    logoUrl: null,
    tech: ["Next.js", "TypeScript", "MongoDB", "Redis", "Google Places API"],
    links: [
      {
        kind: "live",
        label: "Live Demo",
        url: "https://carikopiapp.vercel.app/",
      },
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/cari-kopi",
      },
    ],
    featured: false,
    sort: 5,
    visible: true,
  },
  {
    slug: "pacomovies",
    title: "PacoMovies",
    kicker: "MOVIE DISCOVERY",
    summary:
      "Movie discovery app with real-time search, infinite scroll, a trailer player and a personal watchlist.",
    filter: "full-stack",
    status: "live",
    logoUrl: null,
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Redis"],
    links: [
      {
        kind: "live",
        label: "Live Demo",
        url: "https://pacomovies.vercel.app/",
      },
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/paco-movies",
      },
    ],
    featured: false,
    sort: 6,
    visible: true,
  },
  {
    slug: "darkmint",
    title: "DarkMint",
    kicker: "WEB3 CERTIFICATES",
    summary:
      "AI-generated certificates stored on IPFS and minted as NFTs on the blockchain.",
    filter: "web3",
    status: "live",
    logoUrl: null,
    tech: ["Next.js", "TypeScript", "Solidity", "Hardhat", "OpenAI API"],
    links: [
      {
        kind: "live",
        label: "Live Demo",
        url: "https://darkmint-web.vercel.app/",
      },
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/darkmint",
      },
    ],
    featured: false,
    sort: 7,
    visible: true,
  },
  {
    slug: "mahakam-gate-residence",
    title: "Mahakam Gate Residence",
    kicker: "LANDING PAGE",
    summary:
      "Responsive, SEO-optimized landing page with a built-in mortgage (KPR) calculator.",
    filter: "frontend",
    status: "live",
    logoUrl: null,
    tech: ["Next.js", "React", "Tailwind CSS", "Formik", "Leaflet"],
    links: [
      {
        kind: "live",
        label: "Live Demo",
        url: "https://mahakamgateresidence.vercel.app/",
      },
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/mahakam-gate-residence",
      },
    ],
    featured: false,
    sort: 8,
    visible: true,
  },
  {
    slug: "virtual-reality",
    title: "Virtual Reality",
    kicker: "FIGMA TO CODE",
    summary:
      "Figma-to-code conversion of a Virtual Reality landing page, with animations and a responsive layout.",
    filter: "frontend",
    status: "live",
    logoUrl: null,
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    links: [
      {
        kind: "live",
        label: "Live Demo",
        url: "https://vr-futureplay.vercel.app/",
      },
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/vr-futureplay",
      },
    ],
    featured: false,
    sort: 9,
    visible: true,
  },
  {
    slug: "cat-breeds",
    title: "Cat Breeds",
    kicker: "INTERACTIVE ENCYCLOPEDIA",
    summary:
      "Interactive encyclopedia of cat breeds with smooth animations and parallax scrolling.",
    filter: "frontend",
    status: "live",
    logoUrl: null,
    tech: ["Next.js", "React", "JavaScript", "CSS", "Lottie"],
    links: [
      {
        kind: "live",
        label: "Live Demo",
        url: "https://catbreedsencyclopedia.vercel.app/",
      },
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/cat-breeds",
      },
    ],
    featured: false,
    sort: 10,
    visible: true,
  },
  {
    slug: "travel-indonesia",
    title: "Travel Indonesia",
    kicker: "LANDING PAGE",
    summary:
      "Animated landing page for Indonesian destinations with a Framer Motion and Embla slider.",
    filter: "frontend",
    status: "live",
    logoUrl: null,
    tech: ["React", "CSS", "Framer Motion", "Embla Slider"],
    links: [
      {
        kind: "live",
        label: "Live Demo",
        url: "https://thekevinkun.github.io/travel-indonesia/",
      },
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/travel-indonesia",
      },
    ],
    featured: false,
    sort: 11,
    visible: true,
  },
  {
    slug: "tic-tac-toe",
    title: "Tic Tac Toe",
    kicker: "GAME · MINIMAX",
    summary:
      "Web Tic Tac Toe to play against a Minimax computer opponent or a friend.",
    filter: "game",
    status: "live",
    logoUrl: null,
    tech: ["React", "Vite", "Redux", "Tailwind CSS"],
    links: [
      {
        kind: "live",
        label: "Live Demo",
        url: "https://thekevinkun.github.io/tic-tac-toe/",
      },
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/tic-tac-toe",
      },
    ],
    featured: false,
    sort: 12,
    visible: true,
  },
  {
    slug: "bank-management-system",
    title: "Bank Management System",
    kicker: "CLI APPLICATION",
    summary:
      "Command-line banking app in C++ with authentication, transactions and SQLite3 storage.",
    filter: "systems",
    status: "completed",
    logoUrl: null,
    tech: ["C++", "SQLite3", "OpenSSL", "GNU Make"],
    links: [
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/bank-management-system",
      },
    ],
    featured: false,
    sort: 13,
    visible: true,
  },
  {
    slug: "contact-management-system",
    title: "Contact Management System",
    kicker: "CLI APPLICATION",
    summary:
      "Command-line contact manager in C with a custom hash table and CSV persistence.",
    filter: "systems",
    status: "completed",
    logoUrl: null,
    tech: ["C", "Hash Table", "CSV Parsing", "GNU Make"],
    links: [
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/contact-management-system",
      },
    ],
    featured: false,
    sort: 14,
    visible: true,
  },
  {
    slug: "tic-tac-toe-c",
    title: "Tic Tac Toe (C)",
    kicker: "GAME · MINIMAX",
    summary:
      "Unbeatable command-line Tic Tac Toe in C, powered by the Minimax algorithm.",
    filter: "systems",
    status: "completed",
    logoUrl: null,
    tech: ["C", "Minimax Algorithm"],
    links: [
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/thekevinkun/c-tic-tac-toe",
      },
    ],
    featured: false,
    sort: 15,
    visible: true,
  },
];
