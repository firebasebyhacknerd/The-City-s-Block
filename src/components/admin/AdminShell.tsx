import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutDashboard, ListChecks, Users, MessageSquare,
  Building2, MapPin, Globe, ChevronRight, FolderKanban
} from "lucide-react";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

const navItems = [
  { href: "/admin",             label: "Dashboard",     icon: LayoutDashboard, exact: true },
  { href: "/admin/listings",    label: "Listings",      icon: ListChecks },
  { href: "/admin/projects",    label: "Projects",      icon: FolderKanban },
  { href: "/admin/mock-listings", label: "Property Data", icon: Building2 },
  { href: "/admin/users",       label: "Users",         icon: Users },
  { href: "/admin/inquiries",   label: "Inquiries",     icon: MessageSquare },
  { href: "/admin/localities",  label: "Localities",    icon: MapPin },
  { href: "/",                  label: "View Site",     icon: Globe },
];

interface AdminShellProps {
  children: ReactNode;
  currentPath: string;
  title: string;
  subtitle?: string;
  /** Optional slot for the notification bell (passed from page RSC) */
  actions?: ReactNode;
}

export function AdminShell({ children, currentPath, title, subtitle, actions }: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-white">
            <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none">
              <rect x="4" y="10" width="7" height="16" rx="0.5" fill="#1B4332" />
              <rect x="12.5" y="4" width="7" height="22" rx="0.5" fill="#1B4332" />
              <rect x="21" y="10" width="7" height="16" rx="0.5" fill="#1B4332" />
              <polygon points="7.5,10 4,10 7.5,5" fill="#1B4332" />
              <polygon points="16,4 12.5,4 16,0" fill="#1B4332" />
              <polygon points="24.5,10 21,10 24.5,5" fill="#1B4332" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-[#1B4332]">The City's Blocks</div>
            <div className="text-[10px] font-semibold text-[#C9A84C] uppercase tracking-wide">Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? currentPath === item.href
              : currentPath.startsWith(item.href) && item.href !== "/";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#1B4332]/10 text-[#1B4332]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <AdminMobileNav navItems={navItems} currentPath={currentPath} />

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">{title}</h1>
              {subtitle && <p className="mt-0.5 text-sm text-gray-500 truncate">{subtitle}</p>}
            </div>

            {/* Actions slot (notification bell, etc.) */}
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6">{children}</div>
      </div>
    </div>
  );
}
