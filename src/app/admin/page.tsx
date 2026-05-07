import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getAdminStatsAction } from "@/app/actions/admin";
import { signOutAction } from "@/app/actions/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import {
  LogOut, ListChecks, Users, MessageSquare,
  Building2, Clock, CheckCircle2
} from "lucide-react";

export const metadata = { title: "Admin Console | The City's Blocks" };

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/dashboard");

  const stats = await getAdminStatsAction();

  const statCards = [
    { label: "Active Listings", value: stats.activeListings, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending Approval", value: stats.pendingListings, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Inquiries", value: stats.totalInquiries, icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <AdminShell title="Dashboard" subtitle="Overview of your platform activity" currentPath="/admin">
      {/* Sign out */}
      <div className="mb-6 flex justify-end">
        <form action={signOutAction}>
          <Button variant="outline" size="sm" className="rounded-full gap-2 text-gray-600">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </form>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">{s.label}</div>
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
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/listings" className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-[#1B4332]/30 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2.5">
              <ListChecks className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Manage Listings</div>
              <div className="text-xs text-gray-500">Approve, reject, feature DB listings</div>
            </div>
          </div>
          {stats.pendingListings > 0 && (
            <div className="mt-3 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
              {stats.pendingListings} listing{stats.pendingListings > 1 ? "s" : ""} pending approval
            </div>
          )}
        </Link>

        <Link href="/admin/mock-listings" className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-[#1B4332]/30 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2.5">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Property Data</div>
              <div className="text-xs text-gray-500">Add/edit Ahmedabad offices & bungalows</div>
            </div>
          </div>
        </Link>

        <Link href="/admin/users" className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-[#1B4332]/30 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2.5">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Users</div>
              <div className="text-xs text-gray-500">Manage roles, verify, ban users</div>
            </div>
          </div>
        </Link>

        <Link href="/admin/inquiries" className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-[#1B4332]/30 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2.5">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Inquiries</div>
              <div className="text-xs text-gray-500">View all buyer inquiries</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Pending alert */}
      {stats.pendingListings > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 font-semibold text-amber-800">
            <Clock className="h-4 w-4" />
            Pending Actions
          </div>
          <p className="mt-1 text-sm text-amber-700">
            {stats.pendingListings} listing{stats.pendingListings > 1 ? "s are" : " is"} waiting for approval.{" "}
            <Link href="/admin/listings" className="font-semibold underline">Review now →</Link>
          </p>
        </div>
      )}
    </AdminShell>
  );
}
