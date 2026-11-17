import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { catalogService } from '@/services/catalog.service'
import { trustService } from '@/services/trust.service'
import { getErrorMessage } from '@/services/api'
import type { RoomDetailDTO, ReviewResponseDTO } from '@/types/api'
import { RoomGallery } from '@/components/rooms/RoomGallery'
import { RoomInfoCard } from '@/components/rooms/RoomInfoCard'
import { RoomReviews } from '@/components/rooms/RoomReviews'
import { RoomRequestForm } from '@/components/rooms/RoomRequestForm'
import { RoomReviewForm } from '@/components/rooms/RoomReviewForm'

export default function RoomDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const roomId = Number(id)
  const [room, setRoom] = useState<RoomDetailDTO | null>(null)
  const [reviews, setReviews] = useState<ReviewResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!roomId) return
    const controller = new AbortController()
    setLoading(true)
    Promise.all([
      catalogService.room(roomId, { signal: controller.signal }),
      trustService.listReviews(roomId, { signal: controller.signal }),
    ])
      .then(([r, rv]) => {
        if (controller.signal.aborted) return
        setRoom(r)
        setReviews(rv)
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(getErrorMessage(e))
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [roomId])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Home className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{error || 'No encontrado'}</h2>
          <Button onClick={() => navigate('/rooms')} variant="outline">
            Volver a buscar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/rooms">Habitaciones</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{room.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Button variant="outline" onClick={() => navigate('/rooms')} className="mb-4">
        ← Volver a búsqueda
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Gallery */}
        <div className="lg:col-span-2">
          <RoomGallery images={room.images ?? []} roomTitle={room.title} />
        </div>

        {/* Right column: Info + Forms */}
        <div className="lg:col-1 space-y-6">
          <RoomInfoCard room={room} />

          <div className="space-y-4">
            <RoomRequestForm roomId={roomId} />
            <RoomReviewForm roomId={roomId} />
          </div>
        </div>

        {/* Full width reviews section */}
        <RoomReviews reviews={reviews} />
      </div>
    </div>
  )
}