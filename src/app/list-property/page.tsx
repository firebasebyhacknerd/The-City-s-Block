
"use client"

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import AIDescriptionTool from '@/components/property/AIDescriptionTool'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Building2, MapPin, DollarSign, ImagePlus, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

const AMENITY_OPTIONS = [
  "Gym", "Swimming Pool", "Parking", "Elevator", "Power Backup", 
  "Security", "Garden", "Club House", "Kids Play Area", "Smart Home"
]

export default function ListPropertyPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    propertyType: 'Apartment',
    status: 'For Sale',
    bedrooms: 1,
    bathrooms: 1,
    location: '',
    price: '',
    sqft: 0,
    amenities: [] as string[],
    uniqueFeatures: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Property Listed!",
      description: "Your block is now live on the marketplace.",
    })
    router.push('/')
  }

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) 
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-primary">Post Your Block</h1>
          <p className="text-muted-foreground mt-2">Reach thousands of potential buyers in your neighborhood.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-secondary" />
                  Basic Property Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Property Type</Label>
                    <Select value={formData.propertyType} onValueChange={(val) => setFormData({...formData, propertyType: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="House">Independent House</SelectItem>
                        <SelectItem value="Studio">Studio Loft</SelectItem>
                        <SelectItem value="Penthouse">Penthouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Listing For</Label>
                    <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="For Sale">Sale</SelectItem>
                        <SelectItem value="For Rent">Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Input type="number" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Input type="number" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Square Footage</Label>
                    <Input type="number" placeholder="e.g. 1200" onChange={(e) => setFormData({...formData, sqft: parseInt(e.target.value)})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Neighborhood / Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      placeholder="Enter street or neighborhood name" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Asking Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      placeholder="e.g. $850,000" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  Amenities & Unique Features
                </CardTitle>
                <CardDescription>Select the highlights of your block.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox 
                        id={amenity} 
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <label htmlFor={amenity} className="text-sm font-medium leading-none cursor-pointer">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Any Unique Selling Points?</Label>
                  <Textarea 
                    placeholder="e.g. Recently renovated kitchen, private terrace, near metro station..." 
                    value={formData.uniqueFeatures}
                    onChange={(e) => setFormData({...formData, uniqueFeatures: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Photos (Mock) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ImagePlus className="h-5 w-5 text-secondary" />
                  Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-xl p-12 text-center hover:bg-muted/50 cursor-pointer transition-colors">
                  <ImagePlus className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium">Upload photos of your property</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG or JPEG up to 10MB</p>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-xl">
              Publish Listing
            </Button>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* AI Generator Side Panel */}
            <AIDescriptionTool 
              formData={formData} 
              onApply={(desc) => setFormData({...formData, description: desc})} 
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">Property Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  className="min-h-[250px]" 
                  placeholder="The public will see this description..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </CardContent>
            </Card>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="font-bold text-sm text-primary mb-2">Need Help?</h4>
              <p className="text-xs text-muted-foreground">Our block concierge team is available 24/7 to help you optimize your listing for maximum visibility.</p>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
