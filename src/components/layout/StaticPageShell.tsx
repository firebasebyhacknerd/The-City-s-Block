import Link from "next/link";

export function StaticPageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="container-shell py-12 pb-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-medium text-[#1B4332] hover:underline">
          ← Back to home
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">{title}</h1>
        <div className="prose prose-slate mt-8 max-w-none text-gray-600 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </main>
  );
}
