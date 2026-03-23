
"use client"

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import { PROPERTIES } from '@/app/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Bed, Bath, Square, MapPin, CheckCircle2, Phone, Mail, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { toast } = useToast()
  const property = PROPERTIES.find(p => p.id === id) || PROPERTIES[0]

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Inquiry Sent!",
      description: `Your message has been sent to ${property.agent.name}.`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-primary/90 text-white text-md px-4 py-1">{property.status}</Badge>
                <Badge className="bg-secondary/90 text-white text-md px-4 py-1">{property.type}</Badge>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary">{property.title}</h1>
                <div className="flex items-center text-muted-foreground mt-2">
                  <MapPin className="h-5 w-5 mr-1 text-secondary" />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="text-4xl font-black text-secondary">{property.price}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-y">
              <div className="flex flex-col items-center text-center">
                <Bed className="h-8 w-8 text-primary mb-2" />
                <span className="text-xl font-bold">{property.bedrooms}</span>
                <span className="text-xs text-muted-foreground uppercase">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Bath className="h-8 w-8 text-primary mb-2" />
                <span className="text-xl font-bold">{property.bathrooms}</span>
                <span className="text-xs text-muted-foreground uppercase">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Square className="h-8 w-8 text-primary mb-2" />
                <span className="text-xl font-bold">{property.sqft}</span>
                <span className="text-xs text-muted-foreground uppercase">Sq Ft</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Overview</h2>
              <p className="text-foreground leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Key Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm border">
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Inquiry Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="shadow-lg border-primary/10">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-lg">Inquire About This Block</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-secondary">
                      <Image
                        src={property.agent.image}
                        alt={property.agent.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold">{property.agent.name}</div>
                      <div className="text-xs text-muted-foreground">Certified Block Specialist</div>
                    </div>
                  </div>

                  <form onSubmit={handleInquiry} className="space-y-4">
                    <Input placeholder="Your Name" required />
                    <Input type="email" placeholder="Your Email" required />
                    <Input placeholder="Your Phone Number" required />
                    <Textarea 
                      placeholder="I'm interested in this property..." 
                      className="min-h-[100px]"
                      defaultValue={`Hi ${property.agent.name}, I'm interested in ${property.title}. Please provide more details.`}
                    />
                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-12">
                      Send Inquiry
                    </Button>
                  </form>

                  <div className="mt-6 pt-6 border-t flex flex-col gap-3">
                    <Button variant="outline" className="w-full gap-2 border-secondary text-secondary hover:bg-secondary hover:text-white">
                      <Phone className="h-4 w-4" />
                      {property.agent.phone}
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Mail className="h-4 w-4" />
                      Email Agent
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-xl">
                <div className="flex items-center gap-2 text-secondary font-bold mb-2">
                  <User className="h-4 w-4" />
                  Block Protection
                </div>
                <p className="text-xs text-muted-foreground">
                  Our Blocks Verification System ensures every detail in this listing is accurate and the agent is certified.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
