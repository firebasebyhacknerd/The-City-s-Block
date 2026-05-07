"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown } from "lucide-react";

const popularLocalities = [
  { name: "Bodakdev", city: "Ahmedabad", slug: "bodakdev" },
  { name: "Ashram Road", city: "Ahmedabad", slug: "ashram-road" },
  { name: "Vastrapur", city: "Ahmedabad", slug: "vastrapur" },
  { name: "Science City", city: "Ahmedabad", slug: "science-city" },
  { name: "GIFT City", city: "Ahmedabad", slug: "ashram-road" },
];

const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];
const budgetOptions = [
  { label: "Under ₹50 Lac", value: "0-5000000" },
  { label: "₹50 Lac – ₹1 Cr", value: "5000000-10000000" },
  { label: "₹1 Cr – ₹2 Cr", value: "10000000-20000000" },
  { label: "₹2 Cr – ₹5 Cr", value: "20000000-50000000" },
  { label: "Above ₹5 Cr", value: "50000000-999999999" },
];
const possessionOptions = ["Ready to Move", "Under Construction", "New Launch"];
const propertyTypeOptions = ["Apartment", "Villa", "Builder Floor", "Plot", "Office Space", "Retail Shop"];

export function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [bhk, setBhk] = useState("");
  const [budget, setBudget] = useState("");
  const [possession, setPossession] = useState("");
  const [propertyType, setPropertyType] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("q", location);
    if (bhk) params.set("bhk", bhk);
    if (budget) {
      const [min, max] = budget.split("-");
      if (min) params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }
    if (possession) params.set("possession", possession);
    if (propertyType) params.set("propertyType", propertyType);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="w-full">
      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-0 overflow-hidden rounded-xl bg-white shadow-2xl md:flex-row"
      >
        {/* Location */}
        <div className="flex flex-1 items-center gap-2 border-b border-gray-100 px-4 py-3 md:border-b-0 md:border-r">
          <MapPin className="h-4 w-4 shrink-0 text-red-500" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        {/* BHK */}
        <div className="flex items-center gap-1 border-b border-gray-100 px-4 py-3 md:border-b-0 md:border-r">
          <select
            value={bhk}
            onChange={(e) => setBhk(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 focus:outline-none"
          >
            <option value="">BHK</option>
            {bhkOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        </div>

        {/* Budget */}
        <div className="flex items-center gap-1 border-b border-gray-100 px-4 py-3 md:border-b-0 md:border-r">
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 focus:outline-none"
          >
            <option value="">Budget</option>
            {budgetOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        </div>

        {/* Possession */}
        <div className="flex items-center gap-1 border-b border-gray-100 px-4 py-3 md:border-b-0 md:border-r">
          <select
            value={possession}
            onChange={(e) => setPossession(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 focus:outline-none"
          >
            <option value="">Possession</option>
            {possessionOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        </div>

        {/* Property Type */}
        <div className="flex items-center gap-1 border-b border-gray-100 px-4 py-3 md:border-b-0 md:border-r">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 focus:outline-none"
          >
            <option value="">Property Type</option>
            {propertyTypeOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        </div>

        {/* Search button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-red-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </form>

      {/* Popular localities */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-white/80">Popular Localities :</span>
        {popularLocalities.map((loc) => (
          <a
            key={loc.slug}
            href={`/locality/${encodeURIComponent(loc.city)}/${loc.slug}`}
            className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20"
          >
            {loc.name}
          </a>
        ))}
      </div>
    </div>
  );
}
