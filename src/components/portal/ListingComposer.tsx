"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { submitListingDraftAction } from "@/app/actions/portal";
import AIDescriptionTool from "@/components/property/AIDescriptionTool";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { amenityOptions, integrationStatus, propertyTypes } from "@/lib/portal";

const initialState = {
  propertyType: "Apartment",
  bedrooms: 3,
  bathrooms: 2,
  location: "",
  price: "",
  sqft: 1800,
  amenities: ["Power Backup", "24x7 Security"] as string[],
  uniqueFeatures: "",
};

export function ListingComposer() {
  const [pending, startTransition] = useTransition();
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [formState, setFormState] = useState(initialState);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <Card className="rounded-[28px] border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-950">Create a listing buyers want to act on</CardTitle>
          <CardDescription>
            Shape a polished listing with sharper positioning, clearer details, and stronger buyer confidence from the first draft.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Property type</Label>
              <Select
                value={formState.propertyType}
                onValueChange={(value) => setFormState((current) => ({ ...current, propertyType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((propertyType) => (
                    <SelectItem key={propertyType} value={propertyType}>
                      {propertyType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>City / locality</Label>
              <Input
                value={formState.location}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, location: event.target.value }))
                }
                placeholder="Eg. Golf Course Road, Gurugram"
              />
            </div>
            <div className="space-y-2">
              <Label>Expected price</Label>
              <Input
                value={formState.price}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, price: event.target.value }))
                }
                placeholder="Eg. 2.75 Cr"
              />
            </div>
            <div className="space-y-2">
              <Label>Area (sq.ft.)</Label>
              <Input
                type="number"
                value={formState.sqft}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, sqft: Number(event.target.value) }))
                }
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            {amenityOptions.slice(0, 8).map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 rounded-2xl border border-slate-200 p-3 text-sm">
                <Checkbox
                  checked={formState.amenities.includes(amenity)}
                  onCheckedChange={(checked) => {
                    setFormState((current) => ({
                      ...current,
                      amenities: checked
                        ? [...current.amenities, amenity]
                        : current.amenities.filter((entry) => entry !== amenity),
                    }));
                  }}
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>

          <div className="space-y-2">
              <Label>Listing headline</Label>
            <Input defaultValue="Premium apartment with skyline deck" id="listing-title" />
          </div>

          <div className="space-y-2">
              <Label>Public description</Label>
            <Textarea
              className="min-h-[180px]"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the home the way a serious buyer should experience it."
            />
          </div>

          <div className="space-y-2">
            <Label>What makes this property stand out?</Label>
            <Textarea
              value={formState.uniqueFeatures}
              onChange={(event) =>
                setFormState((current) => ({ ...current, uniqueFeatures: event.target.value }))
              }
              placeholder="Sky deck, golf-facing balcony, private lift lobby, strong rental appeal, etc."
            />
          </div>

          <Button
            className="rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
            disabled={pending}
            onClick={() => {
              const titleInput = document.getElementById("listing-title") as HTMLInputElement | null;
              startTransition(async () => {
                const result = await submitListingDraftAction({
                  title: titleInput?.value || "",
                  city: formState.location,
                  propertyType: formState.propertyType,
                });
                setResultMessage(result.message);
              });
            }}
          >
            {pending ? "Saving..." : "Save Draft"}
          </Button>
          {resultMessage ? <div className="text-sm text-slate-600">{resultMessage}</div> : null}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-[28px] border-slate-200 bg-slate-950 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-amber-300" />
              AI copy support
            </CardTitle>
            <CardDescription className="text-slate-300">
              {integrationStatus.ai
                ? "Use AI to sharpen the listing tone, improve clarity, and make the value feel more convincing."
                : "AI drafting is available once the writing assistant is connected."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIDescriptionTool
              formData={formState}
              onApply={(generatedDescription) => setDescription(generatedDescription)}
            />
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl text-slate-950">Before you publish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div>Make sure contact details and ownership status are accurate.</div>
            <div>Lead with clear pricing, area, and possession information.</div>
            <div>Add enough photos to help buyers picture the space with confidence.</div>
            <div>Pin the location correctly so searchers can trust the map view.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
