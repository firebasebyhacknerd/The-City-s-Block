
"use client"

import Navbar from '@/components/layout/Navbar'
import PropertyCard from '@/components/property/PropertyCard'
import { PROPERTIES } from '@/app/lib/mock-data'
import { Heart, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function FavoritesPage() {
  // Simulating favorites - in a real app this would come from local storage or database
  const favorites = PROPERTIES.slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Heart className="h-8 w-8 text-destructive fill-current" />
            Your Saved Blocks
          </h1>
          <p className="text-muted-foreground mt-2">Manage and compare properties you've shortlisted.</p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed shadow-sm">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold">No saved blocks yet</h2>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Heart your favorite properties to keep them here for later comparison.
            </p>
            <Button className="mt-8 bg-primary text-white px-8 h-12 rounded-xl" asChild>
              <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                Explore Properties
              </Link>
            </Button>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="mt-16 p-8 bg-primary rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Need professional advice?</h3>
              <p className="text-white/80">Our experts can help you choose the best block from your shortlist.</p>
            </div>
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold h-14 px-8">
              Book a Free Consultation
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
