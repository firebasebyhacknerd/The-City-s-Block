"use client";

import { useState, useTransition } from "react";
import { submitInquiryAction } from "@/app/actions/listings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

export function InquiryForm({ listingId, listingTitle }: { listingId: number; listingTitle: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [form, setForm] = useState({ buyer_name: "", buyer_email: "", buyer_phone: "", message: "" });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await submitInquiryAction({ listing_id: listingId, ...form });
      setMessage({ ok: result.ok, text: result.message });
      if (result.ok) setForm({ buyer_name: "", buyer_email: "", buyer_phone: "", message: "" });
    });
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-slate-400" />
        <h3 className="font-semibold text-slate-950">Send Inquiry</h3>
      </div>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Your name</Label>
          <Input placeholder="Full name" value={form.buyer_name} onChange={(e) => set("buyer_name", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Email</Label>
          <Input type="email" placeholder="you@example.com" value={form.buyer_email} onChange={(e) => set("buyer_email", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Phone</Label>
          <Input placeholder="+91 98xxx xxxxx" value={form.buyer_phone} onChange={(e) => set("buyer_phone", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Message (optional)</Label>
          <Textarea
            placeholder={`I'm interested in "${listingTitle}". Please share more details.`}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </div>
      <Button
        className="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800"
        disabled={pending}
        onClick={handleSubmit}
      >
        {pending ? "Sending..." : "Send Inquiry"}
      </Button>
      {message && (
        <div className={`text-sm rounded-2xl p-3 ${message.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
