"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HauntedLocation } from "@/types/location";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Ghost,
  Search,
  MapPin,
  X,
  LogOut,
  Skull,
  Heart,
  User,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import GoogleMap from "./GoogleMap";
import LocationDetails from "./LocationDetails";
import Link from "next/link";
import Image from "next/image";

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
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedLocationIds, setSavedLocationIds] = useState<string[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [viewStreetViewTrigger, setViewStreetViewTrigger] = useState(0);

  const { user, logOut } = useAuth();
  const router = useRouter();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showUserMenu) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showUserMenu]);

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
            averageRating: data.averageRating,
            totalReviews: data.totalReviews,
            totalSaves: data.totalSaves,
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

  // Fetch user's saved locations
  useEffect(() => {
    const fetchSavedLocations = async () => {
      if (!user) {
        setSavedLocationIds([]);
        return;
      }

      try {
        const savesQuery = query(
          collection(db, "userSaves"),
          where("userId", "==", user.uid)
        );
        const savesSnapshot = await getDocs(savesQuery);
        const savedIds: string[] = [];

        savesSnapshot.forEach((doc) => {
          const data = doc.data();
          savedIds.push(data.locationId);
        });

        setSavedLocationIds(savedIds);
      } catch (error) {
        console.error("Error fetching saved locations:", error);
      }
    };

    fetchSavedLocations();
  }, [user]);

  // Filter locations based on search query and saved filter
  useEffect(() => {
    let filtered = locations;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply saved filter
    if (showSavedOnly) {
      filtered = filtered.filter((location) =>
        savedLocationIds.includes(location.id)
      );
    }

    setFilteredLocations(filtered);
  }, [searchQuery, locations, showSavedOnly, savedLocationIds]);

  // Handle location selection
  const handleLocationSelect = (location: HauntedLocation) => {
    setSelectedLocation(location);
    setMapCenter({
      lat: location.position.latitude,
      lng: location.position.longitude,
    });
    setShowLocationDetails(true);
  };

  // Handle back from location details
  const handleBackToList = () => {
    setShowLocationDetails(false);
    setSelectedLocation(null);
  };

  // Handle Street View from location details
  const handleViewStreetView = (location: HauntedLocation) => {
    setSelectedLocation(location);
    setMapCenter({
      lat: location.position.latitude,
      lng: location.position.longitude,
    });
    // Trigger Street View by incrementing the trigger counter
    setViewStreetViewTrigger((prev) => prev + 1);
  };

  // Handle logout
  const handleLogOut = async () => {
    try {
      await logOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Render skull rating display
  const renderSkulls = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((skull) => (
          <Skull
            key={skull}
            className={`w-3 h-3 ${
              skull <= rating ? "text-red-500 fill-red-50" : "text-gray-400"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-96" : "w-0"
        } transition-all duration-300 bg-gray-900 border-r border-red-900/30 overflow-hidden flex flex-col`}
      >
        {/* Header - Only show when not showing location details */}
        {!showLocationDetails && (
          <div className="p-4 border-b border-red-900/30">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <Ghost className="w-6 h-6 text-red-500" />
                <h1 className="text-xl font-bold text-white spooky-font">
                  Haunted<span className="text-red-500">Trails</span>
                </h1>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2 mb-4">
              <Button
                variant={!showSavedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowSavedOnly(false)}
                className={`flex-1 text-xs ${
                  !showSavedOnly
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "border-red-500/30 text-red-400 bg-red-950/20 hover:bg-red-900/30"
                }`}
              >
                <MapPin className="w-3 h-3 mr-1" />
                All Locations
              </Button>
              {user && (
                <Button
                  variant={showSavedOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowSavedOnly(true)}
                  className={`flex-1 text-xs ${
                    showSavedOnly
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "border-red-500/30 text-red-400 bg-red-950/20 hover:bg-red-900/30"
                  }`}
                >
                  <Heart className="w-3 h-3 mr-1" />
                  Saved ({savedLocationIds.length})
                </Button>
              )}
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
        )}

        {/* Locations List or Location Details */}
        <div className="flex-1 overflow-hidden">
          {showLocationDetails && selectedLocation ? (
            <LocationDetails
              location={selectedLocation}
              onBack={handleBackToList}
              onViewStreetView={handleViewStreetView}
            />
          ) : (
            <div className="h-full overflow-y-auto">
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
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 relative">
                            <span className="text-white text-sm">👻</span>
                            {savedLocationIds.includes(location.id) && (
                              <Heart className="absolute -top-1 -right-1 w-3 h-3 text-red-400 fill-red-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm mb-1 truncate">
                              {location.name}
                            </h3>
                            <p className="text-gray-300 text-xs line-clamp-2">
                              {location.description}
                            </p>

                            {/* Rating display */}
                            {location.averageRating && (
                              <div className="flex items-center mt-1 space-x-1">
                                {renderSkulls(
                                  Math.round(location.averageRating)
                                )}
                                <span className="text-xs text-gray-400">
                                  {location.averageRating.toFixed(1)} (
                                  {location.totalReviews || 0})
                                </span>
                              </div>
                            )}

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
                      <div className="text-gray-500 text-4xl mb-2">
                        {showSavedOnly ? "💔" : "🔍"}
                      </div>
                      <p className="text-gray-400 text-sm">
                        {showSavedOnly
                          ? "No saved locations"
                          : "No locations found"}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {showSavedOnly
                          ? "Start exploring and save your favorites!"
                          : "Try a different search term"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - User Profile */}
        {user && !showLocationDetails && (
          <div className="p-4 border-t border-red-900/30">
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full justify-start border-red-500/30 text-red-400 bg-red-950/20 hover:bg-red-900/30 hover:border-red-400 hover:text-red-400"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full border border-red-500/50"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <span className="text-sm truncate">
                    {user.displayName || user.email}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div
                  className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-red-900/30 rounded-lg p-2 z-50 shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUserMenu(false);
                      handleLogOut();
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-400 hover:bg-red-900/30 hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
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
          viewStreetViewTrigger={viewStreetViewTrigger}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
