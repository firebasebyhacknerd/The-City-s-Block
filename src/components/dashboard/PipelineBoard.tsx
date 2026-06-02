"use client";

import { useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { updateInquiryStatusAction } from "@/app/actions/listings";

type InquiryStatus = "new" | "contacted" | "closed";

interface Inquiry {
  id: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
  listing_title: string;
  created_at: string;
  status: InquiryStatus;
  [key: string]: any;
}

interface PipelineBoardProps {
  initialInquiries: {
    new: Inquiry[];
    contacted: Inquiry[];
    closed: Inquiry[];
  };
}

const COLUMNS: { key: InquiryStatus; label: string; color: string; bg: string }[] = [
  { key: "new",       label: "New",       color: "text-blue-700",  bg: "bg-blue-50 border-blue-200" },
  { key: "contacted", label: "Contacted", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  { key: "closed",    label: "Closed",    color: "text-green-700", bg: "bg-green-50 border-green-200" },
];

export function PipelineBoard({ initialInquiries }: PipelineBoardProps) {
  const [inquiries, setInquiries] = useState({
    new: initialInquiries?.new ?? [],
    contacted: initialInquiries?.contacted ?? [],
    closed: initialInquiries?.closed ?? [],
  });
  const [isPending, startTransition] = useTransition();

  const moveInquiry = (id: number, from: InquiryStatus, to: InquiryStatus) => {
    if (from === to) return;

    // Optimistic update
    setInquiries((prev) => {
      const item = prev[from].find((i) => i.id === id);
      if (!item) return prev;
      return {
        ...prev,
        [from]: prev[from].filter((i) => i.id !== id),
        [to]: [{ ...item, status: to }, ...prev[to]],
      };
    });

    startTransition(async () => {
      const res = await updateInquiryStatusAction(id, to);
      if (!res.ok) {
        // Revert on failure
        setInquiries((prev) => {
          const item = prev[to].find((i) => i.id === id);
          if (!item) return prev;
          return {
            ...prev,
            [to]: prev[to].filter((i) => i.id !== id),
            [from]: [{ ...item, status: from }, ...prev[from]],
          };
        });
      }
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {COLUMNS.map((col) => (
        <div key={col.key} className={`rounded-[24px] border p-4 ${col.bg}`}>
          <div className={`mb-3 flex items-center gap-2 font-semibold ${col.color}`}>
            {col.label}
            <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-700">
              {inquiries[col.key].length}
            </span>
          </div>

          {inquiries[col.key].length === 0 ? (
            <div className="rounded-2xl border border-dashed border-current/20 py-8 text-center text-sm opacity-50">
              No {col.label.toLowerCase()} inquiries
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries[col.key].map((inq) => (
                <div key={inq.id} className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                  <div className="font-medium text-slate-950">{inq.buyer_name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{inq.buyer_email}</div>
                  <div className="text-xs text-slate-500">{inq.buyer_phone}</div>
                  <div className="mt-2 text-xs text-slate-400 bg-slate-50 rounded-lg px-2 py-1 line-clamp-1">
                    {inq.listing_title}
                  </div>
                  <div className="mt-2 text-xs text-slate-400">
                    {formatDistanceToNow(new Date(inq.created_at), { addSuffix: true })}
                  </div>

                  {/* Move buttons */}
                  <div className="mt-3 flex gap-1.5 flex-wrap">
                    {COLUMNS.filter((c) => c.key !== col.key).map((target) => (
                      <button
                        key={target.key}
                        disabled={isPending}
                        onClick={() => moveInquiry(inq.id, col.key, target.key)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium border transition hover:opacity-80 disabled:opacity-40 ${target.bg} ${target.color}`}
                      >
                        → {target.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
