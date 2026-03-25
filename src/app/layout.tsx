import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import { SiteFooter } from "@/components/layout/SiteFooter";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-headline",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://the-citys-block.vercel.app"),
  title: "The City's Block | India Property Portal",
  description:
    "Discover residential and commercial listings, projects, localities, and verified agents across India's top property markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${fraunces.variable} bg-background font-body text-foreground antialiased`}>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.08),transparent_26%),linear-gradient(180deg,#fffdfa_0%,#f8fafc_55%,#ffffff_100%)]">
          <Navbar />
          {children}
          <SiteFooter />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
