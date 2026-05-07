import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <Link href="/projects" className="block overflow-hidden rounded-2xl">
          <div className="relative flex min-h-[140px] items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-8 py-8 md:min-h-[160px] md:px-12">
            {/* Background circles */}
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative z-10 space-y-2">
              <p className="text-sm font-medium text-red-100">Discover Premium Properties</p>
              <h3 className="text-2xl font-bold text-white md:text-3xl">
                Find Your Dream Home Today
              </h3>
              <p className="text-sm text-red-100">
                1000+ verified properties across India's top cities
              </p>
            </div>

            <div className="relative z-10 hidden shrink-0 sm:block">
              <span className="inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-red-600 shadow-lg transition hover:bg-red-50">
                Explore Now →
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
