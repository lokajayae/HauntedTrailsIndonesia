import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Zap, Clock } from "lucide-react"

export default function MapSection() {
  return (
    <section id="map" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-red-500/30 text-red-400 bg-red-950/20">
            🗺️ Interactive Experience
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 spooky-font text-glow">
            Haunted Map of Indonesia
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Navigate through Indonesia's most spine-chilling locations. Click on markers to uncover 
            dark histories, supernatural encounters, and local legends.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <Card className="bg-black/60 border-red-900/30 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  {/* Placeholder for Google Maps */}
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-2xl font-bold text-white mb-2">Google Maps Integration</h3>
                    <p className="text-gray-400 mb-4">Interactive map will be loaded here</p>
                    <Badge variant="outline" className="border-red-500/50 text-red-400">
                      Coming Soon
                    </Badge>
                  </div>
                  
                  {/* Simulated map markers */}
                  <div className="absolute top-20 left-20 animate-pulse">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg glow-red"></div>
                  </div>
                  <div className="absolute top-32 right-32 animate-pulse delay-300">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg glow-red"></div>
                  </div>
                  <div className="absolute bottom-24 left-32 animate-pulse delay-700">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg glow-red"></div>
                  </div>
                  <div className="absolute bottom-32 right-20 animate-pulse delay-500">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg glow-red"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Map Features */}
          <div className="space-y-6">
            <Card className="bg-black/60 border-red-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Navigation className="w-5 h-5 text-red-500 mr-2" />
                  Map Features
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Explore supernatural Indonesia with advanced tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300">Haunted location markers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-300">Urban legend hotspots</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300">Historical sites</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">User submissions</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/60 border-red-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 text-red-500 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-950/20">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Nearest Haunted Site
                </Button>
                <Button variant="outline" className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-950/20">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Sightings
                </Button>
              </CardContent>
            </Card>
            
            {/* Featured Location */}
            <Card className="bg-gradient-to-br from-red-950/40 to-black/60 border-red-900/50">
              <CardHeader>
                <Badge variant="destructive" className="w-fit mb-2">Featured</Badge>
                <CardTitle className="text-white">Lawang Sewu</CardTitle>
                <CardDescription className="text-gray-400">
                  Semarang, Central Java
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  The thousand-door building with countless ghost stories and supernatural encounters.
                </p>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Explore Location
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}