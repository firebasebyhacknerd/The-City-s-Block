import Image from "next/image";
import Link from "next/link";
import { MapPin, Building2, CalendarClock, ArrowRight } from "lucide-react";
import { getProjectsAction } from "@/app/actions/listings";

export const dynamic = "force-dynamic";

function formatInr(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default async function ProjectsPage() {
  const projects = await getProjectsAction();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-[#1B4332] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-bold">New Projects & Launches</h1>
          <p className="mt-4 text-lg text-white/70">Discover upcoming residential and commercial developments in Ahmedabad.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p: any) => (
            <Link
              key={p.id}
              href={`/project/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm transition hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {p.image_url ? (
                  <Image src={p.image_url} alt={p.name} fill className="object-cover transition duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-100 text-slate-300">No image</div>
                )}
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1B4332] shadow-sm backdrop-blur-sm">
                    {p.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1B4332]">{p.name}</h3>
                  <div className="text-sm font-medium text-gray-500">by {p.developer || "Bespoke Developers"}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 text-red-500" />
                    {p.locality}, {p.city}
                  </div>
                  <div className="pt-2 text-lg font-bold text-[#1B4332]">
                    Starting {formatInr(p.min_price || 0)}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CalendarClock className="h-4 w-4" />
                    Status: {p.status}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-[#C9A84C]">
                    Details <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
