import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'motion/react'
import { HoverBorderGradient } from '@/components/aceternity/HoverBorderGradient'
import type { RoomSummaryDTO } from '@/types/api'

export function RoomCard({ room }: { room: RoomSummaryDTO }) {
  return (
    <Link to={`/rooms/${room.id}`} className="block">
      <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}>
        <HoverBorderGradient containerClassName="h-full" className="h-full">
          <Card className="overflow-hidden transition-shadow hover:shadow-lg">
          <div className="relative h-44 w-full overflow-hidden">
            {room.image ? (
              <img
                src={room.image}
                alt={room.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                Sin imagen
              </div>
            )}
            <Badge className="absolute right-3 top-3 bg-white/90 text-foreground shadow-sm backdrop-blur-sm dark:bg-card/90">
              S/ {room.price}
            </Badge>
          </div>
          <CardHeader className="pb-2">
            <h3 className="line-clamp-1 font-semibold text-foreground">{room.title}</h3>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{room.district ?? 'Sin distrito'}</span>
            </div>
            {room.universityName && <p className="truncate">{room.universityName}</p>}
            {room.distanceKm != null && <p>{room.distanceKm.toFixed(1)} km</p>}
          </CardContent>
        </Card>
        </HoverBorderGradient>
      </motion.div>
    </Link>
  )
}