import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface TrendingProjectCardProps {
  name: string;
  builder: string;
  image: string;
  configurations: string[];
  locality: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  slug: string;
}

function formatPrice(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)} Lac`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function TrendingProjectCard({
  name,
  builder,
  image,
  configurations,
  locality,
  city,
  minPrice,
  maxPrice,
  slug,
}: TrendingProjectCardProps) {
  return (
    <Link href={`/project/${slug}`} className="group block shrink-0 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-3 space-y-1">
        <div className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1">{name}</div>
        <div className="text-xs text-gray-500">{builder}</div>
        <div className="text-xs text-gray-600">{configurations.join(", ")} BHK Flat</div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3 w-3 text-red-500 shrink-0" />
          <span className="truncate">{locality} {city}</span>
        </div>
        <div className="pt-1 text-sm font-semibold text-gray-900">
          {minPrice === maxPrice
            ? formatPrice(minPrice)
            : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}
        </div>
      </div>
    </Link>
  );
}
