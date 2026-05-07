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
  return localities
    .filter((loc) => loc.city === "Ahmedabad")
    .map((loc) => ({
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
        { label: "2 BHK Flats in Ahmedabad", href: "/search?city=Ahmedabad&bhk=2+BHK" },
        { label: "3 BHK Flats in Ahmedabad", href: "/search?city=Ahmedabad&bhk=3+BHK" },
        { label: "4 BHK Flats in Ahmedabad", href: "/search?city=Ahmedabad&bhk=4+BHK" },
        { label: "5+ BHK Flats in Ahmedabad", href: "/search?city=Ahmedabad&bhk=5%2B+BHK" },
        { label: "3 BHK Bungalows", href: "/search?city=Ahmedabad&bhk=3+BHK&propertyType=Villa" },
        { label: "4 BHK Bungalows", href: "/search?city=Ahmedabad&bhk=4+BHK&propertyType=Villa" },
        { label: "6 BHK Bungalows", href: "/search?city=Ahmedabad&bhk=6+BHK&propertyType=Villa" },
      ],
    },
    {
      title: "Office Space Searches",
      links: [
        { label: "Furnished Offices in Ahmedabad", href: "/search?city=Ahmedabad&propertyType=Office+Space&furnishing=Fully+Furnished" },
        { label: "Unfurnished Offices in Ahmedabad", href: "/search?city=Ahmedabad&propertyType=Office+Space&furnishing=Unfurnished" },
        { label: "Offices on Ashram Road", href: "/search?city=Ahmedabad&locality=ashram-road&propertyType=Office+Space" },
        { label: "Offices in Bodakdev", href: "/search?city=Ahmedabad&locality=bodakdev&propertyType=Office+Space" },
        { label: "Offices in Vastrapur", href: "/search?city=Ahmedabad&locality=vastrapur&propertyType=Office+Space" },
        { label: "Offices in GIFT City", href: "/search?city=Ahmedabad&q=GIFT+City" },
        { label: "Small Offices under ₹30K/mo", href: "/search?city=Ahmedabad&propertyType=Office+Space&maxPrice=30000" },
        { label: "Large Offices above ₹1L/mo", href: "/search?city=Ahmedabad&propertyType=Office+Space&minPrice=100000" },
      ],
    },
    {
      title: "Budget wise Searches",
      links: [
        { label: "Flats under ₹50 Lac", href: "/search?city=Ahmedabad&maxPrice=5000000" },
        { label: "Flats under ₹1 Cr", href: "/search?city=Ahmedabad&maxPrice=10000000" },
        { label: "Flats under ₹1.5 Cr", href: "/search?city=Ahmedabad&maxPrice=15000000" },
        { label: "Bungalows under ₹5 Cr", href: "/search?city=Ahmedabad&propertyType=Villa&maxPrice=50000000" },
        { label: "Bungalows under ₹10 Cr", href: "/search?city=Ahmedabad&propertyType=Villa&maxPrice=100000000" },
        { label: "Bungalows above ₹10 Cr", href: "/search?city=Ahmedabad&propertyType=Villa&minPrice=100000000" },
        { label: "3 BHK under ₹1 Cr", href: "/search?city=Ahmedabad&bhk=3+BHK&maxPrice=10000000" },
        { label: "4 BHK under ₹3 Cr", href: "/search?city=Ahmedabad&bhk=4+BHK&maxPrice=30000000" },
      ],
    },
    {
      title: "Popular Locality Searches",
      links: [
        { label: "Property in Bodakdev", href: "/search?city=Ahmedabad&locality=bodakdev" },
        { label: "Property in Vastrapur", href: "/search?city=Ahmedabad&locality=vastrapur" },
        { label: "Property on Ashram Road", href: "/search?city=Ahmedabad&locality=ashram-road" },
        { label: "Property in Science City", href: "/search?city=Ahmedabad&locality=science-city" },
        { label: "Property in Bhadaj", href: "/search?city=Ahmedabad&q=Bhadaj" },
        { label: "Property in Thaltej", href: "/search?city=Ahmedabad&q=Thaltej" },
        { label: "Property in Naranpura", href: "/search?city=Ahmedabad&q=Naranpura" },
        { label: "Property in Satellite", href: "/search?city=Ahmedabad&q=Satellite" },
        { label: "Property in Ghatlodia", href: "/search?city=Ahmedabad&q=Ghatlodia" },
        { label: "Property in CG Road", href: "/search?city=Ahmedabad&q=CG+Road" },
      ],
    },
    {
      title: "Bungalow Searches",
      links: [
        { label: "Bungalows in Ahmedabad", href: "/search?city=Ahmedabad&propertyType=Villa" },
        { label: "Bungalows in Science City", href: "/search?city=Ahmedabad&locality=science-city&propertyType=Villa" },
        { label: "Bungalows in Bhadaj", href: "/search?city=Ahmedabad&q=Bhadaj&propertyType=Villa" },
        { label: "Bungalows in Thaltej", href: "/search?city=Ahmedabad&q=Thaltej&propertyType=Villa" },
        { label: "Furnished Bungalows", href: "/search?city=Ahmedabad&propertyType=Villa&furnishing=Fully+Furnished" },
        { label: "3 BHK Bungalows", href: "/search?city=Ahmedabad&bhk=3+BHK&propertyType=Villa" },
        { label: "4 BHK Bungalows", href: "/search?city=Ahmedabad&bhk=4+BHK&propertyType=Villa" },
        { label: "5 BHK Bungalows", href: "/search?city=Ahmedabad&bhk=5%2B+BHK&propertyType=Villa" },
      ],
    },
    {
      title: "Ready To Move Searches",
      links: [
        { label: "Ready to Move in Ahmedabad", href: "/search?city=Ahmedabad&possession=Ready+to+Move" },
        { label: "Ready Offices in Bodakdev", href: "/search?city=Ahmedabad&locality=bodakdev&possession=Ready+to+Move" },
        { label: "Ready Offices on Ashram Road", href: "/search?city=Ahmedabad&locality=ashram-road&possession=Ready+to+Move" },
        { label: "Ready Bungalows in Ahmedabad", href: "/search?city=Ahmedabad&propertyType=Villa&possession=Ready+to+Move" },
        { label: "Ready Flats in Ahmedabad", href: "/search?city=Ahmedabad&propertyType=Apartment&possession=Ready+to+Move" },
      ],
    },
    {
      title: "List Property",
      links: [
        { label: "List Office for Rent", href: "/signup" },
        { label: "List Bungalow for Sale", href: "/signup" },
        { label: "Post Property Free", href: "/signup" },
        { label: "Sell Property in Ahmedabad", href: "/signup" },
        { label: "Advertise Property", href: "/signup" },
      ],
    },
    {
      title: "Trending Searches",
      links: [
        { label: "Office space for rent in Ahmedabad", href: "/search?city=Ahmedabad&propertyType=Office+Space&listing_type=rent" },
        { label: "Bungalow for sale in Ahmedabad", href: "/search?city=Ahmedabad&propertyType=Villa&listing_type=sale" },
        { label: "Furnished office in Bodakdev", href: "/search?city=Ahmedabad&locality=bodakdev&furnishing=Fully+Furnished" },
        { label: "Office in GIFT City", href: "/search?city=Ahmedabad&q=GIFT+City" },
        { label: "Luxury bungalow Science City", href: "/search?city=Ahmedabad&locality=science-city&propertyType=Villa" },
        { label: "Property consultant Ahmedabad", href: "/agents" },
        { label: "Commercial property Ahmedabad", href: "/commercial" },
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
            Explore 500+ Verified Properties in Ahmedabad
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
