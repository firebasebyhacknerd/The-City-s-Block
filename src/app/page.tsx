import Link from "next/link";
import { ArrowRight, Building2, Landmark, Search, ShieldCheck, Sparkles } from "lucide-react";
import { DbListingCard } from "@/components/portal/DbListingCard";
import { LocalityCard } from "@/components/portal/LocalityCard";
import { MetricCard } from "@/components/portal/MetricCard";
import { PageIntro } from "@/components/portal/PageIntro";
import { ProjectCard } from "@/components/portal/ProjectCard";
import { Button } from "@/components/ui/button";
import { formatInr, localities, projects } from "@/lib/portal";
import { getHomepageListingsAction } from "@/app/actions/listings";

export const metadata = {
  title: "The City's Block | Buy, Rent, and Discover Property Across India",
  description:
    "Find verified homes, high-potential localities, and new projects across India with expert-backed guidance and sharper property discovery.",
};

export default async function HomePage() {
  const { featured, commercial, stats } = await getHomepageListingsAction();

  return (
    <main>
      <section className="container-shell py-10 md:py-16">
        <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-slate-950 px-6 py-10 text-white shadow-2xl md:px-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                <Sparkles className="h-4 w-4 text-amber-300" />
                Verified homes. Smarter locality insight. Better decisions.
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl font-headline text-5xl font-semibold tracking-tight md:text-6xl">
                  Find the right property in India without second-guessing every step.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  Search homes, rentals, new launches, and commercial spaces with clearer filters, stronger locality context, and trusted experts who help you move faster.
                </p>
              </div>
              <form action="/search" className="grid gap-3 rounded-[28px] border border-white/10 bg-white/5 p-4 md:grid-cols-[1.1fr_1fr_1fr_auto]">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">City / locality</span>
                  <input
                    name="q"
                    placeholder="Search by city, locality, landmark, or project"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Intent</span>
                  <select
                    name="listing_type"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white focus:outline-none"
                    defaultValue="sale"
                  >
                    <option value="sale">Buy</option>
                    <option value="rent">Rent</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Asset class</span>
                  <select
                    name="asset_class"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white focus:outline-none"
                    defaultValue="residential"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </label>
                <Button className="mt-6 h-12 rounded-2xl bg-amber-400 px-6 text-slate-950 hover:bg-amber-300 md:mt-auto">
                  <Search className="h-4 w-4" />
                  Explore Now
                </Button>
              </form>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard label="Active listings" value={`${stats.activeListings}+`} tone="dark" />
              <MetricCard label="Verified experts" value="4" tone="dark" />
              <MetricCard label="Projects to evaluate" value="3" tone="dark" />
              <MetricCard label="Cities in focus" value={`${stats.cities}`} tone="dark" />
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 sm:col-span-2">
                <div className="flex items-center gap-3 text-amber-300">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-medium">Why serious seekers start here</span>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-300">
                  <div>Shortlist homes with stronger confidence using verified inventory signals.</div>
                  <div>Compare localities with market context, not just glossy photos.</div>
                  <div>Connect with responsive experts when you are ready to inspect or negotiate.</div>
                  <div>Move from browsing to action with clearer search paths across every category.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <PageIntro
          eyebrow="Featured inventory"
          title="Homes and spaces worth your attention first"
          description="Each featured listing is positioned to help buyers and renters understand the location, the value, and the next step without wading through noise."
        />
        {featured.length === 0 ? (
          <p className="mt-8 text-sm text-slate-500">
            No featured listings yet — check back soon
          </p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((listing) => (
              <DbListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      <section className="container-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <PageIntro
              eyebrow="Commercial"
              title="Commercial property with sharper decision signals"
              description="Evaluate offices, retail, and income assets with clearer positioning, stronger market context, and direct access to the people behind the listing."
            />
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <div className="flex items-start gap-3">
                <Landmark className="mt-1 h-4 w-4 text-amber-500" />
                Explore Grade A offices, high-street retail, and strategic warehouse opportunities.
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="mt-1 h-4 w-4 text-amber-500" />
                Move from broad search to meaningful conversations with owners, builders, and advisors.
              </div>
            </div>
            <Button asChild className="mt-8 rounded-full bg-slate-950 text-white hover:bg-slate-800">
              <Link href="/commercial">
                View commercial opportunities
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {commercial.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {commercial.map((listing) => (
                <DbListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="flex items-end justify-between gap-4">
          <PageIntro
            eyebrow="New projects"
            title="New launches for buyers who want an early advantage"
            description="Review launch-stage and ready projects with pricing bands, possession clarity, builder context, and stronger brochure-led action."
          />
          <Button asChild variant="outline" className="rounded-full border-slate-200">
            <Link href="/projects">Browse all projects</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="flex items-end justify-between gap-4">
          <PageIntro
            eyebrow="Locality intelligence"
            title="Locality pages that explain why an area matters"
            description="Go beyond inventory counts with market cues, surrounding landmarks, and neighborhood context that helps narrow your shortlist with conviction."
          />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {localities.map((locality) => (
            <LocalityCard key={locality.id} locality={locality} />
          ))}
        </div>
      </section>

      <section className="container-shell py-10 pb-16">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <PageIntro
                eyebrow="Why buyers stay"
                title="A more confident way to search"
                description="From first search to final inquiry, every part of the experience is designed to reduce friction, strengthen trust, and make the next move feel obvious."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard label="Project pricing range" value={`${formatInr(9200000, true)} - ${formatInr(145000000, true)}`} />
              <MetricCard label="Ways to connect" value="Call, inquiry, WhatsApp" />
              <MetricCard label="Expert coverage" value="Buy, rent, projects, commercial" />
              <MetricCard label="Decision support" value="Locality insight + verified experts" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
