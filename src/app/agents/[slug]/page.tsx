import { notFound } from "next/navigation";
import { ListingCard } from "@/components/portal/ListingCard";
import { PageIntro } from "@/components/portal/PageIntro";
import { getListingsForProfile, getProfile } from "@/lib/portal";

type AgentPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile || profile.role !== "agent") notFound();

  const inventory = getListingsForProfile(profile.id);

  return (
    <main className="container-shell py-10 pb-16">
      <PageIntro
        eyebrow="Agent profile"
        title={profile.name}
        description={`Work with a verified market specialist who helps buyers and renters narrow choices faster and move with more confidence. ${profile.bio}`}
      />
      <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
          <div>Advisory firm: {profile.companyName}</div>
          <div>Primary market: {profile.city}</div>
          <div>Trust status: {profile.verificationStatus}</div>
        </div>
      </div>
      <section className="mt-8 space-y-4">
        <div className="text-2xl font-semibold text-slate-950">Listings this expert is actively representing</div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {inventory.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </main>
  );
}
