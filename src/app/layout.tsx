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
      <body className={`${inter.variable} bg-white font-body text-foreground antialiased`}>
        <NavbarWrapper />
        {children}
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
