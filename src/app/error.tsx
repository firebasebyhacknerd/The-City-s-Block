"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled runtime error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-6 py-12 text-center bg-gray-50">
      <div className="max-w-md w-full rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 border border-amber-100 mb-6">
          <AlertTriangle className="h-8 w-8 text-[#C9A84C]" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          An unexpected error occurred while rendering this page. We have logged this issue and our team is looking into it.
        </p>

        {error.digest && (
          <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-left font-mono text-[10px] text-gray-400 border border-gray-100">
            <span className="font-semibold text-gray-500">Digest ID:</span> {error.digest}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#1B4332] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1B4332]/95 shadow-sm active:scale-95"
          >
            <RefreshCw className="h-4 w-4 text-[#C9A84C]" />
            Try again
          </button>
          
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
