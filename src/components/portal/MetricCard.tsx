import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  tone?: "light" | "dark";
}

export function MetricCard({
  label,
  value,
  tone = "light",
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border px-5 py-4 shadow-sm",
        tone === "dark"
          ? "border-white/10 bg-white/5 text-white"
          : "border-slate-200 bg-white text-slate-950",
      )}
    >
      <div
        className={cn(
          "text-sm",
          tone === "dark" ? "text-white/60" : "text-slate-500",
        )}
      >
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
