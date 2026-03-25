
"use client"

import { useState } from 'react'
import { Sparkles, Loader2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { generatePropertyDescription } from '@/ai/flows/generate-property-description'
import { useToast } from '@/hooks/use-toast'

interface AIDescriptionToolProps {
  formData: {
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    location: string;
    price: string;
    sqft: number;
    amenities: string[];
    uniqueFeatures: string;
  };
  onApply: (description: string) => void;
}

export default function AIDescriptionTool({ formData, onApply }: AIDescriptionToolProps) {
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState('')
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!formData.propertyType || !formData.location || !formData.price) {
      toast({
        title: "A few essentials are missing",
        description: "Add the property type, location, and pricing first so the draft feels market-ready.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const result = await generatePropertyDescription({
        propertyType: formData.propertyType,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        squareFootage: formData.sqft,
        location: formData.location,
        price: formData.price,
        amenities: formData.amenities,
        uniqueFeatures: formData.uniqueFeatures,
      })
      setDescription(result.description)
    } catch (error) {
      toast({
        title: "Draft generation failed",
        description: "We could not prepare the listing copy this time. Try again after refining the details.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(description)
    toast({ title: "Listing copy copied" })
  }

  return (
    <Card className="border-2 border-secondary/30 bg-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-secondary">
          <Sparkles className="h-5 w-5" />
          AI Listing Copy Assistant
        </CardTitle>
        <CardDescription>
          Turn raw property details into polished, buyer-facing copy that sounds confident and credible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {description ? (
          <div className="space-y-4">
            <div className="relative group">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[150px] bg-background border-secondary/20"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDescription('')}
              >
                Start Over
              </Button>
              <Button
                className="flex-1 bg-secondary text-white"
                onClick={() => onApply(description)}
              >
                Use This Copy
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="w-full bg-secondary hover:bg-secondary/90 text-white"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Writing Copy...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Draft Listing Description
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
