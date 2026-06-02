import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { MockListingTable } from "@/components/admin/MockListingTable";
import { listings } from "@/lib/portal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata = { title: "Property Data | Admin Console" };

export default async function MockListingsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const officeListings = listings.filter((l) => l.propertyType === "Office Space");
  const bungalowListings = listings.filter((l) => l.propertyType === "Villa");
  const otherListings = listings.filter((l) => !["Office Space", "Villa"].includes(l.propertyType));

  return (
    <AdminShell
      title="Property Data"
      subtitle={`${listings.length} total properties · ${officeListings.length} offices · ${bungalowListings.length} bungalows`}
      currentPath="/admin/mock-listings"
    >
      {/* Add new button */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          These are your Ahmedabad office and bungalow listings shown on the homepage.
        </p>
        <Button asChild className="gap-2 rounded-lg bg-[#1B4332] text-white hover:bg-[#1B4332]/90">
          <Link href="/admin/mock-listings/new">
            <Plus className="h-4 w-4" /> Add Property
          </Link>
        </Button>
      </div>

      {/* Office Spaces */}
      {officeListings.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-base font-semibold text-gray-800">
            Office Spaces for Rent ({officeListings.length})
          </h2>
          <MockListingTable listings={officeListings} />
        </div>
      )}

      {/* Bungalows */}
      {bungalowListings.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-base font-semibold text-gray-800">
            Bungalows for Sale ({bungalowListings.length})
          </h2>
          <MockListingTable listings={bungalowListings} />
        </div>
      )}

      {/* Other */}
      {otherListings.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-base font-semibold text-gray-800">
            Other ({otherListings.length})
          </h2>
          <MockListingTable listings={otherListings} />
        </div>
      )}
    </AdminShell>
  );
}
