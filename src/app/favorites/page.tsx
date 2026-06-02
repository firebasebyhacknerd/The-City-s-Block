import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMyFavoritesAction } from "@/app/actions/listings";
import { DbListingCard } from "@/components/portal/DbListingCard";
import { Heart } from "lucide-react";

export default async function FavoritesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const listings = await getMyFavoritesAction();

  return (
    <main className="container-shell py-10 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-950">Saved Listings</h1>
        <p className="mt-1 text-slate-500">Properties you&apos;ve saved for later.</p>
      </div>
      {listings.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-sm">
          <Heart className="h-10 w-10 mx-auto text-slate-300 mb-4" />
          <div className="text-slate-400">No saved listings yet. Click the heart icon on any listing to save it.</div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {listings.map((listing) => (
            <DbListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
