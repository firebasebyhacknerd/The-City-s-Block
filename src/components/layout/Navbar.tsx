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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white font-bold text-sm">
            VS
          </div>
          <span className="font-bold text-gray-900 text-lg leading-tight hidden sm:block">
            The City's Block
          </span>
        </Link>

        {/* Desktop primary nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-red-600"
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
              {(session.role === "owner" || session.role === "agent") && (
                <Link href="/dashboard/new-listing" className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700">
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
              <Link href="/signup" className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700">
                <PlusCircle className="h-4 w-4" /> Post FREE
              </Link>
              <Link href="/login" className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
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
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white">
                    <PlusCircle className="h-4 w-4" /> Post FREE
                  </Link>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700">
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
