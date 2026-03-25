import Image from "next/image";
import { notFound } from "next/navigation";
import { Building2, CalendarClock, Download, MapPin } from "lucide-react";
import { InquiryForm } from "@/components/portal/InquiryForm";
import { MapPanel } from "@/components/portal/MapPanel";
import { PageIntro } from "@/components/portal/PageIntro";
import { Button } from "@/components/ui/button";
import { buildCanonical, formatInr, getLocality, getProject, getProjectBuilder, listings } from "@/lib/portal";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: `${project.name} | New Launch in ${project.city}`,
    description: project.summary,
    alternates: { canonical: buildCanonical(`/project/${project.slug}`) },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const builder = getProjectBuilder(project);
  const locality = getLocality(project.localitySlug);
  const projectInquiryListing = listings.find((listing) => listing.projectId === project.id) || listings[0];
  const projectInquiryProfile = builder || getProjectBuilder(project);

  return (
    <main className="container-shell py-10 pb-16">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <PageIntro
            eyebrow="New project"
            title={project.name}
            description={project.summary}
          />
          <div className="relative aspect-[16/10] overflow-hidden rounded-[32px]">
            <Image src={project.coverImage} alt={project.name} fill className="object-cover" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">Indicative price band</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">
                {formatInr(project.minPrice, true)} - {formatInr(project.maxPrice, true)}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">Available configurations</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">
                {project.configurations.join(" • ")}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">Possession confidence</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">{project.status}</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-xl font-semibold text-slate-950">Why buyers are tracking this launch</div>
              <div className="grid gap-4 text-sm leading-7 text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  {locality?.displayName}, {project.city}
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-500" />
                  Builder reputation: {builder?.companyName || builder?.name}
                </div>
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-amber-500" />
                  Expected possession: {project.possessionDate}
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.amenities.map((amenity) => (
                  <span key={amenity} className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-700">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <MapPanel
              item={{
                coordinates: locality?.coordinates || projectInquiryListing.coordinates,
                address: `${locality?.displayName}, ${project.city}`,
                name: project.name,
              }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xl font-semibold text-slate-950">Get the project brochure</div>
            <div className="mt-2 text-sm leading-6 text-slate-600">
              Review floor plans, pricing guidance, and launch details before you book a site visit or speak to sales.
            </div>
            <Button asChild className="mt-5 rounded-full bg-slate-950 text-white hover:bg-slate-800">
              <a href={project.brochureUrl}>
                <Download className="h-4 w-4" />
                Download Project Brochure
              </a>
            </Button>
          </div>
          {projectInquiryProfile ? (
            <InquiryForm listing={projectInquiryListing} profile={projectInquiryProfile} />
          ) : null}
        </div>
      </div>
    </main>
  );
}
