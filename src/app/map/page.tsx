import FullMapView from "@/components/FullMapView";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MapPage() {
  return (
    <ProtectedRoute>
      <div className="h-screen bg-black text-white overflow-hidden">
        <FullMapView />
      </div>
    </ProtectedRoute>
  );
}
