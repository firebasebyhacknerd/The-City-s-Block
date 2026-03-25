import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { localities } from "@/lib/portal";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-400/10 p-2 text-amber-300">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="font-headline text-xl font-semibold text-white">
                The City's Block
              </div>
              <div className="text-sm text-slate-400">
                Trusted property discovery for buying, renting, and evaluating commercial opportunities across India.
              </div>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-400">
            The City's Block helps serious home seekers move from uncertainty to clarity with verified experts, sharper locality insight, and listings worth acting on.
          </p>
          <div className="space-y-2 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-amber-300" />
              hello@citysblock.in
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-amber-300" />
              +91 11 4555 7788
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-300" />
              New Delhi, India
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Explore</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <Link href="/search?listingType=sale" className="hover:text-white">
                Homes for sale
              </Link>
            </li>
            <li>
              <Link href="/search?listingType=rent" className="hover:text-white">
                Homes for rent
              </Link>
            </li>
            <li>
              <Link href="/commercial" className="hover:text-white">
                Commercial
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-white">
                New launch projects
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Hot Localities</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            {localities.slice(0, 4).map((locality) => (
              <li key={locality.id}>
                <Link
                  href={`/locality/${encodeURIComponent(locality.city)}/${locality.slug}`}
                  className="hover:text-white"
                >
                  {locality.displayName}, {locality.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Accounts</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <Link href="/login" className="hover:text-white">
                Sign in securely
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-white">
                Create your account
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white">
                Owner dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white">
                Operations console
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
