import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMySavedSearchesAction } from "@/app/actions/saved-searches";
import { PanelShell } from "@/components/portal/PanelShell";
import { SavedSearchesClient } from "@/components/dashboard/SavedSearchesClient";

export const metadata = { title: "Saved Searches | Dashboard" };

export default async function SavedSearchesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!["buyer", "agent", "owner"].includes(session.role)) redirect("/dashboard");

  const searches = await getMySavedSearchesAction();
  const role = session.role as "buyer" | "agent" | "owner";

  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell role={role} currentPath="/dashboard/saved-searches">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-950">Saved Searches</h1>
          <p className="mt-1 text-sm text-slate-500">{searches.length} saved</p>
        </div>
        <SavedSearchesClient initialSearches={searches} />
      </PanelShell>
    </main>
  );
}
