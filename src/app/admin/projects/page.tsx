import { PanelShell } from "@/components/portal/PanelShell";
import { projects } from "@/lib/portal";

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Listings", href: "/admin/listings" },
  { label: "Users", href: "/admin/users" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Localities", href: "/admin/localities" },
];

export default function AdminProjectsPage() {
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
          <div className="mt-5 space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="font-medium text-slate-950">{project.name}</div>
                <div className="text-sm text-slate-500">
                  {project.city} • {project.status} • {project.configurations.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PanelShell>
    </main>
  );
}
