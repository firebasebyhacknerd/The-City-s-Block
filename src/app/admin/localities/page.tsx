import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getLocalityStatsAction } from "@/app/actions/admin";
import { PanelShell } from "@/components/portal/PanelShell";

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Listings", href: "/admin/listings" },
  { label: "Users", href: "/admin/users" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Localities", href: "/admin/localities" },
];

export default async function AdminLocalitiesPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const cityStats = await getLocalityStatsAction();

  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell
        title="Operations Console"
        description="Review marketplace quality, monitor demand flow, and keep listings, users, and locality data sharp."
        items={adminNav}
        activeHref="/admin/localities"
      >
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xl font-semibold text-slate-950">Locality content and market coverage</div>
          <p className="mt-1 text-sm text-slate-500">Active listing counts by city, sourced from live data.</p>

          {cityStats.length > 0 ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-slate-600">City</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-600">Active listings</th>
                  </tr>
                </thead>
                <tbody>
                  {cityStats.map((row: any, i: number) => (
                    <tr
                      key={row.city}
                      className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-950">{row.city}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{Number(row.listing_count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              No active listings found. Locality stats will appear here once listings are approved.
            </div>
          )}
        </div>
      </PanelShell>
    </main>
  );
}
