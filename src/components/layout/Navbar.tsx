"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Home,
  Key,
  Compass,
  Building2,
  Menu,
  X,
  LogIn,
  LayoutDashboard,
  PlusCircle,
  Shield,
  User,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/app/actions/auth";

interface NavbarClientProps {
  session: { name: string; role: string } | null;
}

const primaryNav = [
  { href: "/search?listing_type=sale", label: "Buy", icon: Home },
  { href: "/search?listing_type=rent", label: "Rent", icon: Key },
  { href: "/search", label: "Explore", icon: Compass },
  { href: "/projects", label: "New Projects", icon: Building2 },
];

const secondaryTabs = [
  { href: "/search?listing_type=rent", label: "Rentals" },
  { href: "/projects", label: "New Projects" },
  { href: "/commercial", label: "Commercial" },
  { href: "/search", label: "All Listings" },
];

export function NavbarClient({ session }: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-white">
            <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="4" y="10" width="7" height="16" rx="0.5" fill="#1B4332" />
              <rect x="12.5" y="4" width="7" height="22" rx="0.5" fill="#1B4332" />
              <rect x="21" y="10" width="7" height="16" rx="0.5" fill="#1B4332" />
              <polygon points="7.5,10 4,10 7.5,5" fill="#1B4332" />
              <polygon points="16,4 12.5,4 16,0" fill="#1B4332" />
              <polygon points="24.5,10 21,10 24.5,5" fill="#1B4332" />
            </svg>
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-bold text-[#1B4332] text-lg tracking-tight">The City&apos;s Block</div>
            <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.2em]">Trusted Advisory</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
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
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {session ? (
            <>
              {session.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Shield className="h-4 w-4" /> Admin
                </Link>
              )}
              {session.role === "owner" && (
                <Link
                  href="/dashboard/new-listing"
                  className="btn-brand flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold shadow-sm"
                >
                  <PlusCircle className="h-4 w-4" /> Post FREE
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 outline-none focus:ring-2 focus:ring-[#1B4332]/20">
                  <User className="h-4 w-4" />
                  {session.name.split(" ")[0]}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 mr-2 inline" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      My account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={signOutAction} className="w-full">
                      <button type="submit" className="flex w-full items-center text-red-600 cursor-pointer">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/signup?role=owner"
                className="btn-brand flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold shadow-sm"
              >
                <PlusCircle className="h-4 w-4" /> Post FREE
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-[#C9A84C] hover:text-[#1B4332]"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden min-h-[44px] min-w-[44px]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="hidden border-t border-gray-100 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-1.5">
          {secondaryTabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className="text-xs font-medium text-gray-500 transition hover:text-[#1B4332]"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

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
                  className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/list-property"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#1B4332]"
            >
              <PlusCircle className="h-4 w-4" />
              Sell / Post property
            </Link>
            <div className="mt-3 border-t border-gray-100 pt-3 flex flex-col gap-2">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="btn-brand flex min-h-[44px] items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/signup?role=owner"
                    onClick={() => setMobileOpen(false)}
                    className="btn-brand flex min-h-[44px] items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold"
                  >
                    <PlusCircle className="h-4 w-4" /> Post FREE
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700"
                  >
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
