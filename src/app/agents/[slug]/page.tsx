import { notFound } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { getAgentBySlugAction } from "@/app/actions/admin";
import { DbListingCard } from "@/components/portal/DbListingCard";
import { PageIntro } from "@/components/portal/PageIntro";

type AgentPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const result = await getAgentBySlugAction(slug);

  if (!result) notFound();

  const { user, listings } = result;

  return (
    <main className="container-shell py-10 pb-16">
      <PageIntro
        eyebrow="Agent profile"
        title={user.name}
        description={
          user.bio ||
          "Work with a verified market specialist who helps buyers and renters narrow choices faster and move with more confidence."
        }
      />

      <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
          {user.company && <div>Advisory firm: {user.company}</div>}
          {user.city && <div>Primary market: {user.city}</div>}
          <div className="flex items-center gap-1.5">
            Trust status:{" "}
            {user.verified ? (
              <span className="flex items-center gap-1 text-green-700 font-medium">
                <CheckCircle className="h-4 w-4" /> Verified
              </span>
            ) : (
              <span className="text-slate-400">Unverified</span>
            )}
          </div>
        </div>
      </div>

      <section className="mt-8 space-y-4">
        <div className="text-2xl font-semibold text-slate-950">
          Listings this expert is actively representing
        </div>
        {listings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing: any) => (
              <DbListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-500">
            This agent has no active listings at the moment.
          </div>
        )}
      </section>
    </main>
  );
}
