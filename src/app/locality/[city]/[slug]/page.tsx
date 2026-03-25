import { notFound } from "next/navigation";
import { ListingCard } from "@/components/portal/ListingCard";
import { LocalityCard } from "@/components/portal/LocalityCard";
import { MapPanel } from "@/components/portal/MapPanel";
import { ProjectCard } from "@/components/portal/ProjectCard";
import {
  buildCanonical,
  formatInr,
  getListingsForLocality,
  getLocalityBySlug,
  getProjectsForLocality,
  localities,
} from "@/lib/portal";

type LocalityDetailProps = {
  params: Promise<{ city: string; slug: string }>;
};

export async function generateMetadata({ params }: LocalityDetailProps) {
  const { city, slug } = await params;
  const locality = getLocalityBySlug(city, slug);

  if (!locality) return {};

  return {
    title: `${locality.displayName}, ${locality.city} | Area Guide and Property Trends`,
    description: locality.overview,
    alternates: {
      canonical: buildCanonical(`/locality/${encodeURIComponent(locality.city)}/${locality.slug}`),
    },
  };
}

export default async function LocalityDetailPage({ params }: LocalityDetailProps) {
  const { city, slug } = await params;
  const locality = getLocalityBySlug(city, slug);
  if (!locality) notFound();

  const localityListings = getListingsForLocality(locality.slug);
  const localityProjects = getProjectsForLocality(locality.slug);

  return (
    <main className="container-shell py-10 pb-16">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="text-sm font-medium uppercase tracking-[0.24em] text-amber-600">
              Locality guide
            </div>
            <h1 className="font-headline text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {locality.displayName}, {locality.city}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">{locality.overview}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">Average price / sq.ft.</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">
                {formatInr(locality.avgPricePerSqft)}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">Rental performance</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">{locality.rentalYield}</div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">Current inventory</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">
                {localityListings.length} active listings
              </div>
            </div>
          </div>
          <MapPanel
            item={{
              coordinates: locality.coordinates,
              address: `${locality.displayName}, ${locality.city}`,
              displayName: locality.displayName,
            }}
          />
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xl font-semibold text-slate-950">Why this micro-market stays in demand</div>
          <div className="mt-5 grid gap-5 text-sm leading-7 text-slate-600 md:grid-cols-2">
            <div>
              <div className="mb-2 font-medium text-slate-950">What makes the area compelling</div>
              {locality.highlights.map((entry) => (
                <div key={entry}>{entry}</div>
              ))}
            </div>
            <div>
              <div className="mb-2 font-medium text-slate-950">Landmarks that shape daily life</div>
              {locality.landmarks.map((landmark) => (
                <div key={landmark}>{landmark}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {localityProjects.length ? (
        <section className="mt-10 space-y-5">
          <div className="text-2xl font-semibold text-slate-950">Projects drawing attention here</div>
          <div className="grid gap-6 lg:grid-cols-3">
            {localityProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10 space-y-5">
        <div className="text-2xl font-semibold text-slate-950">Homes and spaces available now</div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {localityListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-5">
        <div className="text-2xl font-semibold text-slate-950">Compare with other high-interest localities</div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {localities
            .filter((entry) => entry.slug !== locality.slug)
            .map((entry) => (
              <LocalityCard key={entry.id} locality={entry} />
            ))}
        </div>
      </section>
    </main>
  );
}
