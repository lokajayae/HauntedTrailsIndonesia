import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Skull, Eye } from "lucide-react"

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with spooky atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23dc2626" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="fog-effect absolute inset-0"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-bounce-slow">
        <Skull className="w-8 h-8 text-red-500/30" />
      </div>
      <div className="absolute top-40 right-20 animate-pulse">
        <Eye className="w-6 h-6 text-red-400/40" />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce-slow">
        <MapPin className="w-7 h-7 text-red-600/30" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <Badge variant="outline" className="mb-6 border-red-500/30 text-red-400 bg-red-950/20">
          🇮🇩 Explore Indonesia's Dark Side
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 horror-font text-glow">
          <span className="text-white">Haunted</span>
          <span className="text-red-500">Trails</span>
          <br />
          <span className="text-gray-300 text-4xl md:text-5xl">Indonesia</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          Discover the most <span className="text-red-400 font-semibold">terrifying urban legends</span> and 
          <span className="text-red-400 font-semibold"> haunted places</span> across the Indonesian archipelago. 
          From ancient curses to modern ghost stories.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white glow-red px-8 py-3 text-lg"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Explore Haunted Map
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-red-500/50 text-red-400 hover:bg-red-950/20 px-8 py-3 text-lg"
          >
            <Skull className="w-5 h-5 mr-2" />
            Read Ghost Stories
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-red-500 mb-2">100+</div>
            <div className="text-gray-300">Haunted Locations</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-red-500 mb-2">34</div>
            <div className="text-gray-300">Provinces Covered</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-6">
            <div className="text-3xl font-bold text-red-500 mb-2">500+</div>
            <div className="text-gray-300">Urban Legends</div>
          </div>
        </div>
      </div>
    </section>
  )
  )
}