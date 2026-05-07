import Link from "next/link";
import { Building2, User, ArrowRight } from "lucide-react";

export function FindYourHome() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Find your next home</h2>
        <p className="mb-8 text-sm text-gray-500">Your search for the perfect home starts here.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* New Projects card */}
          <Link
            href="/projects"
            className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gradient-to-br from-red-50 to-orange-50 p-6 shadow-sm transition hover:shadow-md hover:border-red-200"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-gray-900">New projects</span>
              </div>
              <p className="text-sm text-gray-500">Explore new launches</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-red-700">
              Explore <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          {/* Owner listings card */}
          <Link
            href="/search?postedBy=owner"
            className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm transition hover:shadow-md hover:border-blue-200"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Owner listings</span>
              </div>
              <p className="text-sm text-gray-500">Direct from owners</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-blue-700">
              Explore <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
