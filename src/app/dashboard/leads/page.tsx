import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMyInquiriesAction } from "@/app/actions/listings";
import { PanelShell } from "@/components/portal/PanelShell";
import { InquiryStatusButton } from "@/components/dashboard/InquiryStatusButton";

export const metadata = { title: "Leads | Dashboard" };

export default async function LeadsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "buyer") redirect("/dashboard");

  const inquiries = await getMyInquiriesAction();
  const leadsLabel = session.role === "agent" ? "Client Inquiries" : "Buyer Inquiries";

  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell role={session.role as "agent" | "owner"} currentPath="/dashboard/leads">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-950">{leadsLabel}</h1>
          <p className="mt-1 text-sm text-slate-500">{inquiries.length} total</p>
        </div>

        {inquiries.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-sm text-slate-400">
            No inquiries yet. Once buyers contact you, they'll appear here.
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div key={inq.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="font-semibold text-slate-950">{inq.buyer_name}</div>
                    <div className="text-sm text-slate-500 mt-0.5">
                      {inq.buyer_email} • {inq.buyer_phone}
                    </div>
                    <div className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-xl p-3">
                      {inq.message || "No message provided."}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      For: <span className="text-slate-600">{inq.listing_title}</span> • {inq.listing_city}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <InquiryStatusButton id={inq.id} currentStatus={inq.status} />
                    <div className="text-xs text-slate-400">
                      {new Date(inq.created_at).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PanelShell>
    </main>
  );
}
