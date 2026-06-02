"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteMyListingAction } from "@/app/actions/listings";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteListingButton({ id }: { id: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full text-red-600 border-red-200 hover:bg-red-50 gap-1"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this listing?")) return;
        startTransition(async () => {
          await deleteMyListingAction(id);
          router.refresh();
        });
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
      {pending ? "..." : "Delete"}
    </Button>
  );
}
