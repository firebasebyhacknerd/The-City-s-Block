"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Home, TrendingUp, Compass, Building2, Menu, X,
  LogIn, LogOut, LayoutDashboard, PlusCircle, Shield, User, ChevronDown
} from "lucide-react";

interface NavbarClientProps {
  session: { name: string; role: string } | null;
}

const primaryNav = [
  { href: "/search?listing_type=sale", label: "Buy", icon: Home },
  { href: "/search?listing_type=sale", label: "Sell", icon: TrendingUp },
  { href: "/search", label: "Explore", icon: Compass },
  { href: "/projects", label: "New Projects", icon: Building2 },
];

const secondaryTabs = [
  { href: "/agents", label: "Top Agents" },
  { href: "/projects", label: "Popular Projects" },
  { href: "/search", label: "Top Localities" },
];

export function NavbarClient({ session }: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Primary nav row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {/* Brand mark: gold ring + dark green buildings */}
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-white">
            <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              {/* Left building */}
              <rect x="4" y="10" width="7" height="16" rx="0.5" fill="#1B4332" />
              {/* Middle tall building */}
              <rect x="12.5" y="4" width="7" height="22" rx="0.5" fill="#1B4332" />
              {/* Right building */}
              <rect x="21" y="10" width="7" height="16" rx="0.5" fill="#1B4332" />
              {/* Roof peaks */}
              <polygon points="7.5,10 4,10 7.5,5" fill="#1B4332" />
              <polygon points="16,4 12.5,4 16,0" fill="#1B4332" />
              <polygon points="24.5,10 21,10 24.5,5" fill="#1B4332" />
            </svg>
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-bold text-[#1B4332] text-lg tracking-tight">The City's Block</div>
            <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.2em]">Trusted Advisory</div>
          </div>
        </Link>

        {/* Desktop primary nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-[#1B4332]/5 hover:text-[#1B4332]"
              >
                <Icon className="h-4 w-4" />
                {item.label}
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </Link>
            );
          })}
        </nav>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 lg:flex">
          {session ? (
            <>
              {session.role === "admin" && (
                <Link href="/admin" className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                  <Shield className="h-4 w-4" /> Admin
                </Link>
              )}
              {(session.role === "owner" || session.role === "agent" || session.role === "builder") && (
                <Link href="/dashboard/new-listing" className="flex items-center gap-1.5 rounded-full bg-[#1B4332] px-5 py-2 text-sm font-bold text-white transition-all hover:bg-[#1B4332]/90 hover:shadow-lg">
                  <PlusCircle className="h-4 w-4" /> Post FREE
                </Link>
              )}
              <Link href="/dashboard" className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700">
                <User className="h-4 w-4" />
                {session.name.split(" ")[0]}
              </div>
            </>
          ) : (
            <>
              <Link href="/signup" className="flex items-center gap-1.5 rounded-full bg-[#1B4332] px-5 py-2 text-sm font-bold text-white transition-all hover:bg-[#1B4332]/90 hover:shadow-lg active:scale-95">
                <PlusCircle className="h-4 w-4" /> Post FREE
              </Link>
              <Link href="/login" className="flex items-center gap-1.5 rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-[#C9A84C] hover:text-[#1B4332]">
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Secondary tabs row */}
      <div className="hidden border-t border-gray-100 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-1.5">
          {secondaryTabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className="text-xs font-medium text-gray-500 transition hover:text-red-600"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 border-t border-gray-100 pt-3 flex flex-col gap-2">
              {session ? (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-full bg-[#1B4332] px-4 py-3 text-sm font-bold text-white">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-full bg-[#1B4332] px-4 py-3 text-sm font-bold text-white">
                    <PlusCircle className="h-4 w-4" /> Post FREE
                  </Link>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700">
                    <LogIn className="h-4 w-4" /> Sign in
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
