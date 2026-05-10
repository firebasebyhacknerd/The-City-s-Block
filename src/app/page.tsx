import Image from "next/image";
import Link from "next/link";
import { HeroSearch } from "@/components/home/HeroSearch";
import { FindYourHome } from "@/components/home/FindYourHome";
import { TrendingProjects } from "@/components/home/TrendingProjects";
import { PromoBanner } from "@/components/home/PromoBanner";
import { LocalityTabs } from "@/components/home/LocalityTabs";
import { PropertyLinksSection } from "@/components/home/PropertyLinksSection";
import { FAQSection } from "@/components/home/FAQSection";
import { FeaturedListings, type HomepageListing } from "@/components/home/FeaturedListings";
import { projects, localities, listings, getLocality, getProjectBuilder } from "@/lib/portal";

export const metadata = {
  title: "The City's Block | Buy, Rent & Discover Property Across India",
  description:
    "Find verified homes, new launches, and commercial spaces across India's top property markets with expert-backed guidance.",
};

// ── data helpers ──────────────────────────────────────────────────────────────

// ── listings helpers ──────────────────────────────────────────────────────────

function toHomepageListing(l: typeof listings[0]): HomepageListing {
  const loc = getLocality(l.localitySlug);
  return {
    id: l.id,
    title: l.title,
    city: l.city,
    locality: loc?.displayName ?? l.localitySlug,
    price: l.price,
    priceUnit: l.priceUnit,
    area: l.area,
    bhk: l.bhk,
    bathrooms: l.bathrooms,
    propertyType: l.propertyType,
    listingType: l.listingType,
    verified: l.verified,
    images: l.images,
  };
}

function buildOfficeListings(): HomepageListing[] {
  return listings
    .filter((l) => l.propertyType === "Office Space" && l.status === "active")
    .slice(0, 8)
    .map(toHomepageListing);
}

function buildBungalowListings(): HomepageListing[] {
  return listings
    .filter((l) => l.propertyType === "Villa" && l.status === "active")
    .slice(0, 4)
    .map(toHomepageListing);
}

function buildFeaturedListings(): HomepageListing[] {
  return listings
    .filter((l) => l.featured && l.status === "active")
    .slice(0, 4)
    .map(toHomepageListing);
}

// ── projects helpers ──────────────────────────────────────────────────────────

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
  const officeListings = buildOfficeListings();
  const bungalowListings = buildBungalowListings();
  const featuredListings = buildFeaturedListings();

  return (
    <main className="bg-white">
      {/* ── 1. Hero Banner ── */}
      <section className="relative min-h-[500px] overflow-hidden bg-[#1B4332] md:min-h-[600px]">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Real Estate"
          fill
          priority
          className="object-cover opacity-60"
        />
        {/* Luxurious Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B4332]/80 via-[#1B4332]/40 to-black/80" />
        
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-20 text-center md:py-32">
          <div className="mb-4 inline-block rounded-full bg-[#C9A84C]/20 px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-[#C9A84C] backdrop-blur-md border border-[#C9A84C]/30">
            Trusted Real Estate Advisory
          </div>
          <h1 className="mb-8 max-w-4xl text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            Discover Your <span className="text-[#C9A84C]">Perfect Space</span> in Ahmedabad
          </h1>
          <div className="w-full max-w-5xl rounded-[32px] bg-white/10 p-2 backdrop-blur-xl border border-white/20 shadow-2xl">
            <HeroSearch />
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm font-medium text-white/70">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
              500+ Verified Properties
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
              Expert Guidance
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Find Your Next Home ── */}
      <FindYourHome />

      {/* ── 3. Featured Listings ── */}
      {featuredListings.length > 0 && (
        <FeaturedListings
          title="Featured Properties"
          listings={featuredListings}
          viewAllHref="/search?featured=true"
        />
      )}

      {/* ── 4. Office Spaces ── */}
      {officeListings.length > 0 && (
        <section className="bg-gray-50">
          <FeaturedListings
            title="Office Spaces for Rent – Ahmedabad"
            listings={officeListings}
            viewAllHref="/search?city=Ahmedabad&propertyType=Office+Space"
          />
        </section>
      )}

      {/* ── 5. Bungalows for Sale ── */}
      {bungalowListings.length > 0 && (
        <FeaturedListings
          title="Bungalows for Sale – Ahmedabad"
          listings={bungalowListings}
          viewAllHref="/search?city=Ahmedabad&propertyType=Villa"
        />
      )}

      {/* ── 6. Trending Projects ── */}
      <TrendingProjects projects={trendingProjects} />

      {/* ── 7. Promo Banner ── */}
      <PromoBanner />

      {/* ── 8. Explore by Localities ── */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Explore New Projects by Localities
          </h2>
          <LocalityTabs tabs={localityTabs} />
        </div>
      </section>

      {/* ── 9. Property Options ── */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Property Options</h2>
          <PropertyLinksSection subsections={propertyLinks} />
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <FAQSection />
    </main>
  );
}
