import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import sql from "@/lib/db";
import { PageIntro } from "@/components/portal/PageIntro";

export const metadata = {
  title: "My Account | The City's Block",
  description:
    "Track your saved searches, shortlisted properties, and recent conversations in one place.",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [inquiryRows, favoritesRows] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM inquiries WHERE buyer_email = ${session.email}`,
    sql`SELECT COUNT(*) as count FROM favorites WHERE user_id = ${session.id}`,
  ]);

  const inquiryCount = Number(inquiryRows[0]?.count ?? 0);
  const favoritesCount = Number(favoritesRows[0]?.count ?? 0);

  return (
    <main className="container-shell py-10 pb-16">
      <PageIntro
        eyebrow="Account"
        title={`Welcome back, ${session.name}`}
        description="Keep your alerts, conversations, and shortlisted homes close so you can return with clarity instead of starting over."
      />

      <div className="mt-4 text-sm text-slate-500">{session.email}</div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Recent conversations</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">{inquiryCount}</div>
          <div className="mt-1 text-xs text-slate-400">Inquiries submitted</div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Shortlisted homes</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">{favoritesCount}</div>
          <div className="mt-1 text-xs text-slate-400">Saved favorites</div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Account role</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950 capitalize">{session.role}</div>
          <div className="mt-1 text-xs text-slate-400">Your access level</div>
        </div>
      </div>

      <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold text-slate-950">Quick links</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/favorites"
            className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            View saved favorites
          </Link>
          {["owner", "agent", "admin"].includes(session.role) && (
            <Link
              href="/dashboard"
              className="rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              Go to dashboard
            </Link>
          )}
          <Link
            href="/search"
            className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Browse listings
          </Link>
        </div>
      </div>
    </main>
  );
}
