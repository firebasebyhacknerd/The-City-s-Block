import { ListingCard } from "@/components/portal/ListingCard";
import { PageIntro } from "@/components/portal/PageIntro";
import { listings } from "@/lib/portal";

export default function FavoritesPage() {
  return (
    <main className="container-shell py-10 pb-16">
      <PageIntro
        eyebrow="Favorites"
        title="Saved inventory"
        description="A buyer-facing shortlist view retained as a convenience route alongside the new account and dashboard flows."
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {listings.slice(0, 4).map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </main>
  );
}
