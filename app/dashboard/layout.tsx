import type { Metadata } from "next";
import type { ReactNode } from "react";

// The whole dashboard stays out of search results (robots.ts disallows it too)
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}
