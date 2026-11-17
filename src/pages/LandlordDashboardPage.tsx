import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home, FileText, ShieldCheck, ArrowRight, Plus, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { roomService } from '@/services/room.service'
import { Spotlight } from '@/components/aceternity/Spotlight'
import { BentoGrid } from '@/components/aceternity/BentoGrid'
import type { Page, RoomSummaryDTO } from '@/types/api'

export default function LandlordDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalRooms: 0, published: 0, draft: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    roomService.myRooms(0, 100, { signal: controller.signal })
      .then((res: Page<RoomSummaryDTO>) => {
        if (controller.signal.aborted) return
        setStats({
          totalRooms: res.totalElements,
          published: res.totalElements,
          draft: 0,
        })
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  const cards = [
    { title: 'Habitaciones', desc: 'Gestiona tus publicaciones', icon: Home, to: '/landlord/rooms', label: 'Gestionar habitaciones', color: 'text-primary' },
    { title: 'Solicitudes', desc: 'Revisa solicitudes de alquiler', icon: FileText, to: '/landlord/requests', label: 'Ver solicitudes', color: 'text-accent' },
    { title: 'Verificación', desc: 'Solicita verificación de identidad', icon: ShieldCheck, to: '/profile', label: 'Solicitar verificación', color: 'text-cta' },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="hsl(var(--primary))" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard arrendador</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Home className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard arrendador
            </h1>
          </div>
          <p className="text-muted-foreground">
            Bienvenido, {user?.firstName ?? 'arrendador'}. Gestiona tus habitaciones y solicitudes.
          </p>
        </motion.div>

        {/* Stats */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid gap-4 sm:grid-cols-3 mb-8"
          >
            <Card className="border-primary/20">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalRooms}</p>
                  <p className="text-sm text-muted-foreground">Total habitaciones</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-accent/20">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-accent/10 p-3">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.published}</p>
                  <p className="text-sm text-muted-foreground">Publicadas</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-cta/20">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-cta/10 p-3">
                  <Clock className="h-6 w-6 text-cta" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.draft}</p>
                  <p className="text-sm text-muted-foreground">Borradores</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BentoGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => {
              const Icon = c.icon
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <Card className="h-full transition hover:shadow-lg hover:border-primary/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Icon className={`h-5 w-5 ${c.color}`} />
                        </div>
                        <CardTitle>{c.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-sm text-muted-foreground">{c.desc}</p>
                      <Button asChild variant="outline" className="gap-2">
                        <Link to={c.to}>
                          {c.label} <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </BentoGrid>
        </motion.div>

        {/* Quick action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <Button asChild size="lg" className="gap-2 bg-cta-gradient text-white">
            <Link to="/landlord/rooms/new">
              <Plus className="h-5 w-5" />
              Publicar nueva habitación
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}