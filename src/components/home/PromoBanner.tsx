import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <Link href="/projects" className="group block overflow-hidden rounded-[32px]">
          <div className="relative flex min-h-[160px] items-center justify-between overflow-hidden rounded-[32px] bg-gradient-to-r from-[#1B4332] via-[#1B4332] to-black px-8 py-10 md:min-h-[200px] md:px-16">
            {/* Elegant Background Patterns */}
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#C9A84C]/10 blur-3xl transition-all group-hover:bg-[#C9A84C]/20" />
            <div className="absolute -bottom-12 right-32 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

            <div className="relative z-10 space-y-3">
              <div className="inline-block rounded-full bg-[#C9A84C]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] backdrop-blur-sm border border-[#C9A84C]/30">
                Premium Selection
              </div>
              <h3 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                Bespoke Real Estate <span className="text-[#C9A84C]">Excellence</span>
              </h3>
              <p className="max-w-md text-base text-white/60">
                Access curated investment opportunities and luxury residences with our trusted advisory.
              </p>
            </div>

            <div className="relative z-10 hidden shrink-0 sm:block">
              <span className="inline-block rounded-full bg-[#C9A84C] px-8 py-4 text-sm font-bold text-[#1B4332] shadow-xl transition-all group-hover:scale-105 group-hover:shadow-[#C9A84C]/20">
                Get Started →
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
