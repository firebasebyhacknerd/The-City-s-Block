"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUpAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "owner" ? "owner" : "buyer";

  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: defaultRole,
    phone: "",
    city: "",
  });

  useEffect(() => {
    setForm((f) => ({ ...f, role: defaultRole }));
  }, [defaultRole]);

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await signUpAction(form);
      if (result.ok) {
        if (result.role === "admin") {
          router.push("/admin");
        } else if (result.role === "owner") {
          router.push("/dashboard/new-listing");
        } else {
          router.push("/search");
        }
      } else {
        setMessage(result.message);
      }
    });
  };

  return (
    <Card className="rounded-[32px] border-slate-200 bg-white shadow-xl">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl text-slate-950">Create your account</CardTitle>
        <CardDescription className="text-base">
          {defaultRole === "owner"
            ? "List your personal property for free. Listings go live after a quick review."
            : "Join as a buyer to save listings, send inquiries, and get alerts."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Full name</Label>
          <Input
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <p className="text-xs text-slate-500">Use 8 or more characters with letters and numbers.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>I am a</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buyer / Renter</SelectItem>
                <SelectItem value="owner">Property Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              placeholder="Ahmedabad"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Phone (optional)</Label>
          <Input
            placeholder="+91 98xxx xxxxx"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <Button
          className="btn-brand w-full rounded-full"
          disabled={pending}
          onClick={handleSubmit}
        >
          {pending ? "Creating account..." : "Create account"}
        </Button>
        {message && <div className="text-sm text-red-600">{message}</div>}
        <div className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#1B4332] underline underline-offset-4">
            Sign in here
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
