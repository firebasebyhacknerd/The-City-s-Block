"use client";

import { useState, useTransition } from "react";
import { changePasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PasswordChangeForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const set = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (form.newPassword !== form.confirmPassword) {
      setMessage({ ok: false, text: "New passwords do not match." });
      return;
    }

    startTransition(async () => {
      const result = await changePasswordAction(
        form.currentPassword,
        form.newPassword
      );
      setMessage({ ok: result.ok, text: result.message });
      if (result.ok) {
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          type="password"
          placeholder="Enter your current password"
          value={form.currentPassword}
          onChange={(e) => set("currentPassword", e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="At least 6 characters"
          value={form.newPassword}
          onChange={(e) => set("newPassword", e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Repeat your new password"
          value={form.confirmPassword}
          onChange={(e) => set("confirmPassword", e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
          disabled={pending}
        >
          {pending ? "Updating..." : "Change password"}
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
