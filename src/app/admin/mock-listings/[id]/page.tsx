import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { MockListingForm } from "@/components/admin/MockListingForm";
import { listings } from "@/lib/portal";

export const metadata = { title: "Edit Property | Admin Console" };

export default async function EditMockListingPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const { id } = await params;
  const listing = listings.find((l) => l.id === id);
  if (!listing) notFound();

  return (
    <AdminShell
      title="Edit Property"
      subtitle={listing.title}
      currentPath="/admin/mock-listings"
    >
      <MockListingForm listing={listing} mode="edit" />
    </AdminShell>
  );
}
