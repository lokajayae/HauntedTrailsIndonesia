'use client'

import { useEffect, useRef, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { HauntedLocation } from '@/types/location'

interface GoogleMapProps {
  apiKey: string
  center: { lat: number; lng: number }
  zoom: number
  className?: string
}

export default function GoogleMap({ apiKey, center, zoom, className }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const [locations, setLocations] = useState<HauntedLocation[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch locations from Firestore
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsCollection = collection(db, 'locations')
        const snapshot = await getDocs(locationsCollection)
        const fetchedLocations: HauntedLocation[] = []
        
        snapshot.forEach((doc) => {
          const data = doc.data()
          fetchedLocations.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            position: {
              latitude: data.position.latitude,
              longitude: data.position.longitude
            }
          })
        })
        
        setLocations(fetchedLocations)
      } catch (error) {
        console.error('Error fetching locations:', error)
        // Fallback to sample data if Firestore fails
        setLocations([
          {
            id: '1',
            name: 'Tanjakan Emen',
            description: 'Tanjakan Emen is an extremely steep road with supernatural activities reported by locals.',
            position: { latitude: -6.5716, longitude: 107.7587 }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  useEffect(() => {
    if (!apiKey || apiKey === 'Example' || loading) {
      console.warn('Google Maps API key not provided or is placeholder')
      return
    }

    const initMap = () => {
      if (!mapRef.current) return

      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [{"color": "#1d2c4d"}]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#8ec3b9"}]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#1a3646"}]
          },
          {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#4b6878"}]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#64779f"}]
          },
          {
            "featureType": "administrative.province",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#4b6878"}]
          },
          {
            "featureType": "landscape.man_made",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#334e87"}]
          },
          {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [{"color": "#023e58"}]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{"color": "#283d6a"}]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#6f9ba5"}]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#1d2c4d"}]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#023e58"}]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#3C7680"}]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{"color": "#304a7d"}]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#98a5be"}]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#1d2c4d"}]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{"color": "#2c6675"}]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#255763"}]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#b0d5ce"}]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#023e58"}]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#98a5be"}]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#1d2c4d"}]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#283d6a"}]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [{"color": "#3a4762"}]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#0e1626"}]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#4e6d70"}]
          }
        ]
      })

      // Add markers from Firestore data
      locations.forEach(location => {
        const marker = new google.maps.Marker({
          position: { 
            lat: location.position.latitude, 
            lng: location.position.longitude 
          },
          map: mapInstanceRef.current,
          title: location.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
                <text x="16" y="20" text-anchor="middle" fill="white" font-size="16">👻</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32)
          }
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="color: #000; padding: 8px;">
              <h3 style="margin: 0 0 8px 0; color: #dc2626;">${location.name}</h3>
              <p style="margin: 0; font-size: 14px;">${location.description}</p>
            </div>
          `
        })

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker)
        })
      })
    }

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`
      script.async = true
      script.defer = true
      
      // Make initMap globally available
      ;(window as any).initMap = initMap
      
      document.head.appendChild(script)
    } else {
      initMap()
    }

    return () => {
      // Cleanup if needed
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null
      }
    }
  }, [apiKey, center, zoom, locations, loading])

  if (!apiKey || apiKey === 'Example') {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900`}>
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-2">Google Maps API Key Required</h3>
          <p className="text-gray-400 text-sm">
            Please add your Google Maps API key to the .env.local file
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900`}>
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4 animate-pulse">👻</div>
          <p className="text-gray-400 text-sm">Loading haunted locations...</p>
        </div>
      </div>
    )
  }
  return <div ref={mapRef} className={className} />
}