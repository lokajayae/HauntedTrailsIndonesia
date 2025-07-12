import { Button } from "@/components/ui/button"
import { Ghost, Menu, Moon } from "lucide-react"

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-red-900/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Ghost className="w-8 h-8 text-red-500" />
          <h1 className="text-2xl font-bold text-white spooky-font text-glow">
            HauntedTrails<span className="text-red-500">Indonesia</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#home" className="text-gray-300 hover:text-red-400 transition-colors">
            Home
          </a>
          <a href="#legends" className="text-gray-300 hover:text-red-400 transition-colors">
            Legends
          </a>
          <a href="#map" className="text-gray-300 hover:text-red-400 transition-colors">
            Map
          </a>
          <a href="#stories" className="text-gray-300 hover:text-red-400 transition-colors">
            Stories
          </a>
        </nav>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-red-400">
            <Moon className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-gray-300 hover:text-red-400">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}