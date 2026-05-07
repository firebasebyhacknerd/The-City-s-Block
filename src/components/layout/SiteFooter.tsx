import Link from "next/link";
import { Phone, Mail, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Blogs", href: "/blog" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Sitemap", href: "/sitemap" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Top row: logo + description + contact */}
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
          {/* Left: brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {/* Brand mark */}
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-white">
                <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="4" y="10" width="7" height="16" rx="0.5" fill="#1B4332" />
                  <rect x="12.5" y="4" width="7" height="22" rx="0.5" fill="#1B4332" />
                  <rect x="21" y="10" width="7" height="16" rx="0.5" fill="#1B4332" />
                  <polygon points="7.5,10 4,10 7.5,5" fill="#1B4332" />
                  <polygon points="16,4 12.5,4 16,0" fill="#1B4332" />
                  <polygon points="24.5,10 21,10 24.5,5" fill="#1B4332" />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="font-bold text-[#1B4332] text-base">The City's Blocks</div>
                <div className="text-[10px] font-semibold text-[#C9A84C] uppercase tracking-wide">Trusted Advisory</div>
              </div>
            </div>
            <p className="max-w-md text-sm leading-6 text-gray-500">
              A trustworthy one-stop solution for all your property needs. We help you buy, rent, and discover verified properties across India's top markets.
            </p>
            <p className="text-xs text-gray-400">
              RERA No: AG/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/AA00842/160429R2
            </p>
          </div>

          {/* Right: contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">Connect with Us</h3>
            <a
              href="tel:+919998470000"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"
            >
              <Phone className="h-4 w-4 text-red-500" />
              +91 99984 70000
            </a>
            <a
              href="mailto:hello@citysblock.in"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"
            >
              <Mail className="h-4 w-4 text-red-500" />
              hello@citysblock.in
            </a>

            {/* Social icons */}
            <div className="pt-1">
              <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Follow us on</p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-red-300 hover:text-red-600"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-100" />

        {/* Bottom row: nav links + copyright */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 sm:justify-start">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-gray-500 transition hover:text-red-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-gray-400 shrink-0">
            © {new Date().getFullYear()} The City's Block. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
