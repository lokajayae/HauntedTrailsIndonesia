import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GoogleMap from "./GoogleMap";

export default function MapSection() {
  const bandungCenter = { lat: -6.9175, lng: 107.6191 };
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "Example";

  return (
    <section id="map" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 border-red-500/30 text-red-400 bg-red-950/20"
          >
            🗺️ Interactive Experience
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 spooky-font text-glow">
            Haunted Map of Indonesia
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Navigate through Indonesia&apos;s most spine-chilling locations.
            Click on markers to uncover dark histories, supernatural encounters,
            and local legends.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Google Maps */}
          <div className="lg:col-span-3">
            <Card className="bg-black/60 border-red-900/30 overflow-hidden">
              <CardContent className="p-0">
                <GoogleMap
                  apiKey={apiKey}
                  center={bandungCenter}
                  zoom={10}
                  className="h-96 lg:h-[500px] w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
