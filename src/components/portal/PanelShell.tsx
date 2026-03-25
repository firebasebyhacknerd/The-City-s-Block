import Link from "next/link";
import { cn } from "@/lib/utils";

interface PanelShellProps {
  title: string;
  description: string;
  items: Array<{ label: string; href: string }>;
  activeHref: string;
  children: React.ReactNode;
}

export function PanelShell({
  title,
  description,
  items,
  activeHref,
  children,
}: PanelShellProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-5 px-2">
          <div className="text-xl font-semibold text-slate-950">{title}</div>
          <div className="mt-1 text-sm leading-6 text-slate-500">{description}</div>
        </div>
        <nav className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                item.href === activeHref
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
