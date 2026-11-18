import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { FileText, Calendar, MessageSquare, XCircle, Home as HomeIcon, Clock, CheckCircle2, X, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { trustService } from '@/services/trust.service'
import { getErrorMessage } from '@/services/api'
import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimatedModal } from '@/components/aceternity/AnimatedModal'
import { toast } from 'sonner'
import type { RentalRequestResponseDTO } from '@/types/api'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  CONFIRMED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  CANCELLED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  REJECTED: 'Rechazada',
  CANCELLED: 'Cancelada',
}

export default function MyRequestsPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<RentalRequestResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const load = async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const res = await trustService.myRentalRequests({ signal })
      if (signal?.aborted) return
      setItems(res)
    } catch (e) {
      if (signal?.aborted) return
      setError(getErrorMessage(e))
      toast.error(getErrorMessage(e))
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCancelModal = (id: number) => {
    setSelectedId(id)
    setCancelModalOpen(true)
  }

  const confirmCancel = async () => {
    if (!selectedId) return
    try {
      await trustService.updateRequestStatus(selectedId, 'CANCELLED')
      toast.success('Solicitud cancelada')
      setCancelModalOpen(false)
      setSelectedId(null)
      load()
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }

  const filteredItems = items.filter((r) => {
    if (statusFilter === 'all') return true
    return r.status === statusFilter
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Mis solicitudes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Mis solicitudes</h1>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="CONFIRMED">Confirmada</SelectItem>
            <SelectItem value="REJECTED">Rechazada</SelectItem>
            <SelectItem value="CANCELLED">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => load()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reintentar
          </Button>
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Sin solicitudes"
          description="Aún no has solicitado ninguna habitación. Explora las opciones disponibles."
          actionLabel="Buscar habitaciones"
          onAction={() => navigate('/rooms')}
        />
      ) : (
        <div className="space-y-4">
          {filteredItems.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="transition hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Solicitud #{r.id}</CardTitle>
                  <Badge className={STATUS_COLORS[r.status] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}>
                    {STATUS_LABELS[r.status] ?? r.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Timeline */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Creada</span>
                    </div>
                    <div className="h-px flex-1 bg-border" />
                    {r.status === 'CONFIRMED' && (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Confirmada</span>
                      </div>
                    )}
                    {r.status === 'REJECTED' && (
                      <div className="flex items-center gap-1 text-red-600">
                        <X className="h-4 w-4" />
                        <span>Rechazada</span>
                      </div>
                    )}
                    {r.status === 'CANCELLED' && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <X className="h-4 w-4" />
                        <span>Cancelada</span>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HomeIcon className="h-4 w-4" />
                      <span>Habitación: {r.roomId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{r.startDate} → {r.endDate}</span>
                    </div>
                  </div>

                  {r.message && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{r.message}</span>
                    </div>
                  )}

                  {r.status === 'PENDING' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-2 gap-2"
                      onClick={() => openCancelModal(r.id)}
                    >
                      <XCircle className="h-4 w-4" />
                      Cancelar solicitud
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatedModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancelar solicitud"
      >
        <p className="text-sm text-muted-foreground mb-4">
          ¿Estás seguro de que deseas cancelar esta solicitud? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <Button variant="destructive" onClick={confirmCancel} className="flex-1">
            Sí, cancelar
          </Button>
          <Button variant="outline" onClick={() => setCancelModalOpen(false)} className="flex-1">
            No, mantener
          </Button>
        </div>
      </AnimatedModal>
    </div>
  )
}