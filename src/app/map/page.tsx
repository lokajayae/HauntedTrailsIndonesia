import FullMapView from "@/components/FullMapView";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MapPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <FullMapView />
      </div>
    </ProtectedRoute>
  );
}
