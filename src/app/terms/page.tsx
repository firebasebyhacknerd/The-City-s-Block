import { StaticPageShell } from "@/components/layout/StaticPageShell";

export const metadata = { title: "Terms & Conditions | The City's Block" };

export default function TermsPage() {
  return (
    <StaticPageShell title="Terms & Conditions">
      <p>
        By using The City&apos;s Block you agree to provide accurate information when creating
        listings or sending inquiries. Owners are responsible for the truthfulness of property
        details and pricing.
      </p>
      <p>
        Listings are subject to admin approval. We may remove content that violates applicable laws
        or misleads users.
      </p>
      <p>
        For questions about these terms, contact us at hello@citysblock.in.
      </p>
    </StaticPageShell>
  );
}
