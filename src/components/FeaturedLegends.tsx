import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skull, Eye, Clock, MapPin } from "lucide-react"

const legends = [
  {
    id: 1,
    title: "Kuntilanak",
    location: "Kalimantan",
    type: "Vengeful Spirit",
    description: "The vampiric spirit of a woman who died in childbirth, known for her long black hair and white dress.",
    danger: "High",
    lastSighting: "2 days ago"
  },
  {
    id: 2,
    title: "Pocong",
    location: "Java",
    type: "Undead",
    description: "Wrapped in white burial shrouds, these jumping ghosts are souls unable to move on to the afterlife.",
    danger: "Medium",
    lastSighting: "1 week ago"
  },
  {
    id: 3,
    title: "Leak",
    location: "Bali",
    type: "Black Magic",
    description: "Shape-shifting witches that can detach their heads and fly around at night seeking victims.",
    danger: "Extreme",
    lastSighting: "3 days ago"
  }
]

export default function FeaturedLegends() {
  return (
    <section id="legends" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-red-500/30 text-red-400 bg-red-950/20">
            👻 Most Feared
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 spooky-font text-glow">
            Featured Urban Legends
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the most terrifying supernatural entities that have haunted Indonesia for generations. 
            Each with their own dark history and spine-chilling encounters.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {legends.map((legend) => (
            <Card key={legend.id} className="bg-black/60 border-red-900/30 hover:border-red-700/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant={legend.danger === "Extreme" ? "destructive" : legend.danger === "High" ? "outline" : "secondary"}
                    className={
                      legend.danger === "Extreme" 
                        ? "border-red-600 text-red-400 bg-red-950/30" 
                        : legend.danger === "High"
                        ? "border-orange-500 text-orange-400 bg-orange-950/30"
                        : "border-yellow-500 text-yellow-400 bg-yellow-950/30"
                    }
                  >
                    {legend.danger} Threat
                  </Badge>
                  <Skull className="w-5 h-5 text-red-500 group-hover:animate-pulse" />
                </div>
                <CardTitle className="text-white text-xl group-hover:text-red-400 transition-colors">
                  {legend.title}
                </CardTitle>
                <CardDescription className="text-gray-400 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {legend.location} • {legend.type}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  {legend.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    Last seen: {legend.lastSighting}
                  </div>
                  <div className="flex items-center text-xs text-red-400">
                    <Eye className="w-3 h-3 mr-1" />
                    Active
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-950/20"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white glow-red px-8"
          >
            <Skull className="w-5 h-5 mr-2" />
            Explore All Legends
          </Button>
        </div>
      </div>
    </section>
  )
}