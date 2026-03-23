
"use client"

import Link from 'next/link'
import { Search, Heart, User, PlusCircle, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="font-headline font-bold text-xl tracking-tight text-primary">
            The City's <span className="text-secondary">Blocks</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/search" className="text-sm font-medium hover:text-primary transition-colors">Buy</Link>
          <Link href="/search" className="text-sm font-medium hover:text-primary transition-colors">Rent</Link>
          <Link href="/search" className="text-sm font-medium hover:text-primary transition-colors">New Projects</Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/favorites">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button className="hidden sm:flex gap-2" asChild>
            <Link href="/list-property">
              <PlusCircle className="h-4 w-4" />
              Post Property
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
