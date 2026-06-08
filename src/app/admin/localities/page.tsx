import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getLocalityStatsAction } from "@/app/actions/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { MapPin } from "lucide-react";

export const metadata = { title: "Localities | Admin Console" };

export default async function AdminLocalitiesPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const cityStats = await getLocalityStatsAction();

  return (
    <AdminShell
      title="Localities"
      subtitle="Active listing counts by city"
      currentPath="/admin/localities"
    >
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="h-4 w-4 text-[#C9A84C]" />
          <div className="text-lg font-semibold text-gray-900">Market Coverage</div>
        </div>
        <p className="text-sm text-gray-500 mb-5">Active listings grouped by city from live data.</p>

        {cityStats.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">City</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Active Listings</th>
                </tr>
              </thead>
              <tbody>
                {cityStats.map((row: any, i: number) => (
                  <tr key={row.city} className={`border-b border-gray-50 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.city}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{Number(row.listing_count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center text-gray-400">
            No active listings yet. Stats will appear once listings are approved.
          </div>
        )}
      </div>
    </AdminShell>
  );
}
