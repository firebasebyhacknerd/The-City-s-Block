import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMyListingByIdAction } from "@/app/actions/listings";
import { EditListingForm } from "@/components/dashboard/EditListingForm";
import { PanelShell } from "@/components/portal/PanelShell";

export const metadata = { title: "Edit Listing | Dashboard" };

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "buyer") redirect("/dashboard");

  const { id } = await params;
  const listing = await getMyListingByIdAction(Number(id));
  if (!listing) notFound();

  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell role={session.role as "agent" | "owner"} currentPath="/dashboard/listings">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-950">Edit Listing</h1>
          <p className="mt-1 text-slate-500">After saving, your listing will need re-approval before going live again.</p>
        </div>
        <EditListingForm listing={listing} />
      </PanelShell>
    </main>
  );
}
