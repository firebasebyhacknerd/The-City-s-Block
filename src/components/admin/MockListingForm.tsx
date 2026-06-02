"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Listing } from "@/lib/portal";
import { saveMockListingAction, deleteMockListingAction } from "@/app/actions/mock-listings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface MockListingFormProps {
  listing?: Listing;
  mode: "new" | "edit";
}

const PROPERTY_TYPES = ["Office Space", "Villa", "Apartment", "Builder Floor", "Plot", "Retail Shop", "Warehouse"];
const FURNISHING_OPTIONS = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];
const POSSESSION_OPTIONS = ["Ready to Move", "Under Construction", "New Launch"];
const LISTING_TYPES = ["rent", "sale"];
const ASSET_CLASSES = ["commercial", "residential"];
const LOCALITIES = [
  { label: "Bodakdev", value: "bodakdev" },
  { label: "Ashram Road", value: "ashram-road" },
  { label: "Vastrapur", value: "vastrapur" },
  { label: "Science City", value: "science-city" },
  { label: "Golf Course Road", value: "golf-course-road" },
  { label: "Sector 150", value: "sector-150" },
];

export function MockListingForm({ listing, mode }: MockListingFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    id: listing?.id ?? "",
    title: listing?.title ?? "",
    description: listing?.description ?? "",
    city: listing?.city ?? "Ahmedabad",
    localitySlug: listing?.localitySlug ?? "bodakdev",
    address: listing?.address ?? "",
    price: listing?.price?.toString() ?? "",
    priceUnit: listing?.priceUnit ?? "month",
    area: listing?.area?.toString() ?? "",
    bhk: listing?.bhk?.toString() ?? "",
    bathrooms: listing?.bathrooms?.toString() ?? "1",
    propertyType: listing?.propertyType ?? "Office Space",
    listingType: listing?.listingType ?? "rent",
    assetClass: listing?.assetClass ?? "commercial",
    furnishing: listing?.furnishing ?? "Unfurnished",
    possessionStatus: listing?.possessionStatus ?? "Ready to Move",
    featured: listing?.featured ?? false,
    verified: listing?.verified ?? true,
    status: listing?.status ?? "active",
    images: listing?.images?.join("\n") ?? "",
  });

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.price || isNaN(Number(form.price))) { setError("Valid price is required."); return; }
    if (!form.area || isNaN(Number(form.area))) { setError("Valid area is required."); return; }

    startTransition(async () => {
      const result = await saveMockListingAction({
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        bhk: form.bhk ? Number(form.bhk) : null,
        bathrooms: Number(form.bathrooms) || 1,
        images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
        mode,
      });

      if (result.ok) {
        setSuccess(mode === "new" ? "Property added successfully!" : "Property updated successfully!");
        setTimeout(() => router.push("/admin/mock-listings"), 1000);
      } else {
        setError(result.message ?? "Something went wrong.");
      }
    });
  }

  function handleDelete() {
    if (!listing?.id) return;
    if (!confirm(`Delete "${listing.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deleteMockListingAction(listing.id);
      if (result.ok) {
        router.push("/admin/mock-listings");
      } else {
        setError(result.message ?? "Delete failed.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back */}
      <Link href="/admin/mock-listings" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft className="h-4 w-4" /> Back to Property Data
      </Link>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-800">Basic Info</h3>
            <div className="space-y-4">
              <Field label="Title *">
                <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Furnished Office – Akshar Square, Bodakdev" />
              </Field>
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                  placeholder="Describe the property..."
                />
              </Field>
              <Field label="Address">
                <Input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Full address" />
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-800">Location</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City">
                <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Ahmedabad" />
              </Field>
              <Field label="Locality">
                <select
                  value={form.localitySlug}
                  onChange={(e) => set("localitySlug", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                >
                  {LOCALITIES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-800">Images</h3>
            <Field label="Image URLs (one per line)">
              <textarea
                value={form.images}
                onChange={(e) => set("images", e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                placeholder="https://images.unsplash.com/..."
              />
            </Field>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-800">Pricing & Size</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price (₹) *">
                <Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="75000" />
              </Field>
              <Field label="Price Unit">
                <select
                  value={form.priceUnit}
                  onChange={(e) => set("priceUnit", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                >
                  <option value="month">Per Month</option>
                  <option value="total">Total</option>
                </select>
              </Field>
              <Field label="Area (sq.ft.) *">
                <Input type="number" value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="1098" />
              </Field>
              <Field label="BHK">
                <Input type="number" value={form.bhk} onChange={(e) => set("bhk", e.target.value)} placeholder="Leave blank for offices" />
              </Field>
              <Field label="Bathrooms">
                <Input type="number" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} placeholder="1" />
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-800">Classification</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Property Type">
                <select
                  value={form.propertyType}
                  onChange={(e) => set("propertyType", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                >
                  {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Listing Type">
                <select
                  value={form.listingType}
                  onChange={(e) => set("listingType", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                >
                  {LISTING_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Asset Class">
                <select
                  value={form.assetClass}
                  onChange={(e) => set("assetClass", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                >
                  {ASSET_CLASSES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Furnishing">
                <select
                  value={form.furnishing}
                  onChange={(e) => set("furnishing", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                >
                  {FURNISHING_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Possession">
                <select
                  value={form.possessionStatus}
                  onChange={(e) => set("possessionStatus", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                >
                  {POSSESSION_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-800">Flags</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-[#1B4332]"
                />
                <span className="text-sm text-gray-700">Featured — show prominently on homepage</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.verified}
                  onChange={(e) => set("verified", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-[#1B4332]"
                />
                <span className="text-sm text-gray-700">Verified — show verified badge</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        {mode === "edit" && (
          <Button
            type="button"
            variant="outline"
            className="gap-2 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
            onClick={handleDelete}
            disabled={pending}
          >
            <Trash2 className="h-4 w-4" />
            Delete Property
          </Button>
        )}
        <div className="ml-auto">
          <Button
            type="submit"
            className="gap-2 rounded-lg bg-[#1B4332] text-white hover:bg-[#1B4332]/90"
            disabled={pending}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {mode === "new" ? "Add Property" : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      {children}
    </div>
  );
}
