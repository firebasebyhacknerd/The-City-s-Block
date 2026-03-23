
"use client"

import Navbar from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, MapPin, Building2, LayoutDashboard, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 space-y-6">
            <Card className="text-center pt-8 overflow-hidden">
              <CardContent className="space-y-4">
                <Avatar className="w-24 h-24 mx-auto border-4 border-secondary/20">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">James Doe</h2>
                  <p className="text-sm text-muted-foreground">Premium Block Member</p>
                </div>
                <div className="flex justify-center gap-2">
                  <Badge variant="secondary">Buyer</Badge>
                  <Badge variant="outline">Owner</Badge>
                </div>
              </CardContent>
              <div className="bg-muted p-4 flex flex-col gap-2">
                <Button variant="ghost" className="justify-start gap-2" asChild>
                  <Link href="#"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                </Button>
                <Button variant="ghost" className="justify-start gap-2" asChild>
                  <Link href="#"><Settings className="h-4 w-4" /> Settings</Link>
                </Button>
                <Button variant="ghost" className="justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" asChild>
                  <Link href="#"><LogOut className="h-4 w-4" /> Log Out</Link>
                </Button>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email Address</Label>
                    <div className="flex items-center gap-2 font-medium">
                      <Mail className="h-4 w-4 text-primary" />
                      james.doe@example.com
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Phone Number</Label>
                    <div className="flex items-center gap-2 font-medium">
                      <Phone className="h-4 w-4 text-primary" />
                      +1 555-098-1122
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Location</Label>
                    <div className="flex items-center gap-2 font-medium">
                      <MapPin className="h-4 w-4 text-primary" />
                      New York City, NY
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">Edit Profile</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Your Listed Blocks</CardTitle>
                <Button variant="link" asChild>
                  <Link href="/list-property">Post New</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl">
                  <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="font-bold">You haven't listed any blocks yet.</p>
                  <p className="text-sm text-muted-foreground">List your property to reach millions of urban seekers.</p>
                  <Button className="mt-6 bg-secondary text-white" asChild>
                    <Link href="/list-property">Post Property Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>
}
