export default function PropertyLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb shimmer */}
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="h-3 w-10 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-2 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-14 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-2 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 h-4 w-28 animate-pulse rounded bg-gray-200" />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left content */}
          <div className="space-y-5">
            {/* Image grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 h-72 animate-pulse rounded-xl bg-gray-200" />
              <div className="h-44 animate-pulse rounded-xl bg-gray-200" />
              <div className="h-44 animate-pulse rounded-xl bg-gray-200" />
            </div>

            {/* Title block */}
            <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
              </div>
              <div className="h-7 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                  <div className="mx-auto mb-2 h-5 w-5 animate-pulse rounded bg-gray-200" />
                  <div className="mx-auto h-4 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="mx-auto mt-1 h-3 w-12 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>

            {/* Description block */}
            <div className="space-y-2 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`h-3 animate-pulse rounded bg-gray-200 ${i === 3 ? "w-2/3" : "w-full"}`} />
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Price */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="h-8 w-36 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-200" />
            </div>

            {/* Contact */}
            <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
              <div className="h-11 w-full animate-pulse rounded-lg bg-gray-200" />
              <div className="h-11 w-full animate-pulse rounded-lg bg-gray-200" />
            </div>

            {/* EMI Calculator placeholder */}
            <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="h-9 w-full animate-pulse rounded-lg bg-gray-200" />
                </div>
              ))}
              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
