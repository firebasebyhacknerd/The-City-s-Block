import Image from "next/image";
import Link from "next/link";
import { Building2, CalendarClock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatInr, getLocality, getProjectBuilder, type Project } from "@/lib/portal";

export function ProjectCard({ project }: { project: Project }) {
  const locality = getLocality(project.localitySlug);
  const builder = getProjectBuilder(project);

  return (
    <Link href={`/project/${project.slug}`}>
      <Card className="overflow-hidden rounded-[28px] border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:opacity-95">
        <div className="relative aspect-[16/10]">
          <Image src={project.coverImage} alt={project.name} fill className="object-cover" />
        </div>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-slate-950">{project.name}</div>
              {builder && (
                <div className="mt-0.5 text-sm text-slate-600">by {builder.name}</div>
              )}
              <div className="mt-1 text-sm text-slate-500">
                {formatInr(project.minPrice, true)} - {formatInr(project.maxPrice, true)}
              </div>
            </div>
            {project.featured ? (
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                Featured
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4 text-amber-500" />
            <span>
              {locality?.displayName}, {project.city}
            </span>
          </div>
          <div className="grid gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-500" />
              {project.configurations.join(" • ")}
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-slate-500" />
              Possession: {project.status}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
