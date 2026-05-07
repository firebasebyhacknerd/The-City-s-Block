import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";

export const metadata = { title: "Create Account | The City's Blocks" };

export default function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-white shadow-sm">
            <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none">
              <rect x="4" y="10" width="7" height="16" rx="0.5" fill="#1B4332" />
              <rect x="12.5" y="4" width="7" height="22" rx="0.5" fill="#1B4332" />
              <rect x="21" y="10" width="7" height="16" rx="0.5" fill="#1B4332" />
              <polygon points="7.5,10 4,10 7.5,5" fill="#1B4332" />
              <polygon points="16,4 12.5,4 16,0" fill="#1B4332" />
              <polygon points="24.5,10 21,10 24.5,5" fill="#1B4332" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1B4332]">The City's Blocks</h1>
          <p className="text-sm text-[#C9A84C] font-semibold">Trusted Advisory</p>
        </div>
        <SignupForm />
        <p className="text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#1B4332] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
