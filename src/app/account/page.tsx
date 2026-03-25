import { PageIntro } from "@/components/portal/PageIntro";
import { savedSearches, inquiries, listings } from "@/lib/portal";

export const metadata = {
  title: "My Account | The City's Block",
  description:
    "Track your saved searches, shortlisted properties, and recent conversations in one place.",
};

export default function AccountPage() {
  return (
    <main className="container-shell py-10 pb-16">
      <PageIntro
        eyebrow="Account"
        title="Everything guiding your next property move, in one place"
        description="Keep your alerts, conversations, and shortlisted homes close so you can return with clarity instead of starting over."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Active alerts</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">{savedSearches.length}</div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Recent conversations</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">{inquiries.length}</div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Shortlisted homes</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">4</div>
        </div>
      </div>
      <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold text-slate-950">Recent properties you may want to revisit</div>
        <div className="mt-4 grid gap-3 text-sm text-slate-600">
          {listings.slice(0, 4).map((listing) => (
            <div key={listing.id} className="rounded-2xl bg-slate-50 px-4 py-3">
              {listing.title}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
