
"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import PropertyCard from '@/components/property/PropertyCard'
import { PROPERTIES } from '@/app/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Building, DollarSign } from 'lucide-react'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen flex flex-col font-body bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1449156001437-3758a27473b3?q=80&w=1600&h=800&auto=format&fit=crop"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]" />
        
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-white mb-6 drop-shadow-lg">
            Find Your Perfect Block
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md">
            Whether you're looking for a cozy studio or a luxury penthouse, discover properties in the city's most vibrant neighborhoods.
          </p>
          
          <div className="bg-white p-2 rounded-xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 h-5 w-5" />
              <Input 
                placeholder="Where would you like to live?" 
                className="pl-10 h-14 border-none text-base focus-visible:ring-0"
              />
            </div>
            <div className="hidden md:flex h-10 w-px bg-muted self-center" />
            <div className="flex-1 relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 h-5 w-5" />
              <Input 
                placeholder="Property Type" 
                className="pl-10 h-14 border-none text-base focus-visible:ring-0"
              />
            </div>
            <Button size="lg" className="h-14 px-8 bg-secondary hover:bg-secondary/90 text-white font-bold text-lg rounded-lg">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-headline font-bold text-primary">Featured Blocks</h2>
            <p className="text-muted-foreground mt-2">Handpicked premium properties just for you.</p>
          </div>
          <Button variant="link" className="text-primary font-bold" asChild>
            <Link href="/search">View All Properties</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-secondary mb-2">10k+</div>
            <div className="text-sm uppercase tracking-wider text-white/70">Listings</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-secondary mb-2">5k+</div>
            <div className="text-sm uppercase tracking-wider text-white/70">Happy Clients</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-secondary mb-2">200+</div>
            <div className="text-sm uppercase tracking-wider text-white/70">City Blocks</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-secondary mb-2">500+</div>
            <div className="text-sm uppercase tracking-wider text-white/70">Expert Agents</div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold text-center text-primary mb-16">The Blocks Difference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Smart Filtering</h3>
              <p className="text-muted-foreground">Find exactly what you need with our advanced search tools and precise block-based navigation.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">AI Listings</h3>
              <p className="text-muted-foreground">Get professional descriptions instantly with our built-in AI writing assistant for every property.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Verified Pricing</h3>
              <p className="text-muted-foreground">We ensure all our listings feature competitive, verified market pricing to save you time and money.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-12 text-white/80 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-secondary" />
                <span className="font-headline font-bold text-xl tracking-tight text-white">
                  The City's <span className="text-secondary">Blocks</span>
                </span>
              </Link>
              <p className="text-sm">Building a better way to find your next urban sanctuary. Trusted by thousands across the city.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/search" className="hover:text-secondary">Buy Properties</Link></li>
                <li><Link href="/search" className="hover:text-secondary">Rent Properties</Link></li>
                <li><Link href="/list-property" className="hover:text-secondary">Sell Your Block</Link></li>
                <li><Link href="/profile" className="hover:text-secondary">Your Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-secondary">Help Center</Link></li>
                <li><Link href="#" className="hover:text-secondary">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-secondary">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-secondary">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Newsletter</h4>
              <p className="text-sm mb-4">Stay updated with the latest city block arrivals.</p>
              <div className="flex gap-2">
                <Input placeholder="Email" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
                <Button className="bg-secondary hover:bg-secondary/90 text-white">Join</Button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-xs">
            © {new Date().getFullYear()} The City's Blocks. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function Building2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
