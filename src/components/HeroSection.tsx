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

      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 font-bold text-white spooky-font text-glow leading-tight">
          Indonesia<span className="text-red-500"> Urban Legends</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
          Discover the darkest corners of Indonesia through interactive maps,
          real stories, and spine-chilling experiences. Venture into the
          supernatural realm where legends come alive.
        </p>

        {/* CTA Button */}
        <div className="mb-8 sm:mb-12">
          <a href="/map">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white glow-red px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Explore Haunted Map
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-center">
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-4 sm:p-6 hover:border-red-500/40 transition-all duration-300">
            <div className="flex justify-center mb-3 sm:mb-4">
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-red-400 mb-2">
              Interactive Maps
            </div>
            <div className="text-gray-300 text-xs sm:text-sm">
              Explore haunted locations with Google Maps integration
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-4 sm:p-6 hover:border-red-500/40 transition-all duration-300">
            <div className="flex justify-center mb-3 sm:mb-4">
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-red-400 mb-2">
              Reviews & Ratings
            </div>
            <div className="text-gray-300 text-xs sm:text-sm">
              Share your experiences and rate haunted locations
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-red-900/20 rounded-lg p-4 sm:p-6 hover:border-red-500/40 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="flex justify-center mb-3 sm:mb-4">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-red-400 mb-2">
              Save Favorites
            </div>
            <div className="text-gray-300 text-xs sm:text-sm">
              Bookmark your favorite haunted places and access them anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
