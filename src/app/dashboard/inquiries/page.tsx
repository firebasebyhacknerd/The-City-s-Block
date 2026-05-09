import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getBuyerInquiriesAction } from "@/app/actions/listings";
import { PanelShell } from "@/components/portal/PanelShell";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const metadata = { title: "My Inquiries | Dashboard" };

export default async function BuyerInquiriesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "buyer") redirect("/dashboard");

  const inquiries = await getBuyerInquiriesAction();

  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell role="buyer" currentPath="/dashboard/inquiries">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-950">My Inquiries</h1>
          <p className="mt-1 text-sm text-slate-500">{inquiries.length} submitted</p>
        </div>

        {inquiries.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="text-slate-400 mb-4">You haven't submitted any inquiries yet.</div>
            <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800 gap-2">
              <Link href="/search"><Search className="h-4 w-4" /> Browse Properties</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq: any) => (
              <div key={inq.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="font-semibold text-slate-950">{inq.listing_title}</div>
                    <div className="mt-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-3">
                      {inq.message || "No message."}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      {new Date(inq.created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium self-start ${
                    inq.status === "new"       ? "bg-blue-100 text-blue-700" :
                    inq.status === "contacted" ? "bg-amber-100 text-amber-700" :
                    inq.status === "closed"    ? "bg-green-100 text-green-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {inq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </PanelShell>
    </main>
  );
}
