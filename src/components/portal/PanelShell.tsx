import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Home, GitBranch, MessageSquare,
  Search, User, Heart, PlusCircle
} from "lucide-react";

// ─── Role-based nav configs ───────────────────────────────────────────────────

const BROKER_NAV = (role: "agent" | "owner") => [
  { label: "Overview",       href: "/dashboard" },
  { label: "Listings",       href: "/dashboard/listings" },
  { label: "New Listing",    href: "/dashboard/new-listing" },
  { label: "Pipeline",       href: "/dashboard/pipeline" },
  { label: role === "agent" ? "Client Inquiries" : "Buyer Inquiries", href: "/dashboard/leads" },
  { label: "Saved Searches", href: "/dashboard/saved-searches" },
  { label: "Profile",        href: "/dashboard/profile" },
];

const BUYER_NAV = [
  { label: "Overview",       href: "/dashboard" },
  { label: "Saved Listings", href: "/dashboard/favorites" },
  { label: "Inquiries",      href: "/dashboard/inquiries" },
  { label: "Saved Searches", href: "/dashboard/saved-searches" },
  { label: "Profile",        href: "/dashboard/profile" },
];

const ROLE_TITLES: Record<string, string> = {
  agent: "Agent Dashboard",
  owner: "Owner Dashboard",
  buyer: "My Dashboard",
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  agent: "Manage your listings, track client inquiries, and grow your portfolio.",
  owner: "Post and manage your properties, track buyer interest.",
  buyer: "Track your saved listings, inquiries, and searches.",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface PanelShellProps {
  children: React.ReactNode;
  // New role-based API
  role?: "buyer" | "agent" | "owner";
  currentPath?: string;
  // Legacy API (kept for backward compat)
  title?: string;
  description?: string;
  items?: Array<{ label: string; href: string }>;
  activeHref?: string;
}

export function PanelShell({
  children,
  role,
  currentPath,
  title,
  description,
  items,
  activeHref,
}: PanelShellProps) {
  // Derive nav items and labels from role if provided
  const navItems = role
    ? role === "buyer"
      ? BUYER_NAV
      : BROKER_NAV(role as "agent" | "owner")
    : (items ?? []);

  const resolvedTitle = title ?? (role ? ROLE_TITLES[role] : "Dashboard");
  const resolvedDescription = description ?? (role ? ROLE_DESCRIPTIONS[role] : "");
  const resolvedActiveHref = currentPath ?? activeHref ?? "";

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm self-start">
        <div className="mb-5 px-2">
          <div className="text-xl font-semibold text-slate-950">{resolvedTitle}</div>
          {resolvedDescription && (
            <div className="mt-1 text-sm leading-6 text-slate-500">{resolvedDescription}</div>
          )}
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === "/dashboard"
              ? resolvedActiveHref === "/dashboard"
              : resolvedActiveHref.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
