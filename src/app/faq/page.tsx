import { StaticPageShell } from "@/components/layout/StaticPageShell";
import { FAQSection } from "@/components/home/FAQSection";

export const metadata = { title: "FAQs | The City's Block" };

export default function FAQPage() {
  return (
    <>
      <StaticPageShell title="Frequently asked questions">
        <p>Browse common questions about searching, listing, and contacting owners on our platform.</p>
      </StaticPageShell>
      <div className="-mt-8">
        <FAQSection />
      </div>
    </>
  );
}
