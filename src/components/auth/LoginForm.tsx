"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function safeRedirectPath(from: string | null): string | null {
  if (!from || !from.startsWith("/") || from.startsWith("//")) return null;
  return from;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = safeRedirectPath(searchParams.get("from"));

  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await signInAction({ email, password });
      if (result.ok) {
        if (from) {
          router.push(from);
        } else if (result.role === "admin") {
          router.push("/admin");
        } else if (result.role === "owner") {
          router.push("/dashboard");
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
        <CardTitle className="text-3xl text-slate-950">Welcome back</CardTitle>
        <CardDescription className="text-base">
          Sign in to access your dashboard, saved listings, and inquiries.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <Button
          className="btn-brand w-full rounded-full"
          disabled={pending}
          onClick={handleSubmit}
        >
          {pending ? "Signing in..." : "Sign in"}
        </Button>
        {message && <div className="text-sm text-red-600">{message}</div>}
        <div className="text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-[#1B4332] underline underline-offset-4">
            Create one here
          </Link>
        </div>
        <div className="text-sm text-slate-500">
          Want to list property?{" "}
          <Link href="/signup?role=owner" className="font-medium text-[#1B4332] underline underline-offset-4">
            Register as owner
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
