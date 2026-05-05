"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveListingAction, rejectListingAction, deleteListingAdminAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

export function AdminListingActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  const approve = () => {
    startTransition(async () => {
      await approveListingAction(id);
      router.refresh();
    });
  };

  const reject = () => {
    if (!reason.trim()) return;
    startTransition(async () => {
      await rejectListingAction(id, reason);
      setShowReject(false);
      router.refresh();
    });
  };

  const remove = () => {
    if (!confirm("Permanently delete this listing?")) return;
    startTransition(async () => {
      await deleteListingAdminAction(id);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-2 items-end">
      {status === "pending" && (
        <>
          <Button
            size="sm"
            className="rounded-full bg-green-600 text-white hover:bg-green-700 gap-1 w-full"
            disabled={pending}
            onClick={approve}
          >
            <CheckCircle className="h-3.5 w-3.5" /> Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full text-red-600 border-red-200 hover:bg-red-50 gap-1 w-full"
            disabled={pending}
            onClick={() => setShowReject(!showReject)}
          >
            <XCircle className="h-3.5 w-3.5" /> Reject
          </Button>
          {showReject && (
            <div className="flex gap-2 w-full">
              <Input
                placeholder="Reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-xs h-8"
              />
              <Button size="sm" className="rounded-full bg-red-600 text-white hover:bg-red-700 h-8 px-3" onClick={reject} disabled={pending}>
                Send
              </Button>
            </div>
          )}
        </>
      )}
      {status === "active" && (
        <Button
          size="sm"
          variant="outline"
          className="rounded-full text-red-600 border-red-200 hover:bg-red-50 gap-1"
          disabled={pending}
          onClick={remove}
        >
          <Trash2 className="h-3.5 w-3.5" /> Remove
        </Button>
      )}
      {status === "rejected" && (
        <>
          <Button
            size="sm"
            className="rounded-full bg-green-600 text-white hover:bg-green-700 gap-1"
            disabled={pending}
            onClick={approve}
          >
            <CheckCircle className="h-3.5 w-3.5" /> Re-approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full text-red-600 border-red-200 hover:bg-red-50 gap-1"
            disabled={pending}
            onClick={remove}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </>
      )}
    </div>
  );
}
