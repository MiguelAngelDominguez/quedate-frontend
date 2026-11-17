'use client'

import { MapPin, ShieldCheck, Home, Clock, MapPin as MapPinIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type RoomDetailDTO } from '@/types/api'

interface RoomInfoCardProps {
  room: RoomDetailDTO
}

export function RoomInfoCard({ room }: RoomInfoCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{room.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <MapPin className="h-4 w-4" />
          <span>{room.district}</span>
          {room.universityName && (
            <span className="mx-1 text-xs text-primary font-medium">
              {room.universityName}
            </span>
          )}
          {room.distanceKm != null && (
            <span className="mx-1">{room.distanceKm.toFixed(1)} km</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{room.capacity ?? '-'} personas</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{room.sizeM2 ?? '-'} m²</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{room.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {room.isVerified ? 'Verificado' : 'No verificado'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">S/ {room.price}</span>
            <span className="text-sm text-muted-foreground">/ mes</span>
          </div>
          <Badge variant={room.isVerified ? 'default' : 'secondary'}>
            {room.isVerified ? 'Arrendador verificado' : 'No verificado'}
          </Badge>
        </div>

        {room.description && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {room.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}