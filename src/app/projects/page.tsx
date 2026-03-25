import { PageIntro } from "@/components/portal/PageIntro";
import { ProjectCard } from "@/components/portal/ProjectCard";
import { projects } from "@/lib/portal";

export const metadata = {
  title: "New Projects in India | The City's Block",
  description:
    "Browse launch-stage and ready projects with pricing clarity, builder context, and brochure-led discovery across India's top property markets.",
};

export default function ProjectsPage() {
  return (
    <main className="container-shell py-10 pb-16">
      <PageIntro
        eyebrow="Projects"
        title="New projects for buyers who want better timing and better context"
        description="Track launches, evaluate ready inventory, and compare builder-led opportunities with clearer price bands, possession cues, and brochure-ready detail."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}
