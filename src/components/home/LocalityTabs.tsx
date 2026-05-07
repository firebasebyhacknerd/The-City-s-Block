"use client";

import { useState } from "react";
import Link from "next/link";

interface LocalityProject {
  name: string;
  slug: string;
  city: string;
  localitySlug: string;
}

interface LocalityTabData {
  name: string;
  projects: LocalityProject[];
}

interface LocalityTabsProps {
  tabs: LocalityTabData[];
}

export function LocalityTabs({ tabs }: LocalityTabsProps) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Tab headers */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-0">
        {tabs.map((tab, i) => (
          <button
            key={tab.name}
            onClick={() => setActive(i)}
            className={`px-5 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
              active === i
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {tabs[active]?.projects.map((project) => (
          <Link
            key={project.slug}
            href={`/project/${project.slug}`}
            className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            {project.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
