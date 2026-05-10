import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import { SiteFooter } from "@/components/layout/SiteFooter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://the-city-s-block.vercel.app"),
  title: {
    default: "The City's Block | India Property Portal",
    template: "%s | The City's Block",
  },
  description:
    "Discover residential and commercial listings, projects, localities, and verified agents across India's top property markets.",
  keywords: ["property", "real estate", "Ahmedabad", "buy", "rent", "office space", "villa", "apartment"],
  openGraph: {
    type: "website",
    siteName: "The City's Block",
    title: "The City's Block | India Property Portal",
    description:
      "Discover verified homes, new launches, and commercial spaces across India's top property markets.",
    url: "https://the-city-s-block.vercel.app",
    images: [
      {
        url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "The City's Block — India Property Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The City's Block | India Property Portal",
    description:
      "Discover verified homes, new launches, and commercial spaces across India's top property markets.",
    images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-white font-body text-foreground antialiased`}>
        <NavbarWrapper />
        {children}
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
