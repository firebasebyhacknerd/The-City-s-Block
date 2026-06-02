"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, Trash2, ShieldCheck, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  bulkApproveListingsAction,
  bulkRejectListingsAction,
  bulkDeleteListingsAction,
  bulkVerifyUsersAction,
  bulkBanUsersAction,
} from "@/app/actions/admin";

interface BulkActionToolbarProps {
  selectedIds: number[];
  type: "listings" | "users";
  onSuccess: () => void;
}

export function BulkActionToolbar({ selectedIds, type, onSuccess }: BulkActionToolbarProps) {
  const [isPending, startTransition] = useTransition();
  const [rejectReason, setRejectReason] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  if (selectedIds.length === 0) return null;

  const handleApprove = () => {
    startTransition(async () => {
      const res = await bulkApproveListingsAction(selectedIds);
      setMessage({ ok: res.ok, text: res.ok ? `${res.count} listing(s) approved.` : (res.message ?? "Failed.") });
      if (res.ok) onSuccess();
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    startTransition(async () => {
      const res = await bulkRejectListingsAction(selectedIds, rejectReason);
      setMessage({ ok: res.ok, text: res.ok ? `${res.count} listing(s) rejected.` : (res.message ?? "Failed.") });
      if (res.ok) { setRejectReason(""); onSuccess(); }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const res = await bulkDeleteListingsAction(selectedIds);
      setMessage({ ok: res.ok, text: res.ok ? `${res.count} listing(s) deleted.` : (res.message ?? "Failed.") });
      if (res.ok) onSuccess();
    });
  };

  const handleVerify = () => {
    startTransition(async () => {
      const res = await bulkVerifyUsersAction(selectedIds);
      setMessage({ ok: res.ok, text: res.ok ? `${res.count} user(s) verified.` : (res.message ?? "Failed.") });
      if (res.ok) onSuccess();
    });
  };

  const handleBan = () => {
    startTransition(async () => {
      const res = await bulkBanUsersAction(selectedIds);
      setMessage({ ok: res.ok, text: res.ok ? `${res.count} user(s) banned.` : (res.message ?? "Failed.") });
      if (res.ok) onSuccess();
    });
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
      <span className="text-sm font-semibold text-blue-800">
        {selectedIds.length} selected
      </span>

      {type === "listings" && (
        <>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-full border-green-300 text-green-700 hover:bg-green-50"
            disabled={isPending}
            onClick={handleApprove}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
          </Button>

          {/* Reject with reason */}
          <div className="flex items-center gap-1.5">
            <Input
              placeholder="Rejection reason…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="h-8 w-44 rounded-full text-xs"
            />
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 rounded-full border-amber-300 text-amber-700 hover:bg-amber-50"
              disabled={isPending || !rejectReason.trim()}
              onClick={handleReject}
            >
              <XCircle className="h-3.5 w-3.5" /> Reject
            </Button>
          </div>

          {/* Delete with confirm */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 rounded-full border-red-300 text-red-700 hover:bg-red-50"
                disabled={isPending}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {selectedIds.length} listing(s)?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All selected listings will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {type === "users" && (
        <>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-full border-green-300 text-green-700 hover:bg-green-50"
            disabled={isPending}
            onClick={handleVerify}
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Verify
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 rounded-full border-red-300 text-red-700 hover:bg-red-50"
                disabled={isPending}
              >
                <Ban className="h-3.5 w-3.5" /> Ban
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ban {selectedIds.length} user(s)?</AlertDialogTitle>
                <AlertDialogDescription>
                  Banned users will not be able to sign in. This can be reversed individually from the users page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleBan}
                >
                  Ban Users
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {message && (
        <span className={`ml-auto text-xs font-medium ${message.ok ? "text-green-700" : "text-red-700"}`}>
          {message.text}
        </span>
      )}
    </div>
  );
}
