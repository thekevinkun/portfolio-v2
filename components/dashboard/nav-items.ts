export interface NavItem {
  href: string;
  label: string;
  // Active only on the exact path (the Overview link)
  exact?: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/tech-stack", label: "Tech Stack" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/categories", label: "Categories" },
  { href: "/dashboard/experience", label: "Experience" },
];
