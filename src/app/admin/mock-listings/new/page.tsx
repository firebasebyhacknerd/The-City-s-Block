import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { MockListingForm } from "@/components/admin/MockListingForm";

export const metadata = { title: "Add Property | Admin Console" };

export default async function NewMockListingPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  return (
    <AdminShell
      title="Add Property"
      subtitle="Add a new office or bungalow listing"
      currentPath="/admin/mock-listings"
    >
      <MockListingForm mode="new" />
    </AdminShell>
  );
}
