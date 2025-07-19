"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HauntedLocation } from "@/types/location";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ghost, Search, MapPin, X } from "lucide-react";
import GoogleMap from "./GoogleMap";

export default function FullMapView() {
  const [locations, setLocations] = useState<HauntedLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<HauntedLocation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<HauntedLocation | null>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: -6.916053050082585,
    lng: 107.62049428187026,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "Example";

  // Fetch locations from Firestore
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsCollection = collection(db, "locations");
        const snapshot = await getDocs(locationsCollection);
        const fetchedLocations: HauntedLocation[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedLocations.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            position: {
              latitude: data.position.latitude,
              longitude: data.position.longitude,
            },
          });
        });

        setLocations(fetchedLocations);
        setFilteredLocations(fetchedLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
        // Fallback to sample data if Firestore fails
        const sampleLocations = [
          {
            id: "1",
            name: "Tanjakan Emen",
            description:
              "Tanjakan Emen is an extremely steep road with supernatural activities reported by locals.",
            position: { latitude: -6.5716, longitude: 107.7587 },
          },
          {
            id: "2",
            name: "Lawang Sewu",
            description:
              "A historic railway building in Semarang, known for its haunting stories and paranormal activities.",
            position: { latitude: -6.9667, longitude: 110.4167 },
          },
          {
            id: "3",
            name: "Rumah Kentang",
            description:
              "An abandoned house in Bandung with a dark history of mysterious disappearances.",
            position: { latitude: -6.9175, longitude: 107.6191 },
          },
        ];
        setLocations(sampleLocations);
        setFilteredLocations(sampleLocations);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Filter locations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchQuery, locations]);

  // Handle location selection
  const handleLocationSelect = (location: HauntedLocation) => {
    setSelectedLocation(location);
    setMapCenter({
      lat: location.position.latitude,
      lng: location.position.longitude,
    });
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-96" : "w-0"
        } transition-all duration-300 bg-gray-900 border-r border-red-900/30 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-red-900/30">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Ghost className="w-6 h-6 text-red-500" />
              <h1 className="text-xl font-bold text-white spooky-font">
                Haunted<span className="text-red-500">Trails</span>
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search haunted locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-red-900/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Results count */}
          <div className="mt-2 text-sm text-gray-400">
            {filteredLocations.length} location
            {filteredLocations.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {/* Locations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <p className="text-gray-400 text-sm">
                Loading haunted locations...
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredLocations.map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedLocation?.id === location.id
                      ? "bg-red-900/20 border-red-500"
                      : "bg-black/40 border-red-900/30 hover:bg-red-900/10 hover:border-red-500/50"
                  }`}
                  onClick={() => handleLocationSelect(location)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">👻</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm mb-1 truncate">
                          {location.name}
                        </h3>
                        <p className="text-gray-300 text-xs line-clamp-2">
                          {location.description}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-400">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>
                            {location.position.latitude.toFixed(4)},{" "}
                            {location.position.longitude.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredLocations.length === 0 && !loading && (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-4xl mb-2">🔍</div>
                  <p className="text-gray-400 text-sm">No locations found</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Try a different search term
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-red-900/30">
          <Badge
            variant="outline"
            className="w-full justify-center border-red-500/30 text-red-400 bg-red-950/20"
          >
            🇮🇩 Indonesia&apos;s Horror
          </Badge>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        {/* Toggle Sidebar Button */}
        {!sidebarOpen && (
          <Button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-10 bg-red-600 hover:bg-red-700 text-white"
            size="sm"
          >
            <Ghost className="w-4 h-4 mr-2" />
            Show Locations
          </Button>
        )}

        {/* Map */}
        <GoogleMap
          apiKey={apiKey}
          center={mapCenter}
          zoom={selectedLocation ? 15 : 11}
          selectedLocation={selectedLocation}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
