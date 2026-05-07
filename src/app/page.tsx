import Image from "next/image";
import Link from "next/link";
import { HeroSearch } from "@/components/home/HeroSearch";
import { FindYourHome } from "@/components/home/FindYourHome";
import { TrendingProjects } from "@/components/home/TrendingProjects";
import { PromoBanner } from "@/components/home/PromoBanner";
import { LocalityTabs } from "@/components/home/LocalityTabs";
import { PropertyLinksSection } from "@/components/home/PropertyLinksSection";
import { FAQSection } from "@/components/home/FAQSection";
import { projects, localities, getLocality, getProjectBuilder } from "@/lib/portal";

export const metadata = {
  title: "The City's Block | Buy, Rent & Discover Property Across India",
  description:
    "Find verified homes, new launches, and commercial spaces across India's top property markets with expert-backed guidance.",
};

// ── data helpers ──────────────────────────────────────────────────────────────

function buildTrendingProjects() {
  return projects.map((p) => {
    const loc = getLocality(p.localitySlug);
    const builder = getProjectBuilder(p);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      builder: builder?.name ?? "Builder",
      coverImage: p.coverImage,
      configurations: p.configurations,
      locality: loc?.displayName ?? "",
      city: p.city,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
    };
  });
}

function buildLocalityTabs() {
  return localities.map((loc) => ({
    name: loc.displayName,
    projects: projects
      .filter((p) => p.localitySlug === loc.slug)
      .map((p) => ({
        name: p.name,
        slug: p.slug,
        city: p.city,
        localitySlug: p.localitySlug,
      })),
  }));
}

function buildPropertyLinks() {
  return [
    {
      title: "Popular BHK Searches",
      links: [
        { label: "2 BHK Flats", href: "/search?bhk=2+BHK" },
        { label: "3 BHK Flats", href: "/search?bhk=3+BHK" },
        { label: "4 BHK Flats", href: "/search?bhk=4+BHK" },
        { label: "5+ BHK Flats", href: "/search?bhk=5%2B+BHK" },
        { label: "3 BHK with Penthouse", href: "/search?bhk=3+BHK&propertyType=Apartment" },
        { label: "4 BHK Duplex", href: "/search?bhk=4+BHK" },
      ],
    },
    {
      title: "Popular Flat Searches",
      links: [
        { label: "Flats in Gurugram", href: "/search?city=Gurugram" },
        { label: "Flats in Noida", href: "/search?city=Noida" },
        { label: "Flats in Bengaluru", href: "/search?city=Bengaluru" },
        { label: "Flats in Mumbai", href: "/search?city=Mumbai" },
        { label: "Flats in Golf Course Road", href: "/search?locality=golf-course-road" },
        { label: "Flats in Whitefield", href: "/search?locality=whitefield" },
        { label: "Flats in Sector 150", href: "/search?locality=sector-150" },
        { label: "Flats in BKC", href: "/search?locality=bkc" },
      ],
    },
    {
      title: "Budget wise Searches",
      links: [
        { label: "Flats under ₹50 Lac", href: "/search?maxPrice=5000000" },
        { label: "Flats under ₹75 Lac", href: "/search?maxPrice=7500000" },
        { label: "Flats under ₹1 Cr", href: "/search?maxPrice=10000000" },
        { label: "Flats under ₹1.5 Cr", href: "/search?maxPrice=15000000" },
        { label: "Flats under ₹2 Cr", href: "/search?maxPrice=20000000" },
        { label: "Flats under ₹3 Cr", href: "/search?maxPrice=30000000" },
        { label: "2 BHK under ₹70 Lac", href: "/search?bhk=2+BHK&maxPrice=7000000" },
        { label: "3 BHK under ₹1 Cr", href: "/search?bhk=3+BHK&maxPrice=10000000" },
        { label: "3 BHK under ₹1.5 Cr", href: "/search?bhk=3+BHK&maxPrice=15000000" },
        { label: "4 BHK under ₹3 Cr", href: "/search?bhk=4+BHK&maxPrice=30000000" },
      ],
    },
    {
      title: "Popular 2 BHK Searches",
      links: [
        { label: "2 BHK in Gurugram", href: "/search?city=Gurugram&bhk=2+BHK" },
        { label: "2 BHK in Noida", href: "/search?city=Noida&bhk=2+BHK" },
        { label: "2 BHK in Bengaluru", href: "/search?city=Bengaluru&bhk=2+BHK" },
        { label: "2 BHK in Mumbai", href: "/search?city=Mumbai&bhk=2+BHK" },
        { label: "2 BHK Ready to Move", href: "/search?bhk=2+BHK&possession=Ready+to+Move" },
        { label: "2 BHK New Launch", href: "/search?bhk=2+BHK&possession=New+Launch" },
      ],
    },
    {
      title: "Popular 3 BHK Searches",
      links: [
        { label: "3 BHK in Gurugram", href: "/search?city=Gurugram&bhk=3+BHK" },
        { label: "3 BHK in Noida", href: "/search?city=Noida&bhk=3+BHK" },
        { label: "3 BHK in Bengaluru", href: "/search?city=Bengaluru&bhk=3+BHK" },
        { label: "3 BHK in Mumbai", href: "/search?city=Mumbai&bhk=3+BHK" },
        { label: "3 BHK Ready to Move", href: "/search?bhk=3+BHK&possession=Ready+to+Move" },
        { label: "3 BHK Under Construction", href: "/search?bhk=3+BHK&possession=Under+Construction" },
      ],
    },
    {
      title: "Popular Residential Searches",
      links: [
        { label: "Property for Sale", href: "/search?listing_type=sale" },
        { label: "Property for Rent", href: "/search?listing_type=rent" },
        { label: "Apartments for Sale", href: "/search?propertyType=Apartment&listing_type=sale" },
        { label: "Villas for Sale", href: "/search?propertyType=Villa&listing_type=sale" },
        { label: "Ready to Move Flats", href: "/search?possession=Ready+to+Move" },
        { label: "New Launch Projects", href: "/search?possession=New+Launch" },
        { label: "Under Construction Flats", href: "/search?possession=Under+Construction" },
        { label: "Residential Projects", href: "/projects" },
      ],
    },
    {
      title: "Popular Luxury Searches",
      links: [
        { label: "Luxury Apartments in Gurugram", href: "/search?city=Gurugram&propertyType=Apartment" },
        { label: "Luxury Apartments in Mumbai", href: "/search?city=Mumbai&propertyType=Apartment" },
        { label: "Luxury Villas in Bengaluru", href: "/search?city=Bengaluru&propertyType=Villa" },
        { label: "Penthouses in Noida", href: "/search?city=Noida" },
        { label: "4 BHK Luxury Flats", href: "/search?bhk=4+BHK" },
        { label: "5 BHK Luxury Flats", href: "/search?bhk=5%2B+BHK" },
      ],
    },
    {
      title: "Ready To Move Searches",
      links: [
        { label: "2 BHK Ready to Move", href: "/search?bhk=2+BHK&possession=Ready+to+Move" },
        { label: "3 BHK Ready to Move", href: "/search?bhk=3+BHK&possession=Ready+to+Move" },
        { label: "4 BHK Ready to Move", href: "/search?bhk=4+BHK&possession=Ready+to+Move" },
        { label: "Ready to Move in Gurugram", href: "/search?city=Gurugram&possession=Ready+to+Move" },
        { label: "Ready to Move in Bengaluru", href: "/search?city=Bengaluru&possession=Ready+to+Move" },
        { label: "Ready to Move in Mumbai", href: "/search?city=Mumbai&possession=Ready+to+Move" },
      ],
    },
    {
      title: "New Launch Searches",
      links: [
        { label: "New Launch in Gurugram", href: "/search?city=Gurugram&possession=New+Launch" },
        { label: "New Launch in Noida", href: "/search?city=Noida&possession=New+Launch" },
        { label: "New Launch in Bengaluru", href: "/search?city=Bengaluru&possession=New+Launch" },
        { label: "New Launch in Mumbai", href: "/search?city=Mumbai&possession=New+Launch" },
        { label: "New Launch Projects", href: "/projects" },
      ],
    },
    {
      title: "List Property",
      links: [
        { label: "List Property for Sale", href: "/signup" },
        { label: "Sell Property Online", href: "/signup" },
        { label: "Post Property Free", href: "/signup" },
        { label: "Advertise Property", href: "/signup" },
        { label: "Sell Without Broker", href: "/signup" },
      ],
    },
    {
      title: "Trending Searches",
      links: [
        { label: "Property for sale near me", href: "/search?listing_type=sale" },
        { label: "Apartments for sale near me", href: "/search?propertyType=Apartment&listing_type=sale" },
        { label: "Ready to move flats near me", href: "/search?possession=Ready+to+Move" },
        { label: "New launch properties near me", href: "/search?possession=New+Launch" },
        { label: "Luxury property for sale", href: "/search?listing_type=sale" },
        { label: "Flats under ₹1 Cr near me", href: "/search?maxPrice=10000000" },
        { label: "Property consultant near me", href: "/agents" },
      ],
    },
  ];
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const trendingProjects = buildTrendingProjects();
  const localityTabs = buildLocalityTabs();
  const propertyLinks = buildPropertyLinks();

  return (
    <main className="bg-white">
      {/* ── 1. Hero Banner ── */}
      <section className="relative min-h-[420px] overflow-hidden bg-gray-900 md:min-h-[500px]">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80"
          alt="Hero banner"
          fill
          priority
          className="object-cover opacity-40"
        />

        {/* Overlay content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 text-center md:py-24">
          <h1 className="mb-8 text-3xl font-bold text-white md:text-5xl">
            Explore 1000+ Verified Properties
          </h1>
          <div className="w-full max-w-5xl">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* ── 2. Find Your Next Home ── */}
      <FindYourHome />

      {/* ── 3. Trending Projects ── */}
      <TrendingProjects projects={trendingProjects} />

      {/* ── 4. Promo Banner ── */}
      <PromoBanner />

      {/* ── 5. Explore by Localities ── */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Explore New Projects by Localities
          </h2>
          <LocalityTabs tabs={localityTabs} />
        </div>
      </section>

      {/* ── 6. Property Options ── */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Property Options</h2>
          <PropertyLinksSection subsections={propertyLinks} />
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <FAQSection />
    </main>
  );
}
