"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProjectAction, updateProjectAction } from "@/app/actions/admin";

const CITIES = ["Mumbai", "Delhi", "Gurugram", "Noida", "Bengaluru", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad"];

interface ProjectFormProps {
  project?: {
    id: number;
    name: string;
    developer: string | null;
    city: string;
    locality: string | null;
    description: string | null;
    status: "draft" | "published";
    image_url: string | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const isEdit = !!project;
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const [form, setForm] = useState({
    name: project?.name ?? "",
    developer: project?.developer ?? "",
    city: project?.city ?? "",
    locality: project?.locality ?? "",
    description: project?.description ?? "",
    status: project?.status ?? "draft" as "draft" | "published",
    image_url: project?.image_url ?? "",
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    startTransition(async () => {
      const data = {
        name: form.name,
        developer: form.developer || undefined,
        city: form.city,
        locality: form.locality || undefined,
        description: form.description || undefined,
        status: form.status,
        image_url: form.image_url || undefined,
      };

      const res = isEdit
        ? await updateProjectAction(project!.id, data)
        : await createProjectAction(data);

      setMessage({ ok: res.ok, text: res.message });
      if (res.ok) onSuccess?.();
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Project name *</Label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Prestige Skyline" />
        </div>
        <div className="space-y-1.5">
          <Label>Developer</Label>
          <Input value={form.developer} onChange={(e) => set("developer", e.target.value)} placeholder="e.g. Prestige Group" />
        </div>
        <div className="space-y-1.5">
          <Label>City *</Label>
          <Select value={form.city} onValueChange={(v) => set("city", v)}>
            <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Locality</Label>
          <Input value={form.locality} onChange={(e) => set("locality", e.target.value)} placeholder="e.g. Whitefield" />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Image URL</Label>
          <Input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://..." />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe the project…"
          className="min-h-[80px]"
        />
      </div>

      {message && (
        <div className={`rounded-xl p-3 text-sm ${message.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
          disabled={isPending}
          onClick={handleSubmit}
        >
          {isPending ? "Saving…" : isEdit ? "Update Project" : "Create Project"}
        </Button>
        {onCancel && (
          <Button variant="outline" className="rounded-full" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
