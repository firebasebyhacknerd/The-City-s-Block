import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getAllInquiriesAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Inquiries | Admin Console" };

export default async function AdminInquiriesPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const inquiries = await getAllInquiriesAction();

  return (
    <main className="container-shell py-10 pb-16">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link href="/admin"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-2xl font-semibold text-slate-950">All Inquiries ({inquiries.length})</h1>
      </div>

      {inquiries.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-sm text-slate-400">
          No inquiries yet.
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="font-semibold text-slate-950">{inq.buyer_name}</div>
                  <div className="text-sm text-slate-500">{inq.buyer_email} • {inq.buyer_phone}</div>
                  <div className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-xl p-3">
                    {inq.message || "No message."}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Listing: <span className="text-slate-600">{inq.listing_title}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    inq.status === "new" ? "bg-blue-100 text-blue-700" :
                    inq.status === "contacted" ? "bg-green-100 text-green-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {inq.status}
                  </span>
                  <div className="text-xs text-slate-400">
                    {new Date(inq.created_at).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
