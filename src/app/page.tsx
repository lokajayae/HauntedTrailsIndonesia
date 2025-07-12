import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import FeaturedLegends from "@/components/FeaturedLegends"
import MapSection from "@/components/MapSection"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <HeroSection />
      <FeaturedLegends />
      <MapSection />
      <Footer />
    </div>
  )
}