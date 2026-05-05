import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMyListingByIdAction } from "@/app/actions/listings";
import { EditListingForm } from "@/components/dashboard/EditListingForm";

export const metadata = { title: "Edit Listing | Dashboard" };

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const listing = await getMyListingByIdAction(Number(id));
  if (!listing) notFound();

  return (
    <main className="container-shell py-10 pb-16">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-950">Edit Listing</h1>
        <p className="mt-1 text-slate-500">After saving, your listing will need re-approval before going live again.</p>
      </div>
      <EditListingForm listing={listing} />
    </main>
  );
}
