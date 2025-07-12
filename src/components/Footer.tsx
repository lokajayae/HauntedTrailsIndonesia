import { Ghost, MapPin, Skull, Eye } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-red-900/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Ghost className="w-8 h-8 text-red-500" />
              <h3 className="text-2xl font-bold text-white spooky-font">
                HauntedTrails<span className="text-red-500">Indonesia</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Exploring Indonesia's supernatural heritage through urban legends, ghost stories, 
              and haunted locations across the archipelago.
            </p>
            <div className="text-sm text-gray-500">
              ⚠️ Content may be disturbing. Viewer discretion advised.
            </div>
          </div>
          
          <div></div>
          <div></div>
        </div>
        
        <div className="border-t border-red-900/20 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 HauntedTrailsIndonesia. All rights reserved. 
            <span className="text-red-500 ml-2">Enter at your own risk.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}