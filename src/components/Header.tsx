import { Button } from "@/components/ui/button"
import { Ghost, Moon, Sun } from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-red-900/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Ghost className="w-8 h-8 text-red-500" />
          <h1 className="text-2xl font-bold text-white spooky-font text-glow">
            HauntedTrails<span className="text-red-500">Indonesia</span>
          </h1>
        </Link>
        
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-red-400">
          <Moon className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}