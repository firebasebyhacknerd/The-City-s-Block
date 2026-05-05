"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthError,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AuthFormProps {
  mode: "login" | "signup";
}

function getAuthErrorMessage(error: AuthError): string {
  switch (error.code) {
    case "auth/invalid-email":
      return "That email address doesn't look right. Check the format and try again.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email or password is incorrect. Double-check and try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a moment before trying again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function AuthForm({ mode }: AuthFormProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    startTransition(async () => {
      const email =
        (document.getElementById("email") as HTMLInputElement | null)?.value?.trim() || "";
      const password =
        (document.getElementById("password") as HTMLInputElement | null)?.value || "";
      const name =
        (document.getElementById("name") as HTMLInputElement | null)?.value?.trim() || "";

      if (!email || !password) {
        setIsError(true);
        setMessage("Enter your email and password to continue.");
        return;
      }

      if (mode === "signup" && !name) {
        setIsError(true);
        setMessage("Enter your full name to create an account.");
        return;
      }

      try {
        const { auth, firestore } = initializeFirebase();

        if (mode === "login") {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          const uid = credential.user.uid;
          await setDoc(doc(firestore, "users", uid), {
            name,
            email,
            role: "buyer",
            verificationStatus: "unverified",
            phone: "",
            city: "",
            createdAt: new Date().toISOString(),
          });
        }

        router.push("/dashboard");
      } catch (err) {
        setIsError(true);
        setMessage(getAuthErrorMessage(err as AuthError));
      }
    });
  };

  return (
    <Card className="rounded-[32px] border-slate-200 bg-white shadow-xl">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl text-slate-950">
          {mode === "login"
            ? "Welcome back to confident property search"
            : "Create your account and move with clarity"}
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
          onClick={handleSubmit}
        >
          {pending
            ? "Please wait..."
            : mode === "login"
              ? "Sign in to continue"
              : "Create my account"}
        </Button>
        {message ? (
          <div className={`text-sm ${isError ? "text-red-600" : "text-slate-600"}`}>
            {message}
          </div>
        ) : null}
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
