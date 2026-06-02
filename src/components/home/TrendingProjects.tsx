import Link from "next/link";
import { TrendingProjectCard } from "./TrendingProjectCard";

interface Project {
  id: string;
  slug: string;
  name: string;
  builder: string;
  coverImage: string;
  configurations: string[];
  locality: string;
  city: string;
  minPrice: number;
  maxPrice: number;
}

interface TrendingProjectsProps {
  projects: Project[];
}

export function TrendingProjects({ projects }: TrendingProjectsProps) {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Trending Projects</h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-red-600 hover:underline"
          >
            See All
          </Link>
        </div>

        {/* Horizontal scroll row */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {projects.map((project) => (
            <TrendingProjectCard
              key={project.id}
              name={project.name}
              builder={project.builder}
              image={project.coverImage}
              configurations={project.configurations}
              locality={project.locality}
              city={project.city}
              minPrice={project.minPrice}
              maxPrice={project.maxPrice}
              slug={project.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
