import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

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

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <Badge
          variant="outline"
          className="mb-6 border-red-500/30 text-red-400 bg-red-950/20"
        >
          🇮🇩 Explore Indonesia&apos;s Dark Side
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 horror-font text-glow">
          <span className="text-white">Haunted</span>
          <span className="text-red-500">Trails</span>
          <br />
          <span className="text-gray-300 text-4xl md:text-5xl">Indonesia</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          Discover the most{" "}
          <span className="text-red-400 font-semibold">
            terrifying urban legends
          </span>{" "}
          and
          <span className="text-red-400 font-semibold">
            {" "}
            haunted places
          </span>{" "}
          across the Indonesian archipelago. From ancient curses to modern ghost
          stories.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
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
  );
}
