import Header from "@/components/Header"
import MapSection from "@/components/MapSection"
import Footer from "@/components/Footer"

export default function MapPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-20">
        <MapSection />
      </div>
      <Footer />
    </div>
  )
}