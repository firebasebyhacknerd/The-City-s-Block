import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMyFavoritesAction } from "@/app/actions/listings";
import { PanelShell } from "@/components/portal/PanelShell";
import { FavoritesClient } from "@/components/dashboard/FavoritesClient";

export const metadata = { title: "Saved Listings | Dashboard" };

export default async function FavoritesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "buyer") redirect("/dashboard");

  const listings = await getMyFavoritesAction();

  return (
    <main className="container-shell py-10 pb-16">
      <PanelShell role="buyer" currentPath="/dashboard/favorites">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-950">Saved Listings</h1>
          <p className="mt-1 text-sm text-slate-500">{listings.length} saved</p>
        </div>
        <FavoritesClient initialListings={listings} />
      </PanelShell>
    </main>
  );
}
