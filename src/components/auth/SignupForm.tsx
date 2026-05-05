"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
    phone: "",
    city: "",
  });

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await signUpAction(form);
      if (result.ok) {
        if (result.role === "admin") {
          router.push("/admin");
        } else if (result.role === "owner" || result.role === "agent") {
          router.push("/dashboard");
        } else {
          router.push("/");
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
          Join as a buyer, owner, or agent and manage everything in one place.
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
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
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
                <SelectItem value="agent">Agent / Broker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              placeholder="Your city"
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
          className="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800"
          disabled={pending}
          onClick={handleSubmit}
        >
          {pending ? "Creating account..." : "Create account"}
        </Button>
        {message && <div className="text-sm text-red-600">{message}</div>}
        <div className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-slate-950 underline underline-offset-4">
            Sign in here
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
