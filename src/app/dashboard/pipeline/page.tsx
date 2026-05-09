import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPipelineAction } from "@/app/actions/admin";
import { PanelShell } from "@/components/portal/PanelShell";
import { PipelineBoard } from "@/components/dashboard/PipelineBoard";

export const metadata = { title: "Pipeline | Dashboard" };

export default async function PipelinePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!["agent", "owner"].includes(session.role)) redirect("/dashboard");

  const pipeline = await getPipelineAction();

  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell role={session.role as "agent" | "owner"} currentPath="/dashboard/pipeline">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-950">Pipeline</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your leads through the sales process
          </p>
        </div>
        <PipelineBoard initialInquiries={pipeline as any} />
      </PanelShell>
    </main>
  );
}
