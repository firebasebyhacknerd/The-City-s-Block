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
import { localities, projects, getLocality, getProjectBuilder } from "@/lib/portal";
import { getHomepageListingsAction } from "@/app/actions/listings";
import type { DbListing } from "@/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The City's Block | Buy, Rent & List Property in Ahmedabad & Gandhinagar",
  description:
    "Find verified homes and commercial spaces in Ahmedabad and Gandhinagar. Owners list personal properties directly—no agents.",
};

function dbToListing(l: DbListing): HomepageListing {
  return {
    id: String(l.id),
    title: l.title,
    city: l.city,
    locality: l.locality,
    price: Number(l.price),
    priceUnit: l.price_unit,
    area: l.area,
    bhk: l.bhk,
    bathrooms: l.bathrooms,
    propertyType: l.property_type,
    listingType: l.listing_type,
    verified: l.verified,
    images: l.images,
  };
}

function buildTrendingProjects() {
  return projects.map((p) => {
    const loc = getLocality(p.localitySlug);
    const builder = getProjectBuilder(p);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      builder: builder?.name ?? "Developer",
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
    .filter((loc) => loc.city === "Ahmedabad" || loc.city === "Gandhinagar")
    .map((loc) => ({
      name: `${loc.displayName} (${loc.city})`,
      projects: projects
        .filter((p) => p.localitySlug === loc.slug)
        .map((p) => ({
          name: p.name,
          slug: p.slug,
          city: p.city,
          localitySlug: p.localitySlug,
        })),
    }))
    .filter((tab) => tab.projects.length > 0);
}

function buildPropertyLinks() {
  return [
    {
      title: "Popular BHK Searches",
      links: [
        { label: "2 BHK Flats in Ahmedabad", href: "/search?city=Ahmedabad&bhk=2+BHK" },
        { label: "3 BHK Flats in Ahmedabad", href: "/search?city=Ahmedabad&bhk=3+BHK" },
        { label: "4 BHK Flats in Ahmedabad", href: "/search?city=Ahmedabad&bhk=4+BHK" },
        { label: "2 BHK Flats in Gandhinagar", href: "/search?city=Gandhinagar&bhk=2+BHK" },
        { label: "3 BHK Flats in Gandhinagar", href: "/search?city=Gandhinagar&bhk=3+BHK" },
        { label: "Luxury Bungalows in Ahmedabad", href: "/search?city=Ahmedabad&propertyType=Villa" },
      ],
    },
    {
      title: "Office & Commercial Spaces",
      links: [
        { label: "Offices in GIFT City, Gandhinagar", href: "/search?city=Gandhinagar&q=GIFT+City" },
        { label: "Offices on Ashram Road", href: "/search?city=Ahmedabad&locality=ashram-road&propertyType=Office+Space" },
        { label: "Offices in Bodakdev, Ahmedabad", href: "/search?city=Ahmedabad&locality=bodakdev&propertyType=Office+Space" },
        { label: "Offices in Vastrapur, Ahmedabad", href: "/search?city=Ahmedabad&locality=vastrapur&propertyType=Office+Space" },
      ],
    },
    {
      title: "Budget-wise Searches",
      links: [
        { label: "Properties under ₹50 Lac", href: "/search?city=Ahmedabad&maxPrice=5000000" },
        { label: "Properties under ₹1 Cr", href: "/search?city=Ahmedabad&maxPrice=10000000" },
        { label: "Properties under ₹2 Cr", href: "/search?city=Ahmedabad&maxPrice=20000000" },
        { label: "Villas & Bungalows under ₹5 Cr", href: "/search?city=Ahmedabad&propertyType=Villa&maxPrice=50000000" },
        { label: "GIFT City Spaces under ₹1.5 Cr", href: "/search?city=Gandhinagar&maxPrice=15000000" },
      ],
    },
    {
      title: "Popular Locality Searches",
      links: [
        { label: "Property in Bodakdev, Ahmedabad", href: "/search?city=Ahmedabad&locality=bodakdev" },
        { label: "Property in Vastrapur, Ahmedabad", href: "/search?city=Ahmedabad&locality=vastrapur" },
        { label: "Property on Ashram Road, Ahmedabad", href: "/search?city=Ahmedabad&locality=ashram-road" },
        { label: "Property in Science City, Ahmedabad", href: "/search?city=Ahmedabad&locality=science-city" },
        { label: "Property in GIFT City, Gandhinagar", href: "/search?city=Gandhinagar&q=GIFT+City" },
      ],
    },
  ];
}

export default async function HomePage() {
  const { featured, commercial, bungalows, stats } = await getHomepageListingsAction();

  const featuredListings = featured.map(dbToListing);
  const officeListings = commercial.map(dbToListing);
  const bungalowListings = bungalows.map(dbToListing);
  
  const trendingProjects = buildTrendingProjects();
  const localityTabs = buildLocalityTabs();
  const propertyLinks = buildPropertyLinks();

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
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B4332]/80 via-[#1B4332]/40 to-black/80" />
        
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-20 text-center md:py-32">
          <div className="mb-4 inline-block rounded-full bg-[#C9A84C]/20 px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-[#C9A84C] backdrop-blur-md border border-[#C9A84C]/30">
            Trusted Real Estate Advisory
          </div>
          <h1 className="mb-8 max-w-4xl text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            Discover Your <span className="text-[#C9A84C]">Perfect Space</span> in Ahmedabad & Gandhinagar
          </h1>
          <div className="w-full max-w-5xl rounded-[32px] bg-white/10 p-2 backdrop-blur-xl border border-white/20 shadow-2xl">
            <HeroSearch />
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm font-medium text-white/70">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
              {stats.activeListings}+ Verified Listings
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
              Ahmedabad & Gandhinagar Covered
            </div>
          </div>
        </div>
      </section>

      <FindYourHome />

      {featuredListings.length > 0 && (
        <FeaturedListings
          title="Featured Properties"
          listings={featuredListings}
          viewAllHref="/search?featured=true"
        />
      )}

      {officeListings.length > 0 && (
        <section className="bg-gray-50">
          <FeaturedListings
            title="Premium Office Spaces for Rent"
            listings={officeListings}
            viewAllHref="/search?propertyType=Office+Space"
          />
        </section>
      )}

      {bungalowListings.length > 0 && (
        <FeaturedListings
          title="Luxury Bungalows & Villas for Sale"
          listings={bungalowListings}
          viewAllHref="/search?propertyType=Villa"
        />
      )}

      <TrendingProjects projects={trendingProjects} />

      <PromoBanner />

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Explore New Projects by Localities
          </h2>
          <LocalityTabs tabs={localityTabs} />
        </div>
      </section>

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Property Options</h2>
          <PropertyLinksSection subsections={propertyLinks} />
        </div>
      </section>

      <FAQSection />
    </main>
  );
}
