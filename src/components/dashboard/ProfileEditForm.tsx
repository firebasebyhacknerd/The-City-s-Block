"use client";

import { useState, useTransition } from "react";
import { updateProfileAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileEditFormProps {
  user: {
    name: string;
    phone?: string | null;
    city?: string | null;
    bio?: string | null;
  };
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const [form, setForm] = useState({
    name: user.name ?? "",
    phone: user.phone ?? "",
    city: user.city ?? "",
    bio: user.bio ?? "",
  });

  const set = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await updateProfileAction({
        name: form.name,
        phone: form.phone || undefined,
        city: form.city || undefined,
        bio: form.bio || undefined,
      });
      setMessage({ ok: result.ok, text: result.message });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Full name *</Label>
        <Input
          id="name"
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="e.g. Mumbai"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell buyers a bit about yourself..."
          className="min-h-[100px]"
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
          disabled={pending}
        >
          {pending ? "Saving..." : "Save changes"}
        </Button>

        {message && (
          <div
            className={`text-sm rounded-2xl px-4 py-2 ${
              message.ok
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </form>
  );
}
