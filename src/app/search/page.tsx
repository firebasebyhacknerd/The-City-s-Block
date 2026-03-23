
"use client"

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import PropertyCard from '@/components/property/PropertyCard'
import { PROPERTIES } from '@/app/lib/mock-data'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Search, SlidersHorizontal, MapPin } from 'lucide-react'

export default function SearchPage() {
  const [results, setResults] = useState(PROPERTIES)
  const [filterType, setFilterType] = useState('All')
  const [priceRange, setPriceRange] = useState([0, 3000000])

  const handleFilter = () => {
    let filtered = PROPERTIES
    if (filterType !== 'All') {
      filtered = filtered.filter(p => p.type === filterType)
    }
    filtered = filtered.filter(p => p.priceRaw <= priceRange[1])
    setResults(filtered)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="bg-white border-b sticky top-16 z-40 py-4 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 h-11" placeholder="Search by locality or project name" />
          </div>
          
          <div className="flex w-full md:w-auto gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px] h-11">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Studio">Studio</SelectItem>
                <SelectItem value="Penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleFilter} className="bg-primary hover:bg-primary/90 text-white h-11 px-6">
              Search
            </Button>
            
            <Button variant="outline" className="h-11 px-3">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Properties in Metro City</h1>
            <p className="text-muted-foreground text-sm">{results.length} blocks found matching your criteria</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort By:</span>
            <Select defaultValue="relevant">
              <SelectTrigger className="w-[160px] border-none font-semibold text-primary">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevant">Most Relevant</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden md:block col-span-1 space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold text-primary">Budget</h3>
              <div className="px-2 pt-6">
                <Slider 
                  defaultValue={[3000000]} 
                  max={5000000} 
                  step={50000} 
                  onValueChange={(val) => setPriceRange([0, val[0]])}
                />
                <div className="flex justify-between mt-4 text-xs font-bold text-primary">
                  <span>$0</span>
                  <span>Up to ${priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-bold text-primary">Configuration</h3>
              <div className="flex flex-wrap gap-2">
                {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'].map((bhk) => (
                  <Badge key={bhk} variant="outline" className="px-3 py-1 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                    {bhk}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-bold text-primary">Possession Status</h3>
              <div className="space-y-2">
                {['Ready to Move', 'Under Construction', 'New Launch'].map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <input type="checkbox" id={status} className="rounded border-muted text-primary focus:ring-primary" />
                    <label htmlFor={status} className="text-sm cursor-pointer">{status}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-secondary/10 rounded-xl border border-secondary/20">
              <h4 className="font-bold text-secondary text-sm mb-2">Block Insights</h4>
              <p className="text-xs text-muted-foreground">Property prices in this neighborhood have grown by 12% in the last 6 months.</p>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="col-span-1 md:col-span-3">
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold">No blocks found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or searching in a different area.</p>
                <Button variant="outline" className="mt-6" onClick={() => { setResults(PROPERTIES); setFilterType('All'); }}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
