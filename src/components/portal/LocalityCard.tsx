import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatInr, getListingsForLocality, type Locality } from "@/lib/portal";

export function LocalityCard({ locality }: { locality: Locality }) {
  const propertyCount = getListingsForLocality(locality.slug).filter(
    (listing) => listing.status === "active"
  ).length;

  return (
    <Link href={`/locality/${encodeURIComponent(locality.city)}/${locality.slug}`}>
      <Card className="group overflow-hidden rounded-[28px] border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
        <div className="relative aspect-[6/5] overflow-hidden">
          <Image 
            src={locality.image} 
            alt={locality.displayName} 
            fill 
            className="object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold text-slate-950 transition-colors group-hover:text-slate-700">
                {locality.displayName}
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-amber-500" />
                {locality.city}
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-600" />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span>
              {propertyCount} {propertyCount === 1 ? "property" : "properties"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Avg. price/sq.ft.</span>
            <span className="font-medium text-slate-950">{formatInr(locality.avgPricePerSqft)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
