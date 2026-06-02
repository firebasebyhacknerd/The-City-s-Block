/** Shimmer placeholder for a property listing card */
export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Image placeholder */}
      <div className="h-44 animate-pulse bg-gray-200" />
      <div className="space-y-2.5 p-4">
        {/* Title */}
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        {/* Meta row */}
        <div className="flex gap-3 pt-1">
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
        </div>
        {/* Price row */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-2">
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

/** A full grid of skeleton cards, matching the search results grid */
export function SkeletonGrid({ count = 9 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
