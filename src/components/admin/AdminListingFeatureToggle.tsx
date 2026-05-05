"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFeaturedAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function AdminListingFeatureToggle({
  id,
  featured,
}: {
  id: number;
  featured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await toggleFeaturedAction(id);
      router.refresh();
    });
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded-full gap-1"
      disabled={pending}
      onClick={handleClick}
      title={featured ? "Unfeature listing" : "Feature listing"}
    >
      <Star
        className={`h-3.5 w-3.5 ${featured ? "fill-amber-400 text-amber-400" : "text-slate-400"}`}
      />
    </Button>
  );
}
