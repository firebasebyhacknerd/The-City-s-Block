import { StaticPageShell } from "@/components/layout/StaticPageShell";

export const metadata = { title: "Contact | The City's Block" };

export default function ContactPage() {
  return (
    <StaticPageShell title="Contact us">
      <p>We&apos;re happy to help with listings, inquiries, or account questions.</p>
      <ul className="list-none space-y-3 pl-0">
        <li>
          <strong>Phone:</strong>{" "}
          <a href="tel:+919998470000" className="text-[#1B4332] hover:underline">
            +91 99984 70000
          </a>
        </li>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:hello@citysblock.in" className="text-[#1B4332] hover:underline">
            hello@citysblock.in
          </a>
        </li>
      </ul>
      <p className="text-sm text-gray-500">
        RERA No: AG/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/AA00842/160429R2
      </p>
    </StaticPageShell>
  );
}
