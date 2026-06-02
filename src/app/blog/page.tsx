import Link from "next/link";
import { StaticPageShell } from "@/components/layout/StaticPageShell";

export const metadata = { title: "Blog | The City's Block" };

export default function BlogPage() {
  return (
    <StaticPageShell title="Blog & guides">
      <p>Property guides and market updates are coming soon.</p>
      <p>
        In the meantime, explore{" "}
        <Link href="/search" className="text-[#1B4332] font-medium hover:underline">
          live listings
        </Link>{" "}
        or read our{" "}
        <Link href="/faq" className="text-[#1B4332] font-medium hover:underline">
          FAQs
        </Link>
        .
      </p>
    </StaticPageShell>
  );
}
