import { Button } from "@/components/ui/button";
import { MapPin, Heart, MessageCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with spooky atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23dc2626%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="fog-effect absolute inset-0"></div>
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        {/* Main Title */}
        <h1 className="text-4xl md:text-7xl mb-6 font-bold text-white spooky-font text-glow">
          Indonesia<span className="text-red-500"> Urban Legends</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Discover the darkest corners of Indonesia through interactive maps,
          real stories, and spine-chilling experiences. Venture into the
          supernatural realm where legends come alive.
        </p>

        {/* CTA Button */}
        <div className="mb-12">
          <a href="/map">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white glow-red px-8 py-3 text-lg"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Explore Haunted Map
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-6 hover:border-red-500/40 transition-all duration-300">
            <div className="flex justify-center mb-4">
              <MapPin className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-xl font-bold text-red-400 mb-2">
              Interactive Maps
            </div>
            <div className="text-gray-300 text-sm">
              Explore haunted locations with Google Maps integration
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-6 hover:border-red-500/40 transition-all duration-300">
            <div className="flex justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-xl font-bold text-red-400 mb-2">
              Reviews & Ratings
            </div>
            <div className="text-gray-300 text-sm">
              Share your experiences and rate haunted locations
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-6 hover:border-red-500/40 transition-all duration-300">
            <div className="flex justify-center mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-xl font-bold text-red-400 mb-2">
              Save Favorites
            </div>
            <div className="text-gray-300 text-sm">
              Bookmark your favorite haunted places and access them anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
