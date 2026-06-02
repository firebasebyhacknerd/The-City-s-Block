"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface AdminMobileNavProps {
  navItems: NavItem[];
  currentPath: string;
}

export function AdminMobileNav({ navItems, currentPath }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
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
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="space-y-0.5 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? currentPath === item.href
              : currentPath.startsWith(item.href) && item.href !== "/";
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
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
    </>
  );
}
