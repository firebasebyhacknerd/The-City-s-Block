import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PanelShell } from "@/components/portal/PanelShell";

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Listings", href: "/admin/listings" },
  { label: "Users", href: "/admin/users" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Localities", href: "/admin/localities" },
];

export default async function AdminProjectsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell
        title="Operations Console"
        description="Review marketplace quality, monitor demand flow, and keep listings, users, and locality data sharp."
        items={adminNav}
        activeHref="/admin/projects"
      >
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xl font-semibold text-slate-950">Project curation and launch quality</div>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <div className="text-base font-medium text-slate-700">
              Project management is not yet connected to the database.
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Projects will be manageable here in a future update. Once connected, you will be able to create, edit, and publish new project listings directly from this panel.
            </p>
          </div>
        </div>
      </PanelShell>
    </main>
  );
}
