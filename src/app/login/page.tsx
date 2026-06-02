import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export const metadata = { title: "Sign In | The City's Block" };

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-white shadow-sm">
            <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
              <rect x="4" y="10" width="7" height="16" rx="0.5" fill="#1B4332" />
              <rect x="12.5" y="4" width="7" height="22" rx="0.5" fill="#1B4332" />
              <rect x="21" y="10" width="7" height="16" rx="0.5" fill="#1B4332" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1B4332]">The City&apos;s Block</h1>
          <p className="text-sm text-[#C9A84C] font-semibold">Trusted Advisory</p>
        </div>
        <Suspense fallback={<div className="h-80 rounded-[32px] bg-white animate-pulse" />}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-xs text-gray-400">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-[#1B4332] hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </main>
  );
}
