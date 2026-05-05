import Link from "next/link";
import { Building2, LayoutDashboard, LogIn, Shield, PlusCircle, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { signOutAction } from "@/app/actions/auth";

const primaryNav = [
  { href: "/search?listing_type=sale", label: "Buy" },
  { href: "/search?listing_type=rent", label: "Rent" },
  { href: "/search?asset_class=commercial", label: "Commercial" },
  { href: "/projects", label: "New Projects" },
];

export default async function Navbar() {
  const session = await getSession();

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
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              {session.role === "admin" && (
                <Button asChild variant="outline" className="hidden rounded-full border-slate-200 md:inline-flex gap-1.5">
                  <Link href="/admin"><Shield className="h-4 w-4" /> Admin</Link>
                </Button>
              )}
              {(session.role === "owner" || session.role === "agent") && (
                <>
                  <Button asChild className="hidden rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 sm:inline-flex gap-1.5">
                    <Link href="/dashboard/new-listing"><PlusCircle className="h-4 w-4" /> Post FREE</Link>
                  </Button>
                  <Button asChild variant="outline" className="hidden rounded-full border-slate-200 md:inline-flex gap-1.5">
                    <Link href="/dashboard"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                  </Button>
                </>
              )}
              <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5">
                <User className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-700 hidden md:block">{session.name.split(" ")[0]}</span>
              </div>
              <form action={signOutAction}>
                <Button variant="ghost" size="sm" className="rounded-full gap-1.5 text-slate-600">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:block">Sign out</span>
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild className="hidden rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 sm:inline-flex gap-1.5">
                <Link href="/signup"><PlusCircle className="h-4 w-4" /> Post FREE</Link>
              </Button>
              <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800 gap-1.5">
                <Link href="/login"><LogIn className="h-4 w-4" /> Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
