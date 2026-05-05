import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getAdminStatsAction } from "@/app/actions/admin";
import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut, ListChecks, Users, MessageSquare, LayoutDashboard } from "lucide-react";

export const metadata = { title: "Admin Console | The City's Block" };

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/dashboard");

  const stats = await getAdminStatsAction();

  return (
    <main className="container-shell py-10 pb-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Admin Console</h1>
          <p className="mt-1 text-slate-500">Manage listings, users, and platform activity.</p>
        </div>
        <form action={signOutAction}>
          <Button variant="outline" className="rounded-full gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {[
          { label: "Active listings", value: stats.activeListings, color: "text-green-600" },
          { label: "Pending approval", value: stats.pendingListings, color: "text-amber-600" },
          { label: "Total users", value: stats.totalUsers, color: "text-blue-600" },
          { label: "Total inquiries", value: stats.totalInquiries, color: "text-slate-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">{stat.label}</div>
            <div className={`mt-2 text-3xl font-semibold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Nav */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800 gap-2">
          <Link href="/admin/listings"><ListChecks className="h-4 w-4" /> Listings {stats.pendingListings > 0 && `(${stats.pendingListings} pending)`}</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full gap-2">
          <Link href="/admin/users"><Users className="h-4 w-4" /> Users</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full gap-2">
          <Link href="/admin/inquiries"><MessageSquare className="h-4 w-4" /> Inquiries</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full gap-2">
          <Link href="/"><LayoutDashboard className="h-4 w-4" /> View Site</Link>
        </Button>
      </div>

      {/* Quick info */}
      <div className="rounded-[28px] border border-amber-100 bg-amber-50 p-6">
        <div className="font-medium text-amber-900 mb-2">Pending actions</div>
        {stats.pendingListings === 0 ? (
          <div className="text-sm text-amber-700">All listings are reviewed. Nothing pending.</div>
        ) : (
          <div className="text-sm text-amber-700">
            {stats.pendingListings} listing{stats.pendingListings > 1 ? "s" : ""} waiting for approval.{" "}
            <Link href="/admin/listings" className="font-medium underline">Review now →</Link>
          </div>
        )}
      </div>
    </main>
  );
}
