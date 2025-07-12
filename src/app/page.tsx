import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />
      <Footer />
    </div>
  )
}