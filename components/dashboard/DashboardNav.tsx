"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "./nav-items";

const linkBase =
  "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-(--duration-micro) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const linkIdle = "text-fg-low hover:bg-glass-fill hover:text-fg-high";

// A row that scrolls sideways on phones, a column in the sidebar from lg
const DashboardNav = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard"
      className="no-scrollbar flex gap-1 overflow-x-auto px-3 py-2 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-4 lg:py-6"
    >
      {NAV_ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              linkBase,
              active ? "bg-glass-active text-fg-high" : linkIdle,
            )}
          >
            {item.label}
          </Link>
        );
      })}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(linkBase, linkIdle, "lg:mt-4")}
      >
        View site ↗
      </a>
    </nav>
  );
};

export default DashboardNav;
