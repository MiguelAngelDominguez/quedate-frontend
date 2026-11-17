import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Plus, Edit, Trash2, Eye, Archive, Home, MoreVertical, MapPin, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { roomService } from '@/services/room.service'
import { getErrorMessage } from '@/services/api'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/ui/pagination'
import { HoverBorderGradient } from '@/components/aceternity/HoverBorderGradient'
import type { Page, RoomSummaryDTO } from '@/types/api'

export default function LandlordRoomsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<Page<RoomSummaryDTO> | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = async (p = page, signal?: AbortSignal) => {
    setLoading(true)
    try {
      const res = await roomService.myRooms(p, 10, { signal })
      if (signal?.aborted) return
      setData(res)
    } catch (e) {
      if (signal?.aborted) return
      toast.error(getErrorMessage(e))
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    load(0, controller.signal)
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar habitación?')) return
    try {
      await roomService.remove(id)
      load(page)
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }

  const handlePublish = async (id: number) => {
    try {
      await roomService.publish(id)
      load(page)
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }

  const handleArchive = async (id: number) => {
    try {
      await roomService.archive(id)
      load(page)
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }

  const filteredRooms = data?.content ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/landlord/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Mis habitaciones</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Home className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Mis habitaciones</h1>
        </div>
        <Button onClick={() => navigate('/landlord/rooms/new')} className="gap-2 bg-cta-gradient text-white">
          <Plus className="h-4 w-4" />
          Nueva habitación
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <EmptyState
          icon={Home}
          title="Sin habitaciones"
          description="Aún no has publicado ninguna habitación."
          actionLabel="Crear habitación"
          onAction={() => navigate('/landlord/rooms/new')}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <HoverBorderGradient containerClassName="h-full" className="h-full">
                  <Card className="h-full overflow-hidden transition hover:shadow-lg">
                    {room.image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={room.image}
                          alt={room.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-1">{room.title}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Acciones de habitación">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/landlord/rooms/${room.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePublish(room.id)}>
                              <Eye className="mr-2 h-4 w-4" /> Publicar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleArchive(room.id)}>
                              <Archive className="mr-2 h-4 w-4" /> Archivar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(room.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{room.district}</span>
                        {room.universityName && (
                          <>
                            <GraduationCap className="h-3 w-3 ml-2" />
                            <span>{room.universityName}</span>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-foreground">S/ {room.price}</span>
                        <Badge variant="secondary">Disponible</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </HoverBorderGradient>
              </motion.div>
            ))}
          </div>

          {data && data.content.length > 0 && (
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onPageChange={(p) => { setPage(p); load(p) }}
              className="mt-6"
            />
          )}
        </>
      )}
    </div>
  )
}