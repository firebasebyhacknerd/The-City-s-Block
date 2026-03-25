import { notFound } from "next/navigation";
import { ListingCard } from "@/components/portal/ListingCard";
import { PageIntro } from "@/components/portal/PageIntro";
import { ProjectCard } from "@/components/portal/ProjectCard";
import { getListingsForProfile, getProfile, projects } from "@/lib/portal";

type BuilderPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile || profile.role !== "builder") notFound();

  const inventory = getListingsForProfile(profile.id);
  const builderProjects = projects.filter((project) => project.builderId === profile.id);

  return (
    <main className="container-shell py-10 pb-16">
      <PageIntro
        eyebrow="Builder profile"
        title={profile.companyName || profile.name}
        description={`Explore projects and inventory from a builder with a clearer market story, stronger launch context, and buyer-ready presentation. ${profile.bio}`}
      />
      <section className="mt-8 space-y-4">
        <div className="text-2xl font-semibold text-slate-950">Projects shaping this builder's reputation</div>
        <div className="grid gap-6 lg:grid-cols-3">
          {builderProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
      <section className="mt-8 space-y-4">
        <div className="text-2xl font-semibold text-slate-950">Available inventory from this builder</div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {inventory.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </main>
  );
}
