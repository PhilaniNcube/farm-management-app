"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive: boolean;
}

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  farms: "Farms",
  crops: "Crops",
  livestock: "Livestock",
  tasks: "Tasks",
  transactions: "Transactions",
  labor: "Labor",
  equipment: "Equipment",
  analytics: "Analytics",
  settings: "Settings",
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Add home/dashboard as the first item
  breadcrumbs.push({
    label: "Dashboard",
    href: "/dashboard",
    isActive: pathname === "/dashboard",
  });

  // Generate breadcrumbs from path segments
  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Skip the first 'dashboard' segment since we already added it
    if (segment === "dashboard" && i === 0) continue;

    // Skip route groups like (dashboard)
    if (segment.startsWith("(") && segment.endsWith(")")) continue;

    // Skip organization IDs (usually start with "org_")
    if (segment.startsWith("org_")) continue;

    const label =
      routeLabels[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1);
    const isActive = i === segments.length - 1;

    breadcrumbs.push({
      label,
      href: currentPath,
      isActive,
    });
  }

  return breadcrumbs;
}

export function Breadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = generateBreadcrumbs(pathname);

  // Don't show breadcrumbs on the main dashboard page
  if (pathname === "/dashboard" || pathname === "/") {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.slice(1).map((item, index) => (
        <React.Fragment key={item.href}>
          <ChevronRight className="h-4 w-4" />
          {item.isActive ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
