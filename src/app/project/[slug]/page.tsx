import Image from "next/image";
import { notFound } from "next/navigation";
import { Building2, CalendarClock, Download, MapPin } from "lucide-react";
import { InquiryForm } from "@/components/portal/InquiryForm";
import { MapPanel } from "@/components/portal/MapPanel";
import { PageIntro } from "@/components/portal/PageIntro";
import { Button } from "@/components/ui/button";
import { getProjectBySlugAction } from "@/app/actions/listings";

export const dynamic = "force-dynamic";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

function formatInr(value: number, short = false) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export async function generateMetadata({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = await getProjectBySlugAction(slug);

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.name} | New Launch in ${project.city}`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = await getProjectBySlugAction(slug);
  if (!project) notFound();

  // Mock dummy listing for the inquiry form since we don't have project-specific listing IDs in DB yet
  const dummyListing = { id: project.id, title: project.name };

  return (
    <main className="container-shell py-10 pb-16">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <PageIntro
            eyebrow="New project"
            title={project.name}
            description={project.description || "Luxurious development in a prime location."}
          />
          <div className="relative aspect-[16/10] overflow-hidden rounded-[32px] bg-slate-100">
            {project.image_url ? (
              <Image src={project.image_url} alt={project.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300">No image available</div>
            )}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">Location</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">
                {project.locality}, {project.city}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">Possession status</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">{project.status}</div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-xl font-semibold text-slate-950">Why buyers are tracking this launch</div>
            <div className="grid gap-4 text-sm leading-7 text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                Prime location in {project.locality}
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-500" />
                Developed by {project.developer || "Bespoke Developers"}
              </div>
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-amber-500" />
                Status: {project.status}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xl font-semibold text-slate-950">Get the project brochure</div>
            <div className="mt-2 text-sm leading-6 text-slate-600">
              Review floor plans, pricing guidance, and launch details before you book a site visit or speak to sales.
            </div>
            <Button className="mt-5 w-full rounded-full bg-slate-950 text-white hover:bg-slate-800">
              <Download className="h-4 w-4 mr-2" />
              Download Project Brochure
            </Button>
          </div>
          
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-950">Send Inquiry</h3>
            <InquiryForm listing={dummyListing as any} />
          </div>
        </div>
      </div>
    </main>
  );
}
