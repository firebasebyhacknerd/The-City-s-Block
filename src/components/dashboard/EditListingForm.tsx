"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateMyListingAction } from "@/app/actions/listings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AMENITIES = [
  "Clubhouse", "Power Backup", "Swimming Pool", "Gym", "EV Charging",
  "24x7 Security", "Metro Connectivity", "Visitor Parking", "Business Lounge",
  "Cafeteria", "Loading Bay", "Rainwater Harvesting",
];

const PROPERTY_TYPES = ["Apartment", "Builder Floor", "Villa", "Plot", "Office Space", "Retail Shop", "Warehouse"];
const CITIES = ["Mumbai", "Delhi", "Gurugram", "Noida", "Bengaluru", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad"];

interface EditListingFormProps {
  listing: any;
}

export function EditListingForm({ listing }: EditListingFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [amenities, setAmenities] = useState<string[]>(
    Array.isArray(listing.amenities) ? listing.amenities : []
  );
  const [images, setImages] = useState<string>(
    Array.isArray(listing.images) ? listing.images.join("\n") : (listing.images ?? "")
  );

  const [form, setForm] = useState({
    title: listing.title ?? "",
    description: listing.description ?? "",
    listing_type: listing.listing_type ?? "sale",
    asset_class: listing.asset_class ?? "residential",
    property_type: listing.property_type ?? "Apartment",
    city: listing.city ?? "",
    locality: listing.locality ?? "",
    address: listing.address ?? "",
    price: listing.price != null ? String(listing.price) : "",
    price_unit: listing.price_unit ?? "total",
    area: listing.area != null ? String(listing.area) : "",
    bhk: listing.bhk != null ? String(listing.bhk) : "",
    bathrooms: listing.bathrooms != null ? String(listing.bathrooms) : "",
    furnishing: listing.furnishing ?? "Unfurnished",
    possession: listing.possession ?? "Ready to Move",
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const handleSubmit = () => {
    startTransition(async () => {
      const imageList = images.split("\n").map((s) => s.trim()).filter(Boolean);
      const result = await updateMyListingAction(listing.id, { ...form, amenities, images: imageList });
      setMessage({ ok: result.ok, text: result.message });
      if (result.ok) {
        setTimeout(() => router.push("/dashboard/listings"), 2000);
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-slate-950">Basic Information</h2>
          <div className="space-y-2">
            <Label>Listing title *</Label>
            <Input placeholder="e.g. 3 BHK luxury apartment near metro" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Listing type</Label>
              <Select value={form.listing_type} onValueChange={(v) => set("listing_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Asset class</Label>
              <Select value={form.asset_class} onValueChange={(v) => set("asset_class", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Property type</Label>
              <Select value={form.property_type} onValueChange={(v) => set("property_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>BHK (residential)</Label>
              <Select value={form.bhk} onValueChange={(v) => set("bhk", v)}>
                <SelectTrigger><SelectValue placeholder="Select BHK" /></SelectTrigger>
                <SelectContent>
                  {["1","2","3","4","5"].map((n) => <SelectItem key={n} value={n}>{n} BHK</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the property — layout, highlights, nearby landmarks..."
              className="min-h-[120px]"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-slate-950">Location</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>City *</Label>
              <Select value={form.city} onValueChange={(v) => set("city", v)}>
                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Locality / Area</Label>
              <Input placeholder="e.g. Whitefield, Sector 150" value={form.locality} onChange={(e) => set("locality", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Full address</Label>
            <Input placeholder="Street, building, landmark" value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
        </div>

        {/* Pricing & Details */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-slate-950">Pricing & Details</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Price (₹) *</Label>
              <Input type="number" placeholder="e.g. 5000000" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Price type</Label>
              <Select value={form.price_unit} onValueChange={(v) => set("price_unit", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Total price</SelectItem>
                  <SelectItem value="month">Per month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Area (sq.ft.)</Label>
              <Input type="number" placeholder="e.g. 1200" value={form.area} onChange={(e) => set("area", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Input type="number" placeholder="e.g. 2" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Furnishing</Label>
              <Select value={form.furnishing} onValueChange={(v) => set("furnishing", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                  <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                  <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Possession</Label>
              <Select value={form.possession} onValueChange={(v) => set("possession", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                  <SelectItem value="Under Construction">Under Construction</SelectItem>
                  <SelectItem value="New Launch">New Launch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-950">Amenities</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {AMENITIES.map((a) => (
              <label key={a} className="flex items-center gap-2 rounded-2xl border border-slate-200 p-3 text-sm cursor-pointer hover:bg-slate-50">
                <Checkbox
                  checked={amenities.includes(a)}
                  onCheckedChange={() => toggleAmenity(a)}
                />
                <span>{a}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-950">Property Images</h2>
          <p className="text-sm text-slate-500">Paste image URLs (one per line). Use Unsplash or any public image URL.</p>
          <Textarea
            placeholder={"https://images.unsplash.com/...\nhttps://images.unsplash.com/..."}
            className="min-h-[140px] text-sm"
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-950">Save Changes</h2>
          <p className="text-sm text-slate-500">
            After saving, your listing will need re-approval before going live again.
          </p>
          <Button
            className="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800"
            disabled={pending}
            onClick={handleSubmit}
          >
            {pending ? "Saving..." : "Save Changes"}
          </Button>
          {message && (
            <div className={`text-sm rounded-2xl p-3 ${message.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message.text}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-amber-100 bg-amber-50 p-5 text-sm text-amber-800 space-y-2">
          <div className="font-medium">After editing</div>
          <ul className="space-y-1 list-disc list-inside text-amber-700">
            <li>Your listing will be set back to pending</li>
            <li>Admin will review and re-approve it</li>
            <li>It will go live again within 24 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
