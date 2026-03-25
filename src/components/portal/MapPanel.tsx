import { MapPin } from "lucide-react";
import { integrationStatus } from "@/lib/portal";

type MapItem = {
  coordinates: { lat: number; lng: number };
  address: string;
  title?: string;
  name?: string;
  displayName?: string;
};

export function MapPanel({ item }: { item: MapItem }) {
  if (integrationStatus.mapbox) {
    return (
      <div className="overflow-hidden rounded-[28px] border border-slate-200">
        <iframe
          title="Property map"
          className="h-[320px] w-full"
          loading="lazy"
          src={`https://api.mapbox.com/styles/v1/mapbox/light-v11.html?title=false&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}#14/${item.coordinates.lat}/${item.coordinates.lng}`}
        />
      </div>
    );
  }

  return (
    <div className="flex h-[320px] flex-col justify-between rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_35%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)] p-6">
      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
        <MapPin className="h-4 w-4 text-amber-500" />
        Map preview
      </div>
      <div className="space-y-2">
        <div className="text-xl font-semibold text-slate-950">
          {item.title || item.name || item.displayName}
        </div>
        <div className="max-w-md text-sm leading-6 text-slate-600">{item.address}</div>
        <div className="text-sm text-slate-500">
          Lat {item.coordinates.lat}, Lng {item.coordinates.lng}
        </div>
        <div className="text-xs text-slate-500">
          Add `NEXT_PUBLIC_MAPBOX_TOKEN` to enable live Mapbox rendering.
        </div>
      </div>
    </div>
  );
}
