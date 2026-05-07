import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllInquiriesAction } from "@/app/actions/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { Phone, Mail, MessageSquare } from "lucide-react";

export const metadata = { title: "Inquiries | Admin Console" };

export default async function AdminInquiriesPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const inquiries = await getAllInquiriesAction();
  const newCount = inquiries.filter((i: any) => i.status === "new").length;

  return (
    <AdminShell
      title="Inquiries"
      subtitle={`${inquiries.length} total · ${newCount} new`}
      currentPath="/admin/inquiries"
    >
      {inquiries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center text-gray-400">
          No inquiries yet.
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq: any) => (
            <div
              key={inq.id}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900">{inq.buyer_name}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        inq.status === "new"
                          ? "bg-blue-100 text-blue-700"
                          : inq.status === "contacted"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-3 text-sm text-gray-500">
                    <a
                      href={`mailto:${inq.buyer_email}`}
                      className="flex items-center gap-1 hover:text-[#1B4332]"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {inq.buyer_email}
                    </a>
                    <a
                      href={`tel:${inq.buyer_phone}`}
                      className="flex items-center gap-1 hover:text-[#1B4332]"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {inq.buyer_phone}
                    </a>
                  </div>

                  {inq.message && (
                    <div className="mt-2 flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                      <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                      {inq.message}
                    </div>
                  )}

                  <div className="mt-2 text-xs text-gray-400">
                    Re:{" "}
                    <span className="font-medium text-gray-600">{inq.listing_title}</span>
                    {" · "}
                    {new Date(inq.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
