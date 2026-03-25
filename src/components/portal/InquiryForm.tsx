"use client";

import { useState, useTransition } from "react";
import { MessageSquare, PhoneCall } from "lucide-react";
import { submitInquiryAction } from "@/app/actions/portal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getWhatsAppLink, type Listing, type Profile } from "@/lib/portal";

export function InquiryForm({
  listing,
  profile,
}: {
  listing: Listing;
  profile: Profile;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <div className="text-xl font-semibold text-slate-950">Speak with {profile.name}</div>
        <div className="mt-1 text-sm text-slate-500">
          Ask for pricing, site visits, payment details, or availability and get a faster, clearer response.
        </div>
      </div>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          startTransition(async () => {
            const result = await submitInquiryAction({
              listingId: listing.id,
              listingTitle: listing.title,
              agentEmail: profile.email,
              buyerName: String(formData.get("buyerName") || ""),
              buyerPhone: String(formData.get("buyerPhone") || ""),
              buyerEmail: String(formData.get("buyerEmail") || ""),
              message:
                String(formData.get("message") || "") ||
                `Hi, I am interested in ${listing.title}.`,
            });
            setMessage(result.message);
          });
        }}
      >
        <Input name="buyerName" placeholder="Full name" />
        <Input name="buyerPhone" placeholder="Mobile number" />
        <Input name="buyerEmail" placeholder="Email address" type="email" />
        <Textarea
          name="message"
          placeholder={`I would like pricing, availability, and a callback for ${listing.title}.`}
          className="min-h-[120px]"
        />
        <Button className="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800" disabled={pending}>
          <MessageSquare className="h-4 w-4" />
          {pending ? "Sending..." : "Request Details"}
        </Button>
      </form>
      {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
      <Button asChild variant="outline" className="mt-3 w-full rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
        <a href={getWhatsAppLink(profile.phone, listing.title)} target="_blank" rel="noreferrer">
          <PhoneCall className="h-4 w-4" />
          Chat on WhatsApp
        </a>
      </Button>
    </div>
  );
}
