import Link from "next/link";
import { Building2, User, ArrowRight } from "lucide-react";

export function FindYourHome() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-[#1B4332] md:text-4xl">Discover Bespoke Properties</h2>
          <p className="mx-auto max-w-2xl text-base text-gray-500">Your journey towards an elevated lifestyle begins with our curated selections.</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2">
          {/* New Projects card */}
          <Link
            href="/projects"
            className="group relative flex items-center justify-between overflow-hidden rounded-[32px] border border-[#1B4332]/10 bg-gradient-to-br from-[#1B4332]/5 to-[#1B4332]/10 p-8 transition-all hover:shadow-xl hover:border-[#C9A84C]/30"
          >
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#1B4332] p-2.5 text-white shadow-lg">
                  <Building2 className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold text-[#1B4332]">New Projects</span>
              </div>
              <p className="text-sm font-medium text-[#1B4332]/60">Explore exclusive new launches & upcoming developments</p>
            </div>
            <div className="relative z-10 flex items-center gap-2 rounded-full bg-[#1B4332] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all group-hover:bg-[#C9A84C] group-hover:text-[#1B4332]">
              Explore <ArrowRight className="h-4 w-4" />
            </div>
            {/* Subtle background decoration */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#C9A84C]/10 blur-2xl transition-all group-hover:bg-[#C9A84C]/20" />
          </Link>

          {/* Owner listings card */}
          <Link
            href="/search?postedBy=owner"
            className="group relative flex items-center justify-between overflow-hidden rounded-[32px] border border-[#C9A84C]/20 bg-gradient-to-br from-[#C9A84C]/5 to-[#C9A84C]/10 p-8 transition-all hover:shadow-xl hover:border-[#1B4332]/30"
          >
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#C9A84C] p-2.5 text-[#1B4332] shadow-lg">
                  <User className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold text-[#1B4332]">Owner Listings</span>
              </div>
              <p className="text-sm font-medium text-[#1B4332]/60">Directly connect with owners for verified property deals</p>
            </div>
            <div className="relative z-10 flex items-center gap-2 rounded-full bg-[#1B4332] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all group-hover:bg-[#C9A84C] group-hover:text-[#1B4332]">
              Explore <ArrowRight className="h-4 w-4" />
            </div>
            {/* Subtle background decoration */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#1B4332]/10 blur-2xl transition-all group-hover:bg-[#1B4332]/20" />
          </Link>
        </div>
      </div>
    </section>
  );
}
