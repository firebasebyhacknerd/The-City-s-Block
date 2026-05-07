"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Why choose The City's Block as your real estate consultant?",
    a: "The City's Block is a trusted name for real estate in India. Our team of expert property specialists and advisors guide you in buying, selling, and investing with ease.",
  },
  {
    q: "What services does a property consultant provide?",
    a: "A property consultant helps with property search, site visits, negotiation, and complete investment guidance. The City's Block offers end-to-end solutions for residential and commercial properties.",
  },
  {
    q: "How do I search for properties on this platform?",
    a: "Use the search bar on the homepage to filter by location, BHK, budget, possession status, and property type. You can also browse by locality or project.",
  },
  {
    q: "Can I find verified properties here?",
    a: "Yes. All featured listings are verified by our team. Look for the 'Verified' badge on property cards for added confidence.",
  },
  {
    q: "How do I list my property for sale or rent?",
    a: "Click 'Post FREE' in the navigation bar, create an account as an owner or agent, and fill in your property details. Your listing will go live after admin approval.",
  },
  {
    q: "What is the best way to contact a property owner?",
    a: "Each listing page has an inquiry form and a WhatsApp contact option. You can also call directly if the owner has shared their number.",
  },
  {
    q: "Are new project listings available?",
    a: "Yes. Visit the 'New Projects' section to explore launch-stage and ready-to-move projects with pricing, possession dates, and builder details.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
                aria-expanded={open === i}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="border-t border-gray-100 px-5 py-4 text-sm leading-6 text-gray-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
