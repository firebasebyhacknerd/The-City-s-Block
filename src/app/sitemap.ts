import { MetadataRoute } from "next";
import { listings, projects, localities, profiles } from "@/lib/portal";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://the-city-s-block.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ── Static routes ──────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,              lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE_URL}/search`,  lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: `${BASE_URL}/projects`,lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/commercial`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/agents`,  lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE_URL}/login`,   lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/signup`,  lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/list-property`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // ── Listing pages ─────────────────────────────────────────────────────────
  const listingRoutes: MetadataRoute.Sitemap = listings
    .filter((l) => l.status === "active")
    .map((l) => ({
      url: `${BASE_URL}/property/${l.id}`,
      lastModified: l.postedOn ? new Date(l.postedOn).toISOString() : now,
      changeFrequency: "weekly" as const,
      priority: l.featured ? 0.9 : 0.7,
    }));

  // ── Project pages ─────────────────────────────────────────────────────────
  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/project/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p.featured ? 0.85 : 0.65,
  }));

  // ── Locality pages ────────────────────────────────────────────────────────
  const localityRoutes: MetadataRoute.Sitemap = localities.map((loc) => ({
    url: `${BASE_URL}/locality/${encodeURIComponent(loc.city.toLowerCase())}/${loc.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Agent/Builder profile pages ───────────────────────────────────────────
  const profileRoutes: MetadataRoute.Sitemap = profiles
    .filter((p) => p.verificationStatus === "verified" && p.role !== "buyer" && p.role !== "admin")
    .map((p) => ({
      url: p.role === "builder"
        ? `${BASE_URL}/builders/${p.slug}`
        : `${BASE_URL}/agents/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.55,
    }));

  return [
    ...staticRoutes,
    ...listingRoutes,
    ...projectRoutes,
    ...localityRoutes,
    ...profileRoutes,
  ];
}
