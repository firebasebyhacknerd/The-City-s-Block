import { StaticPageShell } from "@/components/layout/StaticPageShell";

export const metadata = { title: "About Us | The City's Block" };

export default function AboutPage() {
  return (
    <StaticPageShell title="About The City's Block">
      <p>
        The City&apos;s Block is a trusted property platform focused on Ahmedabad and Gandhinagar.
        We help buyers and renters discover verified homes and commercial spaces, and help owners
        list their personal properties directly—without agents or brokers.
      </p>
      <p>
        Every owner listing is reviewed before it goes live, so you can search with confidence.
      </p>
    </StaticPageShell>
  );
}
