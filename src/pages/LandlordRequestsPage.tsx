import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { FileText, Check, X, Home, Calendar, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

export default function LandlordRequestsPage() {
  const [items, setItems] = useState<RentalRequestResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<{ id: number; status: string } | null>(null)

  const load = async (signal?: AbortSignal) => {
    setLoading(true)
    try {
      const res = await trustService.landlordRequests({ signal })
      if (signal?.aborted) return
      setItems(res)
    } catch (e) {
      if (signal?.aborted) return
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

  const openConfirmModal = (id: number, status: string) => {
    setSelectedAction({ id, status })
    setModalOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedAction) return
    try {
      await trustService.updateRequestStatus(selectedAction.id, selectedAction.status)
      toast.success(selectedAction.status === 'CONFIRMED' ? 'Solicitud confirmada' : 'Solicitud rechazada')
      setModalOpen(false)
      setSelectedAction(null)
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
            <BreadcrumbLink href="/landlord/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Solicitudes recibidas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Solicitudes recibidas</h1>
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
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Sin solicitudes"
          description="Aún no has recibido solicitudes de alquiler."
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
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {String(r.studentId).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Solicitud #{r.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">Estudiante #{r.studentId}</p>
                    </div>
                  </div>
                  <Badge className={STATUS_COLORS[r.status] ?? 'bg-gray-100 text-gray-700'}>
                    {STATUS_LABELS[r.status] ?? r.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Home className="h-4 w-4" />
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
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => openConfirmModal(r.id, 'CONFIRMED')}
                      >
                        <Check className="h-4 w-4" /> Confirmar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        onClick={() => openConfirmModal(r.id, 'REJECTED')}
                      >
                        <X className="h-4 w-4" /> Rechazar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatedModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedAction?.status === 'CONFIRMED' ? 'Confirmar solicitud' : 'Rechazar solicitud'}
      >
        <p className="text-sm text-muted-foreground mb-4">
          {selectedAction?.status === 'CONFIRMED'
            ? '¿Estás seguro de que deseas confirmar esta solicitud de alquiler?'
            : '¿Estás seguro de que deseas rechazar esta solicitud de alquiler?'}
        </p>
        <div className="flex gap-3">
          <Button
            onClick={confirmAction}
            className={`flex-1 ${selectedAction?.status === 'CONFIRMED' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-destructive text-destructive-foreground'}`}
          >
            {selectedAction?.status === 'CONFIRMED' ? 'Confirmar' : 'Rechazar'}
          </Button>
          <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
            Cancelar
          </Button>
        </div>
      </AnimatedModal>
    </div>
  )
}