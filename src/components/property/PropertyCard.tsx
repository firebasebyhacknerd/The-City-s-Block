
"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Bed, Bath, Square, MapPin, Heart } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Property } from '@/app/lib/mock-data'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-primary/90 text-white border-none">
            {property.status}
          </Badge>
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-none font-semibold">
            {property.type}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white text-destructive",
            isFavorite && "bg-white"
          )}
          onClick={(e) => {
            e.preventDefault()
            setIsFavorite(!isFavorite)
          }}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </Button>
      </div>

      <Link href={`/property/${property.id}`}>
        <CardContent className="p-4">
          <h3 className="text-xl font-bold text-primary truncate">{property.price}</h3>
          <p className="text-sm font-medium text-foreground line-clamp-1 mt-1">{property.title}</p>
          <div className="flex items-center text-muted-foreground text-xs mt-2">
            <MapPin className="h-3 w-3 mr-1 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex items-center justify-between mt-4 py-3 border-t">
            <div className="flex items-center gap-1 text-sm font-medium">
              <Bed className="h-4 w-4 text-secondary" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Bath className="h-4 w-4 text-secondary" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Square className="h-4 w-4 text-secondary" />
              <span>{property.sqft} <span className="text-[10px] uppercase">sqft</span></span>
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold">
          Contact Agent
        </Button>
      </CardFooter>
    </Card>
  )
}
