"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signInAction, signUpAction } from "@/app/actions/portal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <Card className="rounded-[32px] border-slate-200 bg-white shadow-xl">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl text-slate-950">
          {mode === "login" ? "Welcome back to confident property search" : "Create your account and move with clarity"}
        </CardTitle>
        <CardDescription className="text-base">
          {mode === "login"
            ? "Pick up your shortlists, saved alerts, and conversations with trusted property experts."
            : "Start as a buyer, owner, agent, or builder and keep every listing, alert, and inquiry in one place."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === "signup" ? <Input id="name" placeholder="Full name" /> : null}
        <Input id="email" type="email" placeholder="Email address" />
        <Input id="password" type="password" placeholder="Password" />
        <Button
          className="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const email = (document.getElementById("email") as HTMLInputElement | null)?.value || "";
              const password =
                (document.getElementById("password") as HTMLInputElement | null)?.value || "";
              const name = (document.getElementById("name") as HTMLInputElement | null)?.value || "";
              const result =
                mode === "login"
                  ? await signInAction({ email, password })
                  : await signUpAction({ name, email, password });
              setMessage(result.message);
            })
          }
        >
          {pending ? "Please wait..." : mode === "login" ? "Sign in to continue" : "Create my account"}
        </Button>
        {message ? <div className="text-sm text-slate-600">{message}</div> : null}
        <div className="text-sm text-slate-500">
          {mode === "login" ? "New to The City's Block?" : "Already part of The City's Block?"}{" "}
          <Link
            href={mode === "login" ? "/signup" : "/login"}
            className="font-medium text-slate-950 underline underline-offset-4"
          >
            {mode === "login" ? "Create your account" : "Sign in here"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
