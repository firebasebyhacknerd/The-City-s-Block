"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { verifyUserAction, banUserAction, unbanUserAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Ban, CheckCircle } from "lucide-react";

export function AdminUserActions({
  id,
  verified,
  banned,
  isAdmin,
}: {
  id: number;
  verified: boolean;
  banned: boolean;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (isAdmin) return <span className="text-xs text-slate-400">Admin account</span>;

  return (
    <div className="flex gap-2">
      {!verified && (
        <Button
          size="sm"
          className="rounded-full bg-green-600 text-white hover:bg-green-700 gap-1"
          disabled={pending}
          onClick={() => startTransition(async () => { await verifyUserAction(id); router.refresh(); })}
        >
          <ShieldCheck className="h-3.5 w-3.5" /> Verify
        </Button>
      )}
      {!banned ? (
        <Button
          size="sm"
          variant="outline"
          className="rounded-full text-red-600 border-red-200 hover:bg-red-50 gap-1"
          disabled={pending}
          onClick={() => {
            if (!confirm("Ban this user?")) return;
            startTransition(async () => { await banUserAction(id); router.refresh(); });
          }}
        >
          <Ban className="h-3.5 w-3.5" /> Ban
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="rounded-full text-green-600 border-green-200 hover:bg-green-50 gap-1"
          disabled={pending}
          onClick={() => startTransition(async () => { await unbanUserAction(id); router.refresh(); })}
        >
          <CheckCircle className="h-3.5 w-3.5" /> Unban
        </Button>
      )}
    </div>
  );
}
