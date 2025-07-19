declare namespace google.maps {
  class Map {
    constructor(mapDiv: HTMLElement, opts?: MapOptions);
    setCenter(latLng: LatLngLiteral): void;
    setZoom(zoom: number): void;
    setOptions(options: MapOptions): void;
  }

  class Marker {
    constructor(opts?: MarkerOptions);
    addListener(eventName: string, handler: () => void): void;
    setMap(map: Map | null): void;
    setPosition(latLng: LatLngLiteral): void;
  }

  class StreetViewPanorama {
    constructor(container: HTMLElement, opts?: StreetViewPanoramaOptions);
    addListener(eventName: string, handler: () => void): void;
    getStatus(): string;
    setPosition(latLng: LatLngLiteral): void;
    setPov(pov: StreetViewPov): void;
  }

  class Size {
    constructor(
      width: number,
      height: number,
      widthUnit?: string,
      heightUnit?: string
    );
    width: number;
    height: number;
    equals(other: Size): boolean;
    toString(): string;
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    styles?: MapTypeStyle[];
    mapTypeId?: MapTypeId;
    streetViewControl?: boolean;
    mapTypeControl?: boolean;
    fullscreenControl?: boolean;
    clickableIcons?: boolean;
  }

  interface MarkerOptions {
    position?: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: Icon | string;
  }

  interface StreetViewPanoramaOptions {
    position?: LatLng | LatLngLiteral;
    pov?: StreetViewPov;
    zoom?: number;
    styles?: MapTypeStyle[];
    clickToGo?: boolean;
    linksControl?: boolean;
    panControl?: boolean;
    zoomControl?: boolean;
    addressControl?: boolean;
    fullscreenControl?: boolean;
    motionTracking?: boolean;
    motionTrackingControl?: boolean;
    enableCloseButton?: boolean;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface Icon {
    url: string;
    scaledSize: Size;
  }

  interface StreetViewPov {
    heading: number;
    pitch: number;
  }

  interface MapTypeStyle {
    elementType?: string;
    featureType?: string;
    stylers?: MapTypeStyler[];
  }

  interface MapTypeStyler {
    color?: string;
    visibility?: string;
  }

  enum MapTypeId {
    ROADMAP = "roadmap",
    SATELLITE = "satellite",
    HYBRID = "hybrid",
    TERRAIN = "terrain",
  }
}
