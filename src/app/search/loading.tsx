import { SkeletonGrid } from "@/components/shared/SkeletonCard";

export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar shimmer */}
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-2">
            <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar shimmer */}
          <aside className="h-fit space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-9 w-full animate-pulse rounded-lg bg-gray-200" />
              </div>
            ))}
            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
          </aside>

          {/* Results shimmer */}
          <section>
            <div className="mb-4 h-4 w-36 animate-pulse rounded bg-gray-200" />
            <SkeletonGrid count={9} />
          </section>
        </div>
      </div>
    </main>
  );
}
