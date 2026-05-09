import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import { PageIntro } from "@/components/portal/PageIntro";
import { ProjectCard } from "@/components/portal/ProjectCard";
import { projects as mockProjects } from "@/lib/portal";
import { getPublicProjectsAction } from "@/app/actions/admin";

export const metadata = {
  title: "New Projects in India | The City's Block",
  description:
    "Browse launch-stage and ready projects with pricing clarity, builder context, and brochure-led discovery across India's top property markets.",
};

export default async function ProjectsPage() {
  let dbProjects: any[] = [];
  try {
    dbProjects = await getPublicProjectsAction();
  } catch {}

  return (
    <main className="container-shell py-10 pb-16">
      <PageIntro
        eyebrow="Projects"
        title="New projects for buyers who want better timing and better context"
        description="Track launches, evaluate ready inventory, and compare builder-led opportunities with clearer price bands, possession cues, and brochure-ready detail."
      />

      {/* DB Projects */}
      {dbProjects.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Featured Projects</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {dbProjects.map((project) => (
              <div key={project.id} className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                {project.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="h-44 w-full object-cover"
                  />
                )}
                <div className="p-5 space-y-2">
                  <div className="font-semibold text-slate-950 text-lg">{project.name}</div>
                  {project.developer && (
                    <div className="text-sm text-slate-500">by {project.developer}</div>
                  )}
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    {project.locality ? `${project.locality}, ` : ""}{project.city}
                  </div>
                  {project.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mock/demo projects */}
      <div className="mt-8">
        {dbProjects.length === 0 && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            <span className="font-semibold">Showing demo projects</span> — live project listings coming soon.
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-3">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
