import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Calendar, Clock, Check, XCircle, Notebook, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { trustService } from '@/services/trust.service'
import { getErrorMessage } from '@/services/api'
import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimatedModal } from '@/components/aceternity/AnimatedModal'
import { toast } from 'sonner'
import type { VisitResponseDTO } from '@/types/api'

const VISIT_STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  CONFIRMED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  NO_SHOW: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  CANCELLED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

export default function VisitsPage() {
  const { requestId } = useParams()
  const rid = Number(requestId)
  const [items, setItems] = useState<VisitResponseDTO[]>([])
  const [scheduledAt, setScheduledAt] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<{ id: number; status: string } | null>(null)

  const load = async (signal?: AbortSignal) => {
    if (!rid) return
    setLoading(true)
    setError(null)
    try {
      const res = await trustService.listVisits(rid, { signal })
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
    if (!rid) return
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [rid])

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scheduledAt) return
    try {
      await trustService.createVisit(rid, { scheduledAt: new Date(scheduledAt).toISOString(), notes })
      toast.success('Visita agendada')
      setScheduledAt('')
      setNotes('')
      load()
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }

  const openActionModal = (id: number, status: string) => {
    setSelectedAction({ id, status })
    setModalOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedAction) return
    try {
      await trustService.updateVisitStatus(selectedAction.id, selectedAction.status)
      toast.success('Estado actualizado')
      setModalOpen(false)
      setSelectedAction(null)
      load()
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/my-requests">Mis solicitudes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Visitas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-6 flex items-center gap-3">
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Visitas de solicitud #{rid}</h1>
      </div>

      {/* Create visit form */}
      <Card className="mb-6 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" /> Agendar nueva visita
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={create} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Fecha y hora
                </Label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Notebook className="h-4 w-4" /> Notas
                </Label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas opcionales..."
                />
              </div>
            </div>
            <Button type="submit" className="gap-2 bg-cta-gradient text-white" disabled={loading}>
              <Calendar className="h-4 w-4" /> {loading ? 'Agendando...' : 'Agendar visita'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Visits list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => load()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reintentar
          </Button>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Sin visitas"
          description="Aún no hay visitas agendadas para esta solicitud."
        />
      ) : (
        <div className="space-y-3">
          {items.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="transition hover:shadow-md">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 font-medium">
                      <Clock className="h-4 w-4 text-primary" />
                      {new Date(v.scheduledAt).toLocaleString('es-PE', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                    {v.notes && (
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Notebook className="h-4 w-4" />
                        {v.notes}
                      </p>
                    )}
                    <Badge className={VISIT_STATUS_COLORS[v.status] ?? 'bg-gray-100 text-gray-700'}>
                      {v.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => openActionModal(v.id, 'CONFIRMED')}
                    >
                      <Check className="h-3 w-3" /> Confirmar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => openActionModal(v.id, 'COMPLETED')}
                    >
                      <Check className="h-3 w-3" /> Completada
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => openActionModal(v.id, 'NO_SHOW')}
                    >
                      <XCircle className="h-3 w-3" /> No asistió
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatedModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Actualizar estado de visita"
      >
        <p className="text-sm text-muted-foreground mb-4">
          ¿Deseas cambiar el estado de esta visita a{' '}
          <span className="font-medium text-foreground">{selectedAction?.status}</span>?
        </p>
        <div className="flex gap-3">
          <Button onClick={confirmAction} className="flex-1 bg-cta-gradient text-white">
            Confirmar
          </Button>
          <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
            Cancelar
          </Button>
        </div>
      </AnimatedModal>
    </div>
  )
}