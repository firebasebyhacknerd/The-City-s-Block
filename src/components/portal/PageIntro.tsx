import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-3", align === "center" && "text-center")}>
      {eyebrow ? (
        <div className="text-sm font-medium uppercase tracking-[0.24em] text-amber-600">
          {eyebrow}
        </div>
      ) : null}
      <h1 className="font-headline text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
        {title}
      </h1>
      <p className="max-w-3xl text-base leading-7 text-slate-600 md:text-lg">{description}</p>
    </div>
  );
}
