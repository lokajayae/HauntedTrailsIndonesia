"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HauntedLocation } from "@/types/location";

// Extend Window interface to include Google Maps
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

interface GoogleMapProps {
  apiKey: string;
  center: { lat: number; lng: number };
  zoom: number;
  selectedLocation?: HauntedLocation | null;
  viewStreetViewTrigger?: number;
  className?: string;
}

export default function GoogleMap({
  apiKey,
  center,
  zoom,
  selectedLocation,
  viewStreetViewTrigger,
  className,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const streetViewInstanceRef = useRef<google.maps.StreetViewPanorama | null>(
    null
  );
  const [locations, setLocations] = useState<HauntedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStreetView, setShowStreetView] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<HauntedLocation | null>(null);

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
      } catch (error) {
        console.error("Error fetching locations:", error);
        // Fallback to sample data if Firestore fails
        setLocations([
          {
            id: "1",
            name: "Tanjakan Emen",
            description:
              "Tanjakan Emen is an extremely steep road with supernatural activities reported by locals.",
            position: { latitude: -6.5716, longitude: 107.7587 },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Initialize Street View when needed
  const initStreetView = useCallback((location: HauntedLocation) => {
    if (!streetViewRef.current) return;

    const position = {
      lat: location.position.latitude,
      lng: location.position.longitude,
    };

    streetViewInstanceRef.current = new google.maps.StreetViewPanorama(
      streetViewRef.current,
      {
        position: position,
        pov: {
          heading: 0,
          pitch: 0,
        },
        zoom: 1,
        // Disable all navigation controls and arrows
        clickToGo: false,
        linksControl: false,
        panControl: false,
        zoomControl: false,
        addressControl: false,
        fullscreenControl: false,
        motionTracking: false,
        motionTrackingControl: false,
        enableCloseButton: false,
        // Apply spooky styling to Street View
        styles: [
          {
            elementType: "geometry",
            stylers: [{ color: "#1d2c4d" }],
          },
          {
            elementType: "labels.text.fill",
            stylers: [{ color: "#8ec3b9" }],
          },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#1a3646" }],
          },
        ],
      }
    );

    // Handle Street View status
    streetViewInstanceRef.current.addListener("status_changed", () => {
      if (streetViewInstanceRef.current?.getStatus() === "ZERO_RESULTS") {
        console.warn("Street View not available for this location");
        // Could show a message or fallback to satellite view
      }
    });
  }, []);

  // Close Street View and return to map
  const closeStreetView = useCallback(() => {
    setShowStreetView(false);
    setCurrentLocation(null);
    if (streetViewInstanceRef.current) {
      streetViewInstanceRef.current = null;
    }
  }, []);

  // Open Street View for a location
  const openStreetView = useCallback(
    (location: HauntedLocation) => {
      setCurrentLocation(location);
      setShowStreetView(true);

      // Initialize Street View after state update
      setTimeout(() => {
        initStreetView(location);
      }, 100);
    },
    [initStreetView]
  );

  // Update map center and zoom when props change
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [center, zoom]);

  // Handle selectedLocation changes - update street view if currently open
  useEffect(() => {
    if (selectedLocation && showStreetView) {
      // If street view is open and we have a new selected location, update it
      setCurrentLocation(selectedLocation);
      setTimeout(() => {
        initStreetView(selectedLocation);
      }, 100);
    }
  }, [selectedLocation, showStreetView, initStreetView]);

  // Handle selectedLocation changes from sidebar
  useEffect(() => {
    if (selectedLocation && showStreetView) {
      // If Street View is open and a new location is selected from sidebar,
      // update the Street View to show the new location
      setCurrentLocation(selectedLocation);
      // Small delay to ensure smooth transition
      setTimeout(() => {
        initStreetView(selectedLocation);
      }, 150);
    }
  }, [selectedLocation, showStreetView, initStreetView]);

  // Handle View button from LocationDetails
  useEffect(() => {
    if (
      selectedLocation &&
      viewStreetViewTrigger &&
      viewStreetViewTrigger > 0
    ) {
      // Trigger Street View when the View button is clicked
      openStreetView(selectedLocation);
    }
  }, [viewStreetViewTrigger, selectedLocation, openStreetView]);

  useEffect(() => {
    if (!apiKey || apiKey === "Example" || loading) {
      console.warn("Google Maps API key not provided or is placeholder");
      return;
    }

    const initMap = () => {
      if (!mapRef.current) return;

      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP, // Changed from SATELLITE to ROADMAP to show labels
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        clickableIcons: false, // Disable clicking on default POI markers
        styles: [
          // Base map styling with spooky theme
          {
            elementType: "geometry",
            stylers: [{ color: "#1d2c4d" }],
          },
          // Make labels more visible with better colors
          {
            elementType: "labels.text.fill",
            stylers: [{ color: "#ffffff" }], // White text for better visibility
          },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#000000" }], // Black outline for contrast
          },
          // Ensure city names are visible
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#ffcc00" }], // Gold color for cities
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#000000" }],
          },
          // Make road labels visible
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#cccccc" }], // Light gray for roads
          },
          {
            featureType: "road",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#000000" }],
          },
          {
            featureType: "administrative.country",
            elementType: "geometry.stroke",
            stylers: [{ color: "#4b6878" }],
          },
          {
            featureType: "administrative.land_parcel",
            elementType: "labels.text.fill",
            stylers: [{ color: "#64779f" }],
          },
          {
            featureType: "administrative.province",
            elementType: "geometry.stroke",
            stylers: [{ color: "#4b6878" }],
          },
          {
            featureType: "landscape.man_made",
            elementType: "geometry.stroke",
            stylers: [{ color: "#334e87" }],
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{ color: "#023e58" }],
          },
          // Hide all POI elements (businesses, attractions, etc.)
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.attraction",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.government",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.medical",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.place_of_worship",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.school",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.sports_complex",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [{ color: "#023e58" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#3C7680" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#304a7d" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#98a5be" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#1d2c4d" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#2c6675" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#255763" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#b0d5ce" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#023e58" }],
          },
          {
            featureType: "transit",
            elementType: "labels.text.fill",
            stylers: [{ color: "#98a5be" }],
          },
          {
            featureType: "transit",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#1d2c4d" }],
          },
          {
            featureType: "transit.line",
            elementType: "geometry.fill",
            stylers: [{ color: "#283d6a" }],
          },
          {
            featureType: "transit.station",
            elementType: "geometry",
            stylers: [{ color: "#3a4762" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#0e1626" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#4e6d70" }],
          },
        ],
      });

      // Add markers from Firestore data
      locations.forEach((location) => {
        const marker = new google.maps.Marker({
          position: {
            lat: location.position.latitude,
            lng: location.position.longitude,
          },
          map: mapInstanceRef.current || undefined,
          title: location.name,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
          },
        });

        // Updated marker click handler to open Street View
        marker.addListener("click", () => {
          openStreetView(location);
        });
      });
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=initMap`;
      script.async = true;
      script.defer = true;

      // Make initMap globally available
      window.initMap = initMap;

      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      // Cleanup if needed
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [apiKey, center, zoom, locations, loading, openStreetView]);

  if (!apiKey || apiKey === "Example") {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900`}
      >
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Google Maps API Key Required
          </h3>
          <p className="text-gray-400 text-sm">
            Please add your Google Maps API key to the .env.local file
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900`}
      >
        <div className="text-center">
          <p className="text-gray-400 text-sm">Loading haunted locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {/* Main Map View */}
      <div
        ref={mapRef}
        className={`w-full h-full transition-opacity duration-300 ${
          showStreetView ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />

      {/* Street View Overlay */}
      {showStreetView && (
        <div className="absolute inset-0 bg-black">
          {/* Street View Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/90 to-black/60 p-4">
            <div className="flex items-center justify-between gap-1">
              <div className="text-white">
                <h3 className="text-xl font-bold text-red-400 mb-1">
                  {currentLocation?.name}
                </h3>
                <p className="text-sm text-gray-300">
                  {currentLocation?.description}
                </p>
              </div>
              <button
                onClick={closeStreetView}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-lg"
              >
                <span>×</span>
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Street View Container */}
          <div ref={streetViewRef} className="w-full h-full" />

          {/* Street View Loading State */}
          {!streetViewInstanceRef.current && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Loading Street View...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
