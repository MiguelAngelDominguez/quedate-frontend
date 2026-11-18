import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ShieldCheck, Check, X, FileText, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { verificationService } from '@/services/verification.service'
import { getErrorMessage } from '@/services/api'
import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimatedModal } from '@/components/aceternity/AnimatedModal'
import { toast } from 'sonner'
import type { VerificationResponseDTO } from '@/types/api'

const VERIFICATION_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  APPROVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function AdminVerificationsPage() {
  const [items, setItems] = useState<VerificationResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<{ id: number; status: string } | null>(null)

  const load = async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const res = await verificationService.pending({ signal })
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

  const openActionModal = (id: number, status: string) => {
    setSelectedAction({ id, status })
    setModalOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedAction) return
    try {
      await verificationService.decide(selectedAction.id, selectedAction.status)
      toast.success(selectedAction.status === 'APPROVED' ? 'Verificación aprobada' : 'Verificación rechazada')
      setModalOpen(false)
      setSelectedAction(null)
      load()
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }

  const filteredItems = items.filter((v) => {
    if (statusFilter === 'all') return true
    return v.status === statusFilter
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
            <BreadcrumbPage>Verificaciones</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Verificaciones pendientes</h1>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="APPROVED">Aprobada</SelectItem>
            <SelectItem value="REJECTED">Rechazada</SelectItem>
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
          icon={ShieldCheck}
          title="Sin verificaciones pendientes"
          description="No hay solicitudes de verificación por revisar."
        />
      ) : (
        <div className="space-y-4">
          {filteredItems.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="transition hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {String(v.landlordId).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Verificación #{v.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">Arrendador #{v.landlordId}</p>
                    </div>
                  </div>
                  <Badge className={VERIFICATION_STATUS_COLORS[v.status] ?? 'bg-gray-100 text-gray-700'}>
                    {v.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>Tipo: {v.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>Documento: {v.documentReference}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => openActionModal(v.id, 'APPROVED')}
                    >
                      <Check className="h-4 w-4" /> Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => openActionModal(v.id, 'REJECTED')}
                    >
                      <X className="h-4 w-4" /> Rechazar
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
        title={selectedAction?.status === 'APPROVED' ? 'Aprobar verificación' : 'Rechazar verificación'}
      >
        <p className="text-sm text-muted-foreground mb-4">
          {selectedAction?.status === 'APPROVED'
            ? '¿Estás seguro de que deseas aprobar esta verificación?'
            : '¿Estás seguro de que deseas rechazar esta verificación?'}
        </p>
        <div className="flex gap-3">
          <Button
            onClick={confirmAction}
            className={`flex-1 ${selectedAction?.status === 'APPROVED' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-destructive text-destructive-foreground'}`}
          >
            {selectedAction?.status === 'APPROVED' ? 'Aprobar' : 'Rechazar'}
          </Button>
          <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
            Cancelar
          </Button>
        </div>
      </AnimatedModal>
    </div>
  )
}