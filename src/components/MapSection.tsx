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
          <div className="lg:col-span-3">
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
        </div>
      </div>
    </section>
  )
}