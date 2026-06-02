"use client";

import { useState } from "react";
import { Phone, MessageCircle, Share2, CheckCircle } from "lucide-react";
import { FavoriteButton } from "@/components/portal/FavoriteButton";
import { InquiryForm } from "@/components/portal/InquiryFormDb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function whatsAppUrl(phone: string, title: string) {
  const digits = phone.replace(/[^\d]/g, "");
  const text = encodeURIComponent(`Hi, I am interested in "${title}" on The City's Block.`);
  return `https://wa.me/${digits}?text=${text}`;
}

export function ListingContactPanel({
  listingId,
  listingTitle,
  displayPrice,
  pricePerSqft,
  furnishing,
  verified,
  ownerName,
  ownerPhone,
}: {
  listingId: number;
  listingTitle: string;
  displayPrice: string;
  pricePerSqft?: string;
  furnishing?: string | null;
  verified?: boolean;
  ownerName?: string;
  ownerPhone?: string | null;
}) {
  const [shared, setShared] = useState(false);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: listingTitle, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      /* cancelled */
    }
  }

  const panel = (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-3xl font-bold text-[#1B4332]">{displayPrice}</div>
            {pricePerSqft && <div className="text-sm text-slate-500 mt-1">{pricePerSqft}</div>}
            {furnishing && (
              <div className="mt-2 text-sm text-slate-600">
                <span className="font-medium">Furnishing:</span> {furnishing}
              </div>
            )}
          </div>
          <FavoriteButton listingId={listingId} />
        </div>
        {verified && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200 cursor-help">
                  <CheckCircle className="h-3.5 w-3.5" /> Verified listing
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Reviewed by The City&apos;s Block before going live.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <button
          type="button"
          onClick={handleShare}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Share2 className="h-4 w-4" />
          {shared ? "Link copied!" : "Share listing"}
        </button>
      </div>

      {ownerName && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-950 mb-2">Listed by owner</h3>
          <div className="font-medium text-slate-800">{ownerName}</div>
          {ownerPhone && (
            <div className="mt-3 flex flex-col gap-2">
              <a
                href={`tel:${ownerPhone}`}
                className="btn-brand flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
              >
                <Phone className="h-4 w-4" /> Call owner
              </a>
              <a
                href={whatsAppUrl(ownerPhone, listingTitle)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-green-600 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-800 hover:bg-green-100"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          )}
        </div>
      )}

      <InquiryForm listingId={listingId} listingTitle={listingTitle} />
    </div>
  );

  return (
    <>
      <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">{panel}</div>
      <div className="lg:hidden">{panel}</div>

      {ownerPhone && (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t border-gray-200 bg-white p-3 shadow-lg lg:hidden">
          <a
            href={`tel:${ownerPhone}`}
            className="btn-brand flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          <a
            href={whatsAppUrl(ownerPhone, listingTitle)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-green-600 bg-green-600 py-3 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
