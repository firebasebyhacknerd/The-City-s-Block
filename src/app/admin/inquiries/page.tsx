import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getAllInquiriesAction } from "@/app/actions/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { getMyNotificationsAction, getUnreadCountAction } from "@/app/actions/notifications";
import { Phone, Mail, MessageSquare, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Inquiries | Admin Console" };

export default async function AdminInquiriesPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const [inquiries, notifications, unreadCount] = await Promise.all([
    getAllInquiriesAction(),
    getMyNotificationsAction(),
    getUnreadCountAction(),
  ]);

  const newCount = inquiries.filter((i: any) => i.status === "new").length;

  return (
    <AdminShell
      title="Inquiries"
      subtitle={`${inquiries.length} total · ${newCount} new`}
      currentPath="/admin/inquiries"
      actions={
        <NotificationBell
          initialNotifications={notifications}
          initialUnreadCount={unreadCount}
          isAdmin
        />
      }
    >
      {inquiries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center text-gray-400">
          No inquiries yet.
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq: any) => (
            <div key={inq.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900">{inq.buyer_name}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      inq.status === "new"
                        ? "bg-blue-100 text-blue-700"
                        : inq.status === "contacted"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {inq.status}
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-3 text-sm text-gray-500">
                    <a href={`mailto:${inq.buyer_email}`} className="flex items-center gap-1 hover:text-[#1B4332]">
                      <Mail className="h-3.5 w-3.5" />
                      {inq.buyer_email}
                    </a>
                    <a href={`tel:${inq.buyer_phone}`} className="flex items-center gap-1 hover:text-[#1B4332]">
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

                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <span>Re: <span className="font-medium text-gray-600">{inq.listing_title}</span></span>
                    <span>·</span>
                    <span>{new Date(inq.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    {inq.listing_id && (
                      <>
                        <span>·</span>
                        <Link
                          href={`/listings/${inq.listing_id}`}
                          target="_blank"
                          className="flex items-center gap-0.5 text-[#1B4332] hover:underline"
                        >
                          View listing <ExternalLink className="h-3 w-3" />
                        </Link>
                      </>
                    )}
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
