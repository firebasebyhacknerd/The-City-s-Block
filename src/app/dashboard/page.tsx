import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getBrokerStatsAction, getCustomerStatsAction } from "@/app/actions/listings";
import { getMyNotificationsAction, getUnreadCountAction } from "@/app/actions/notifications";
import { signOutAction } from "@/app/actions/auth";
import { PanelShell } from "@/components/portal/PanelShell";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle, LogOut, Search, Heart, MessageSquare,
  CheckCircle2, Clock, BarChart2, ShieldCheck
} from "lucide-react";

export const metadata = { title: "Dashboard | The City's Block" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "admin") redirect("/admin");

  // ── Broker panel ──────────────────────────────────────────────────────────
  if (session.role === "agent" || session.role === "owner") {
    let stats: Awaited<ReturnType<typeof getBrokerStatsAction>> = null;
    let notifications: Awaited<ReturnType<typeof getMyNotificationsAction>> = [];
    let unreadCount = 0;
    try {
      [stats, notifications, unreadCount] = await Promise.all([
        getBrokerStatsAction(),
        getMyNotificationsAction(),
        getUnreadCountAction(),
      ]);
    } catch {
      // Fallback to empty state on error
    }

    const leadsLabel = session.role === "agent" ? "Client Inquiries" : "Buyer Inquiries";
    const isEmpty = !stats || (stats.activeListings === 0 && stats.pendingListings === 0);

    return (
      <main className="container-shell py-10 pb-16">
        <PanelShell role={session.role} currentPath="/dashboard">
          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">
                Welcome, {session.name}
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">{session.role}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell
                initialNotifications={notifications}
                initialUnreadCount={unreadCount}
              />
              <form action={signOutAction}>
                <Button variant="outline" size="sm" className="rounded-full gap-2">
                  <LogOut className="h-4 w-4" /> Sign out
                </Button>
              </form>
            </div>
          </div>

          {isEmpty ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-sm">
              <div className="text-slate-400 mb-4">No listings yet. Post your first property to get started.</div>
              <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
                <Link href="/dashboard/new-listing">
                  <PlusCircle className="h-4 w-4 mr-2" /> Post your first listing
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
                {[
                  { label: "Active Listings",    value: stats?.activeListings ?? 0,         icon: CheckCircle2, color: "text-green-600",  bg: "bg-green-50" },
                  { label: "Pending Approval",   value: stats?.pendingListings ?? 0,         icon: Clock,        color: "text-amber-600",  bg: "bg-amber-50" },
                  { label: "Total Inquiries",    value: stats?.totalInquiries ?? 0,          icon: MessageSquare,color: "text-purple-600", bg: "bg-purple-50" },
                  { label: `New ${leadsLabel} (30d)`, value: stats?.newInquiriesLast30Days ?? 0, icon: BarChart2, color: "text-blue-600",   bg: "bg-blue-50" },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-500">{s.label}</div>
                        <div className={`rounded-lg p-2 ${s.bg}`}>
                          <Icon className={`h-4 w-4 ${s.color}`} />
                        </div>
                      </div>
                      <div className={`mt-3 text-3xl font-bold ${s.color}`}>{s.value}</div>
                    </div>
                  );
                })}
              </div>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800 gap-2">
                  <Link href="/dashboard/new-listing"><PlusCircle className="h-4 w-4" /> Post Listing</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full gap-2">
                  <Link href="/dashboard/pipeline"><BarChart2 className="h-4 w-4" /> Pipeline</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full gap-2">
                  <Link href="/dashboard/leads"><MessageSquare className="h-4 w-4" /> {leadsLabel}</Link>
                </Button>
              </div>

              {/* Recent listings with inquiry counts */}
              {stats && stats.listingsWithInquiryCounts.length > 0 && (
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-950">My Listings</h2>
                    <Button asChild size="sm" variant="outline" className="rounded-full">
                      <Link href="/dashboard/listings">View all</Link>
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {stats.listingsWithInquiryCounts.slice(0, 5).map((l) => (
                      <div key={l.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                        <div>
                          <div className="font-medium text-slate-950">{l.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{l.inquiry_count} inquir{l.inquiry_count === 1 ? "y" : "ies"}</div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                          l.status === "active" ? "bg-green-100 text-green-700" :
                          l.status === "pending" ? "bg-amber-100 text-amber-700" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {l.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </PanelShell>
      </main>
    );
  }

  // ── Customer (buyer) panel ────────────────────────────────────────────────
  let stats = { savedListings: 0, inquiries: 0, savedSearches: 0 };
  try {
    stats = await getCustomerStatsAction();
  } catch {
    // Fallback to zeros
  }
  const hasActivity = stats.savedListings > 0 || stats.inquiries > 0 || stats.savedSearches > 0;

  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell role="buyer" currentPath="/dashboard">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">Welcome, {session.name}</h1>
            <p className="mt-1 text-sm text-slate-500">Your property search hub</p>
          </div>
          <form action={signOutAction}>
            <Button variant="outline" size="sm" className="rounded-full gap-2">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </form>
        </div>

        {!hasActivity ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="text-slate-400 mb-2 text-lg font-medium">Welcome to your dashboard</div>
            <p className="text-slate-400 text-sm mb-6">
              Start searching for properties, save your favourites, and track your inquiries here.
            </p>
            <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800 gap-2">
              <Link href="/search"><Search className="h-4 w-4" /> Browse Properties</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              {[
                { label: "Saved Listings",  value: stats.savedListings,  href: "/dashboard/favorites",      icon: Heart,         color: "text-rose-600",   bg: "bg-rose-50" },
                { label: "Inquiries Sent",  value: stats.inquiries,      href: "/dashboard/inquiries",      icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Saved Searches",  value: stats.savedSearches,  href: "/dashboard/saved-searches", icon: Search,        color: "text-blue-600",   bg: "bg-blue-50" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <Link key={s.label} href={s.href} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-500">{s.label}</div>
                      <div className={`rounded-lg p-2 ${s.bg}`}>
                        <Icon className={`h-4 w-4 ${s.color}`} />
                      </div>
                    </div>
                    <div className={`mt-3 text-3xl font-bold ${s.color}`}>{s.value}</div>
                  </Link>
                );
              })}
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800 gap-2">
                <Link href="/search"><Search className="h-4 w-4" /> Search Properties</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full gap-2">
                <Link href="/dashboard/favorites"><Heart className="h-4 w-4" /> Saved Listings</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full gap-2">
                <Link href="/dashboard/inquiries"><MessageSquare className="h-4 w-4" /> My Inquiries</Link>
              </Button>
            </div>
          </>
        )}
      </PanelShell>
    </main>
  );
}
