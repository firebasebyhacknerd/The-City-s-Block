"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeIndianRupee,
  Building2,
  LayoutDashboard,
  LogIn,
  MapPinned,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const primaryNav = [
  { href: "/search?listingType=sale", label: "Buy" },
  { href: "/search?listingType=rent", label: "Rent" },
  { href: "/commercial", label: "Commercial" },
  { href: "/projects", label: "New Projects" },
  { href: "/search?featured=true", label: "Top Picks" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-950 p-2 text-amber-300 shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="font-headline text-lg font-semibold tracking-tight text-slate-950">
              The City's Block
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              India Property Portal
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => {
            const active = pathname === item.href.split("?")[0];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className="hidden rounded-full px-4 text-slate-600 md:inline-flex"
          >
            <Link href="/locality/Gurugram/golf-course-road">
              <MapPinned className="h-4 w-4" />
              Localities
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="hidden rounded-full px-4 text-slate-600 xl:inline-flex"
          >
            <Link href="/admin">
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="hidden rounded-full border-slate-200 px-4 md:inline-flex"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          </Button>
          <Button asChild className="hidden rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 sm:inline-flex">
            <Link href="/post-property">
              <BadgeIndianRupee className="h-4 w-4" />
              Post Property <span className="ml-1 rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-amber-600">FREE</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
