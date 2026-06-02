"use client";

import { useState } from "react";
import Link from "next/link";

interface PropertyLink {
  label: string;
  href: string;
}

interface PropertySubsection {
  title: string;
  links: PropertyLink[];
}

interface PropertyLinksSectionProps {
  subsections: PropertySubsection[];
}

function Subsection({ title, links }: PropertySubsection) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? links : links.slice(0, 12);
  const remaining = links.length - 12;

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-semibold text-gray-800">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {visible.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 transition hover:border-red-300 hover:text-red-600"
          >
            {link.label}
          </Link>
        ))}
        {!expanded && remaining > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-500 transition hover:border-red-300 hover:text-red-600"
          >
            +{remaining} more
          </button>
        )}
      </div>
    </div>
  );
}

export function PropertyLinksSection({ subsections }: PropertyLinksSectionProps) {
  return (
    <div>
      {subsections.map((sub) => (
        <Subsection key={sub.title} {...sub} />
      ))}
    </div>
  );
}
